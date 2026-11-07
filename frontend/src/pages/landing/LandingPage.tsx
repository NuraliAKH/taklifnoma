import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { API_URL, useTheme, getTemplateName, type Template } from '../../App';
import { prefersReducedMotion, useSmoothScroll } from './scroll';
import { Hero } from './sections/Hero';
import { Opening } from './sections/Opening';
import { LivePhone } from './sections/LivePhone';
import { Catalog } from './sections/Catalog';
import { Steps } from './sections/Steps';
import { Faq } from './sections/Faq';
import { FinalCta } from './sections/FinalCta';
import './landing.css';

const Scene = lazy(() => import('./three/Scene'));

/** If WebGL throws, keep the static poster instead of a blank page. */
class SceneBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Template shown inside the live phone: the Malika & Ulugʻbek design if present, otherwise any website template. */
function pickShowcase(list: Template[]) {
  const sites = list.filter((t) => t.type === 'website');
  const byName = (s: string) => sites.find((t) => getTemplateName(t).toLowerCase().includes(s));
  return byName('malika') ?? byName('hilal') ?? sites[0];
}

export function LandingPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [templates, setTemplates] = useState<Template[]>([]);
  const [scene, setScene] = useState<'poster' | 'ready' | 'none'>('poster');
  const [mountScene, setMountScene] = useState(false);
  useSmoothScroll();

  useEffect(() => {
    fetch(`${API_URL}/templates`)
      .then((res) => res.json())
      .then((data) => setTemplates(Array.isArray(data) ? data : data?.data || []))
      .catch((err) => console.error(err));
  }, []);

  // Load the WebGL chunk after first paint so the headline and poster are the LCP, not the canvas.
  useEffect(() => {
    if (prefersReducedMotion() || !hasWebGL()) {
      setScene('none');
      return;
    }
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => setMountScene(true);
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 300);
  }, []);

  return (
    <div className="lx" data-scene={scene}>
      {mountScene && (
        <SceneBoundary onFail={() => setScene('none')}>
          <Suspense fallback={null}>
            <Scene key={theme} isDark={isDark} onReady={() => setScene('ready')} />
          </Suspense>
        </SceneBoundary>
      )}
      <div className="lx-content">
        <Hero />
        <Opening />
        <LivePhone template={pickShowcase(templates)} />
        <Catalog templates={templates} />
        <Steps />
        <Faq />
        <FinalCta />
      </div>
    </div>
  );
}
