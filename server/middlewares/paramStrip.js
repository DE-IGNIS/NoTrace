/**
 * paramStrip.js
 * Strips known tracking/analytics query parameters from the target URL.
 * No user data is logged or persisted.
 */

'use strict';

// Known tracking parameter patterns (exact matches and prefix patterns)
const TRACKING_PARAMS = new Set([
  // Google / UTM
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'utm_source_platform',
  'utm_creative_format',
  'utm_marketing_tactic',
  // Google Ads
  'gclid',
  'gclsrc',
  'dclid',
  'gbraid',
  'wbraid',
  // Facebook / Meta
  'fbclid',
  'fb_action_ids',
  'fb_action_types',
  'fb_source',
  'fb_ref',
  // Microsoft / Bing
  'msclkid',
  // Twitter / X
  'twclid',
  // Pinterest
  'epik',
  // Mailchimp
  'mc_cid',
  'mc_eid',
  // HubSpot
  '_hsenc',
  '_hsmi',
  'hsa_acc',
  'hsa_cam',
  'hsa_grp',
  'hsa_ad',
  'hsa_src',
  'hsa_tgt',
  'hsa_kw',
  'hsa_mt',
  'hsa_net',
  'hsa_ver',
  // Marketo
  'mkt_tok',
  // Drip
  '__s',
  // Vero
  'vero_id',
  'vero_conv',
  // Yandex
  'yclid',
  // Yahoo
  'ysclid',
  // General click/session IDs
  'ref',
  'referrer',
  'source',
  'trk',
  'trkInfo',
  'sxsrf',
  'si',
  // Adobe Analytics
  's_kwcid',
  'ef_id',
  // Outbrain / Taboola
  'obOrigUrl',
  'rcii',
]);

// Prefix-based patterns (any param starting with these is stripped)
const TRACKING_PREFIXES = ['utm_', 'fb_', 'hsa_', 'igshid'];

/**
 * Strips all known tracking parameters from a URL string.
 * @param {string} rawUrl - The URL to sanitize.
 * @returns {string} The cleaned URL.
 */
function stripTrackingParams(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    // If URL is invalid, return as-is — validation happens upstream
    return rawUrl;
  }

  const cleaned = new URLSearchParams();

  for (const [key, value] of parsed.searchParams.entries()) {
    const lowerKey = key.toLowerCase();
    const isExact = TRACKING_PARAMS.has(lowerKey) || TRACKING_PARAMS.has(key);
    const isPrefix = TRACKING_PREFIXES.some((prefix) =>
      lowerKey.startsWith(prefix)
    );

    if (!isExact && !isPrefix) {
      cleaned.append(key, value);
    }
  }

  parsed.search = cleaned.toString();
  return parsed.toString();
}

/**
 * Express middleware — reads `targetUrl` from req.body or req.query,
 * strips tracking params, and stores the cleaned URL back for downstream use.
 */
function paramStripMiddleware(req, res, next) {
  const raw = req.body?.url || req.query?.url;

  if (!raw) {
    return next();
  }

  req.cleanedUrl = stripTrackingParams(raw);
  next();
}

module.exports = { paramStripMiddleware, stripTrackingParams };
