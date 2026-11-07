/**
 * Builds direct navigation URL for Yandex Maps.
 * Matches: https://yandex.uz/maps/?text=...
 */
export function getYandexMapsUrl(venue?: string, address?: string): string {
  const query = [venue, address]
    .filter(Boolean)
    .map((s) => s!.trim())
    .filter(Boolean)
    .join(', ');

  return query ? `https://yandex.uz/maps/?text=${encodeURIComponent(query)}` : 'https://yandex.uz/maps/';
}

/**
 * Builds direct navigation URL for Google Maps.
 * Matches: https://www.google.com/maps/search/?api=1&query=...
 */
export function getGoogleMapsUrl(venue?: string, address?: string): string {
  const query = [venue, address]
    .filter(Boolean)
    .map((s) => s!.trim())
    .filter(Boolean)
    .join(', ');

  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : 'https://www.google.com/maps';
}
