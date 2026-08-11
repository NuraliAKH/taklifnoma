export const METRIKA_ID = Number(import.meta.env.VITE_YANDEX_METRIKA_ID || 111507566);

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

let initialized = false;
let lastTrackedUrl = '';

export function initMetrika() {
  if (initialized || !METRIKA_ID || typeof window === 'undefined') return;
  initialized = true;

  window.ym = window.ym || function (...args: unknown[]) {
    (window.ym as unknown as { a?: unknown[] }).a = (window.ym as unknown as { a?: unknown[] }).a || [];
    (window.ym as unknown as { a: unknown[] }).a.push(args);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  document.head.appendChild(script);

  window.ym(METRIKA_ID, 'init', {
    defer: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}

export function trackPageView(url: string) {
  if (!window.ym || url === lastTrackedUrl) return;
  lastTrackedUrl = url;
  window.ym(METRIKA_ID, 'hit', url, {
    title: document.title,
    referer: document.referrer,
  });
}

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  window.ym?.(METRIKA_ID, 'reachGoal', goal, params);
}
