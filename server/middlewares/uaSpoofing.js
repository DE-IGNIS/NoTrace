/**
 * uaSpoofing.js
 * Overrides the User-Agent header on all outbound proxy requests
 * to prevent fingerprinting of the original client.
 * No user data is logged or persisted.
 */

'use strict';

/**
 * A neutral, widely-used User-Agent string that avoids leaking
 * client-specific information (browser version, OS build, device model).
 * Rotated from a small pool for basic variance without tracking.
 */
const USER_AGENT_POOL = [
  // Chrome on Windows (generic)
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  // Firefox on Windows (generic)
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
  // Chrome on macOS (generic)
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  // Safari on macOS (generic)
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
];

/**
 * Returns a User-Agent from the pool, selected pseudo-randomly.
 * Does NOT persist state or use identifiable seeds.
 * @returns {string}
 */
function getSpoofedUserAgent() {
  const idx = Math.floor(Math.random() * USER_AGENT_POOL.length);
  return USER_AGENT_POOL[idx];
}

/**
 * Express middleware — attaches a spoofed User-Agent to req for
 * use by the proxy controller when building outbound headers.
 */
function uaSpoofingMiddleware(req, res, next) {
  req.spoofedUserAgent = getSpoofedUserAgent();
  next();
}

module.exports = { uaSpoofingMiddleware, getSpoofedUserAgent };
