/**
 * proxyController.js
 * Core proxy forwarding logic.
 *
 * Privacy guarantees:
 *  - No request URLs, IPs, or any user data are logged or stored.
 *  - Client IP headers (x-forwarded-for, x-real-ip) are stripped from outbound requests.
 *  - Only a curated, minimal set of safe response headers are forwarded back to the client.
 *  - All requests use the spoofed User-Agent set by uaSpoofingMiddleware.
 */

'use strict';

const axios = require('axios');

// Headers forwarded FROM client → upstream (whitelist only)
const SAFE_REQUEST_HEADERS = new Set([
  'accept',
  'accept-language',
  'accept-encoding',
  'content-type',
  'content-length',
  'range',
  'cache-control',
]);

// Headers forwarded FROM upstream → client (whitelist only)
const SAFE_RESPONSE_HEADERS = new Set([
  'content-type',
  'content-length',
  'content-encoding',
  'content-language',
  'content-range',
  'cache-control',
  'etag',
  'last-modified',
  'expires',
  'accept-ranges',
  'transfer-encoding',
]);

// Headers that must NEVER be forwarded (identity / tracking leaks)
const STRIP_CLIENT_HEADERS = new Set([
  'x-forwarded-for',
  'x-real-ip',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-forwarded-port',
  'forwarded',
  'via',
  'referer',
  'origin',
  'cookie',
  'authorization',
]);

/**
 * Builds a sanitized header map for the outbound request.
 * - Strips all identity/tracking headers
 * - Injects the spoofed User-Agent
 * @param {import('express').Request} req
 * @returns {Record<string, string>}
 */
function buildOutboundHeaders(req) {
  const headers = {};

  for (const [key, value] of Object.entries(req.headers)) {
    const lower = key.toLowerCase();
    if (STRIP_CLIENT_HEADERS.has(lower)) continue;
    if (SAFE_REQUEST_HEADERS.has(lower)) {
      headers[lower] = value;
    }
  }

  // Always override User-Agent with spoofed value
  headers['user-agent'] = req.spoofedUserAgent || 'Mozilla/5.0';

  // Never send cookies upstream
  delete headers['cookie'];

  return headers;
}

/**
 * Filters upstream response headers before sending back to the client.
 * Removes server fingerprinting and tracking headers.
 * @param {Record<string, string>} upstreamHeaders
 * @returns {Record<string, string>}
 */
function filterResponseHeaders(upstreamHeaders) {
  const safe = {};
  for (const [key, value] of Object.entries(upstreamHeaders)) {
    if (SAFE_RESPONSE_HEADERS.has(key.toLowerCase())) {
      safe[key.toLowerCase()] = value;
    }
  }
  return safe;
}

/**
 * Main proxy handler.
 * Expects req.cleanedUrl to be set by upstream middlewares.
 *
 * @type {import('express').RequestHandler}
 */
async function proxyHandler(req, res) {
  const targetUrl = req.cleanedUrl;

  if (!targetUrl) {
    return res.status(400).json({
      error: 'missing_url',
      message: 'A target URL is required. Pass it as { "url": "..." } in the request body or as ?url= in the query string.',
    });
  }

  // Validate it's a proper URL
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return res.status(400).json({
      error: 'invalid_url',
      message: 'The provided URL is not valid.',
    });
  }

  // Only allow http/https schemes
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({
      error: 'invalid_scheme',
      message: 'Only http and https URLs are supported.',
    });
  }

  const outboundHeaders = buildOutboundHeaders(req);

  let upstreamResponse;
  try {
    upstreamResponse = await axios({
      method: req.method === 'GET' ? 'GET' : 'POST',
      url: targetUrl,
      headers: outboundHeaders,
      data: req.method === 'POST' ? req.body : undefined,
      // Stream the response body so large payloads don't buffer in memory
      responseType: 'stream',
      // Reasonable timeout to avoid hanging open connections
      timeout: 15000,
      // Do not throw on non-2xx — let us forward the status code
      validateStatus: () => true,
      // Follow redirects (up to 5 hops)
      maxRedirects: 5,
    });
  } catch (err) {
    // Network error — do NOT expose internal error details
    return res.status(502).json({
      error: 'upstream_error',
      message: 'The proxy could not reach the destination.',
    });
  }

  // Forward only safe response headers
  const safeHeaders = filterResponseHeaders(upstreamResponse.headers);
  for (const [key, value] of Object.entries(safeHeaders)) {
    res.setHeader(key, value);
  }

  res.status(upstreamResponse.status);

  // Pipe the upstream response body directly to the client
  upstreamResponse.data.pipe(res);

  // Ensure the client socket closes if upstream closes
  upstreamResponse.data.on('error', () => {
    res.end();
  });
}

module.exports = { proxyHandler };
