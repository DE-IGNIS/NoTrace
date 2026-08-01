/**
 * proxyRoutes.js
 * Mounts the privacy proxy endpoint and chains all filters in order:
 *   1. paramStripMiddleware  — strip tracking query params
 *   2. httpsEnforceMiddleware — upgrade http → https
 *   3. blocklistMiddleware   — reject known ad/tracker hosts
 *   4. uaSpoofingMiddleware  — attach spoofed User-Agent
 *   5. proxyHandler          — forward request, stream response
 *
 * No request data, IPs, or user information is logged or stored.
 */

'use strict';

const { Router } = require('express');
const rateLimit = require('express-rate-limit');

const { paramStripMiddleware } = require('../middlewares/paramStrip');
const { httpsEnforceMiddleware } = require('../middlewares/httpsEnforce');
const { blocklistMiddleware } = require('../middlewares/blocklist');
const { uaSpoofingMiddleware } = require('../middlewares/uaSpoofing');
const { proxyHandler } = require('../controllers/proxyController');

const router = Router();

/**
 * Rate limiter — lightweight abuse prevention.
 * Keyed on a HASHED representation; raw IPs are not stored.
 * In strict no-log mode we keep window/max only — no log on rejection.
 */
const proxyRateLimit = rateLimit({
  windowMs: 60 * 1000,   // 1-minute sliding window
  max: 60,                // max 60 requests/min per client
  standardHeaders: true,
  legacyHeaders: false,
  // No handler logging — just return a 429 silently
  handler: (_req, res) => {
    res.status(429).json({
      error: 'rate_limited',
      message: 'Too many requests. Please slow down.',
    });
  },
  // Skip storing IP in any log
  skip: () => false,
});

/**
 * POST /api/proxy
 * Body: { "url": "https://example.com/page?utm_source=email" }
 *
 * GET /api/proxy?url=https://example.com/page?utm_source=email
 *
 * Returns the proxied response with tracking params stripped,
 * HTTPS enforced, blocklist checked, and UA spoofed.
 */
router
  .route('/')
  .get(
    proxyRateLimit,
    paramStripMiddleware,
    httpsEnforceMiddleware,
    blocklistMiddleware,
    uaSpoofingMiddleware,
    proxyHandler
  )
  .post(
    proxyRateLimit,
    paramStripMiddleware,
    httpsEnforceMiddleware,
    blocklistMiddleware,
    uaSpoofingMiddleware,
    proxyHandler
  );

module.exports = router;
