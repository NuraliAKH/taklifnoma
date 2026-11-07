import { useReducedMotion } from 'framer-motion';

/**
 * Returns true if the user prefers reduced motion OR if the template is currently
 * rendered inside an editor/catalog preview container.
 * Templates must check this flag to turn off infinite animations (particles, pulses, shimmers).
 */
export function useCalmMotion(isPreview?: boolean): boolean {
  const shouldReduceMotion = useReducedMotion();
  return Boolean(shouldReduceMotion || isPreview);
}
