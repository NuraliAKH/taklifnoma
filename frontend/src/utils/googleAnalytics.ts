export const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-BBMVVW2FX5';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;
let lastTrackedUrl = '';

export function initGoogleAnalytics() {
  if (initialized || !GOOGLE_ANALYTICS_ID || typeof window === 'undefined') return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function (...args: unknown[]) {
    window.dataLayer.push(args);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ANALYTICS_ID)}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GOOGLE_ANALYTICS_ID, { send_page_view: false });
}

export function trackGooglePageView(url: string) {
  if (!window.gtag || url === lastTrackedUrl) return;
  lastTrackedUrl = url;
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: url,
  });
}

export function trackGoogleEvent(eventName: string, params?: Record<string, unknown>) {
  window.gtag?.('event', eventName.toLowerCase(), params);
}
