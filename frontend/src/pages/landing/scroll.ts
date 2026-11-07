import { useEffect, type RefObject } from 'react';
import Lenis from 'lenis';

/** Mutable scroll state shared by DOM sections and the WebGL scene (read every frame, never causes React renders). */
export const scrollState = { hero: 0, open: 0, live: 0, final: 0, finalOut: 0, pointerX: 0, pointerY: 0 };
export type SceneKey = 'hero' | 'open' | 'live' | 'final' | 'finalOut';

/** Word count, so a second <Words> continues the first one's stagger. */
export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Lenis smooth scroll (it drives native window scroll, so plain scroll listeners keep working). Anchors like #catalog go through Lenis. */
export function useSmoothScroll() {
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    const lenis = prefersReducedMotion() ? null : new Lenis({ anchors: true, autoRaf: true, lerp: 0.1 }) // anchors respect CSS scroll-margin-top;
    return () => {
      window.removeEventListener('pointermove', onPointer);
      lenis?.destroy();
    };
  }, []);
}

// ---- Scroll progress: rect-based, so it never goes stale when content above changes height ----

type Tracker = () => void;
const trackers = new Set<Tracker>();
let frame = 0;
const flush = () => {
  frame = 0;
  trackers.forEach((t) => t());
};
const schedule = () => {
  if (!frame) frame = requestAnimationFrame(flush);
};

/** "top bottom" = when the element's top meets the viewport's bottom (ScrollTrigger-style notation). */
function edge(rect: DOMRect, word: string) {
  return word === 'bottom' ? rect.bottom : word === 'center' ? rect.top + rect.height / 2 : rect.top;
}
function viewportPos(word: string) {
  const h = window.innerHeight;
  if (word.endsWith('%')) return (parseFloat(word) / 100) * h;
  return word === 'bottom' ? h : word === 'center' ? h / 2 : 0;
}

/** 0..1 progress of `ref` between `start` and `end`, written to scrollState[key] and the element's --p CSS var. */
export function useSceneProgress(
  ref: RefObject<HTMLElement | null>,
  key: SceneKey | null,
  opts: { start?: string; end?: string; onUpdate?: (p: number) => void } = {},
) {
  const { start = 'top top', end = 'bottom bottom', onUpdate } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const [se, sv] = start.split(' ');
    const [ee, ev] = end.split(' ');
    let last = -1;
    const track = () => {
      const r = el.getBoundingClientRect();
      const s = viewportPos(sv) - edge(r, se); // px travelled past the start point
      const e = viewportPos(ev) - edge(r, ee); // px travelled past the end point (negative until reached)
      const p = s - e > 0 ? Math.min(1, Math.max(0, s / (s - e))) : s > 0 ? 1 : 0;
      if (p === last) return;
      last = p;
      if (key) scrollState[key] = p;
      if (key !== 'finalOut') el.style.setProperty('--p', p.toFixed(4));
      onUpdate?.(p);
    };
    trackers.add(track);
    track();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      trackers.delete(track);
      if (!trackers.size) {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
      }
      if (key) scrollState[key] = 0;
    };
  }, [ref, key, start, end, onUpdate]);
}

/** Sets data-in on the element once it scrolls into view (drives CSS reveals). Content stays in the DOM for crawlers. */
export function useReveal(ref: RefObject<HTMLElement | null>, rootMargin = '0px 0px -12% 0px') {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      el.setAttribute('data-in', '');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-in', '');
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
}
