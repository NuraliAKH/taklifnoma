import { initGoogleAnalytics, trackGoogleEvent, trackGooglePageView } from './googleAnalytics';
import { initMetrika, reachGoal as reachMetrikaGoal, trackPageView as trackMetrikaPageView } from './metrika';

export function initAnalytics() {
  initMetrika();
  initGoogleAnalytics();
}

export function trackPageView(url: string) {
  trackMetrikaPageView(url);
  trackGooglePageView(url);
}

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  reachMetrikaGoal(goal, params);
  trackGoogleEvent(goal, params);
}
