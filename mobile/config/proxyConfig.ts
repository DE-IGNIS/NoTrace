/**
 * proxyConfig.ts
 * Single source of truth for the backend proxy URL.
 *
 * Set EXPO_PUBLIC_PROXY_BASE_URL in your .env file:
 *
 *   Android emulator (AVD) : http://10.0.2.2:3000
 *   Physical device (LAN)  : http://192.168.X.X:3000  ← your machine's LAN IP
 *   ngrok / tunnel         : https://xxxx.ngrok.io
 *   Cloud deployment       : https://your-deployed-url.com
 *
 * Note: Expo only exposes variables prefixed with EXPO_PUBLIC_ to the JS bundle.
 */

const RAW_BASE = process.env.EXPO_PUBLIC_PROXY_BASE_URL ?? 'http://10.0.2.2:3000';

// Strip trailing slash so callers can always append /api/...
export const PROXY_BASE_URL = RAW_BASE.replace(/\/$/, '');

export const PROXY_ENDPOINT = `${PROXY_BASE_URL}/api/proxy`;
export const HEALTH_ENDPOINT = `${PROXY_BASE_URL}/api/health`;
