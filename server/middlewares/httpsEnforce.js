/**
 * httpsEnforce.js
 * Upgrades http:// URLs to https:// for all outbound proxy requests.
 * No user data is logged or persisted.
 */

'use strict';

/**
 * Upgrades an http:// URL to https://.
 * If already https:// or cannot be parsed, returns the original.
 * @param {string} rawUrl
 * @returns {string}
 */
function enforceHttps(rawUrl) {
  if (!rawUrl) return rawUrl;

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === 'http:') {
      parsed.protocol = 'https:';
    }
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

/**
 * Express middleware — upgrades req.cleanedUrl from http to https.
 * Runs after paramStripMiddleware.
 */
function httpsEnforceMiddleware(req, res, next) {
  if (req.cleanedUrl) {
    req.cleanedUrl = enforceHttps(req.cleanedUrl);
  }
  next();
}

module.exports = { httpsEnforceMiddleware, enforceHttps };
