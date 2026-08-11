import { initGoogleAnalytics, trackGoogleEvent, trackGooglePageView } from './googleAnalytics';
import { initMetrika, reachGoal as reachMetrikaGoal, trackPageView as trackMetrikaPageView } from './metrika';

export const ANALYTICS_CONSENT_KEY = 'analytics-consent';

export function hasAnalyticsConsent() {
  return typeof window !== 'undefined' && window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === 'accepted';
}

export function initAnalytics() {
  if (!hasAnalyticsConsent()) return;
  initMetrika();
  initGoogleAnalytics();
}

export function trackPageView(url: string) {
  if (!hasAnalyticsConsent()) return;
  trackMetrikaPageView(url);
  trackGooglePageView(url);
}

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (!hasAnalyticsConsent()) return;
  reachMetrikaGoal(goal, params);
  trackGoogleEvent(goal, params);
}
