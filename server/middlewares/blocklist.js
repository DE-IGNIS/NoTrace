/**
 * blocklist.js
 * Loads a static JSON-based ad/tracker domain blocklist and
 * provides an Express middleware that rejects requests to blocked hosts.
 * No user data is logged or persisted.
 */

'use strict';

const path = require('path');

// Load blocklist once at startup — no runtime I/O per request
const { domains: RAW_DOMAINS } = require(
  path.join(__dirname, '..', 'data', 'blocklist.json')
);

/**
 * Build a Set of lowercase hostnames for O(1) lookup.
 * Strips any path component so entries like "facebook.com/tr"
 * still match on the hostname alone.
 */
const BLOCKED_HOSTS = new Set(
  RAW_DOMAINS.map((entry) => {
    try {
      // If it looks like a full URL, extract hostname
      if (entry.includes('/')) {
        return new URL('https://' + entry).hostname.toLowerCase();
      }
      return entry.toLowerCase();
    } catch {
      return entry.toLowerCase();
    }
  })
);

/**
 * Checks whether a given URL's hostname (or any parent domain) is blocked.
 * e.g. "sub.doubleclick.net" matches blocklist entry "doubleclick.net".
 *
 * @param {string} rawUrl
 * @returns {{ blocked: boolean, host: string }}
 */
function isBlocked(rawUrl) {
  let hostname = '';
  try {
    hostname = new URL(rawUrl).hostname.toLowerCase();
  } catch {
    return { blocked: false, host: '' };
  }

  // Check exact match and all parent domains
  const parts = hostname.split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    const candidate = parts.slice(i).join('.');
    if (BLOCKED_HOSTS.has(candidate)) {
      return { blocked: true, host: hostname };
    }
  }

  return { blocked: false, host: hostname };
}

/**
 * Express middleware — blocks requests whose cleaned target URL resolves
 * to a host on the blocklist. Returns 403 with a minimal JSON body.
 * No identifying information is included in the response.
 */
function blocklistMiddleware(req, res, next) {
  const targetUrl = req.cleanedUrl;

  if (!targetUrl) {
    return next();
  }

  const { blocked } = isBlocked(targetUrl);

  if (blocked) {
    return res.status(403).json({
      error: 'blocked',
      message: 'Request destination is on the privacy blocklist.',
    });
  }

  next();
}

module.exports = { blocklistMiddleware, isBlocked, BLOCKED_HOSTS };
