/**
 * proxyService.ts
 * Stateless helpers for building proxy URLs and checking proxy health.
 * No logging, no state, no side effects.
 */

import { PROXY_ENDPOINT, HEALTH_ENDPOINT } from '../config/proxyConfig';

/**
 * Builds the full proxy URL for a given target URL.
 * The WebView will load this URL; the backend will forward to the real destination.
 *
 * Format: GET {PROXY_ENDPOINT}?url={encodedTargetUrl}
 *
 * @param targetUrl - The real destination URL (already validated / https-prefixed)
 * @returns The proxy-wrapped URL string
 */
export function buildProxyUrl(targetUrl: string): string {
  return `${PROXY_ENDPOINT}?url=${encodeURIComponent(targetUrl)}`;
}

/**
 * Extracts the original target URL from a proxy URL, if it is one.
 * Returns null if the URL is not a proxy URL.
 *
 * Used to show the real URL in the address bar / history even when
 * the WebView is currently loading through the proxy.
 *
 * @param proxyUrl - A URL that may or may not be a proxy URL
 * @returns The decoded real URL, or null
 */
export function extractTargetFromProxyUrl(proxyUrl: string): string | null {
  try {
    const parsed = new URL(proxyUrl);
    const targetParam = parsed.searchParams.get('url');
    if (!targetParam) return null;

    // Only treat it as a proxy URL if the path matches our endpoint
    if (!parsed.pathname.endsWith('/proxy')) return null;

    return decodeURIComponent(targetParam);
  } catch {
    return null;
  }
}

/**
 * Returns true if the given URL was issued through our proxy.
 * @param url - Any URL string
 */
export function isProxiedUrl(url: string): boolean {
  return extractTargetFromProxyUrl(url) !== null;
}

/**
 * Pings the backend health endpoint to check reachability.
 * Resolves to true if the server is up, false otherwise.
 * Times out after 5 seconds.
 */
export async function checkProxyHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(HEALTH_ENDPOINT, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}
