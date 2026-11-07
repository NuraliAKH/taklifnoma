export const API_URL: string = import.meta.env.VITE_API_URL || '/api';

/**
 * Resolves media URLs:
 * - Leaves absolute URLs (http, https), data URLs, and blob URLs as-is
 * - Preserves local static assets from /public (e.g. /olive-editorial-*, /wedding_doves*)
 * - Prepends the API URL to relative backend media paths
 */
export function getMediaUrl(url?: string): string {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  if (url.startsWith('/olive-editorial-') || url.startsWith('/wedding_doves')) {
    return url;
  }
  const cleanBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}
