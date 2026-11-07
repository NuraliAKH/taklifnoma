import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../App';
import { reachGoal } from '../../../utils/analytics';
import { useReveal, useSceneProgress, wordCount } from '../scroll';
import { Words } from './Words';

/** Static envelope drawing: shown before WebGL is ready and as the no-WebGL / reduced-motion fallback. */
export function EnvelopePoster({ className, label }: { className?: string; label: string }) {
  return (
    <svg className={className} viewBox="0 0 320 230" role="img" aria-label={label}>
      <defs>
        <linearGradient id="lx-paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4ecdc" />
          <stop offset="1" stopColor="#ddd0b6" />
        </linearGradient>
        <linearGradient id="lx-foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6a2b" />
          <stop offset=".45" stopColor="#f1d999" />
          <stop offset="1" stopColor="#a8823d" />
        </linearGradient>
        <radialGradient id="lx-wax" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#a8343a" />
          <stop offset="1" stopColor="#5c1418" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="218" rx="130" ry="8" fill="#000" opacity=".25" />
      <rect x="10" y="10" width="300" height="200" rx="3" fill="url(#lx-paper)" />
      <path d="M10 210 L160 118 L310 210" fill="none" stroke="#c8b998" strokeWidth="1" />
      <rect x="22" y="22" width="276" height="176" fill="none" stroke="url(#lx-foil)" strokeWidth="1.5" />
      <path d="M10 10 L160 128 L310 10 Z" fill="#efe5d2" stroke="#cdbf9f" strokeWidth=".8" />
      <path d="M30 18 L160 120 L290 18" fill="none" stroke="url(#lx-foil)" strokeWidth="1.2" />
      <circle cx="160" cy="124" r="24" fill="url(#lx-wax)" />
      <circle cx="160" cy="124" r="16" fill="none" stroke="#c9a45c" strokeOpacity=".7" strokeWidth="1" />
      <image href="/logo_icon.webp" x="149" y="113" width="22" height="22" opacity=".85" />
    </svg>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, '0px');
  useSceneProgress(ref, 'hero', { start: 'top top', end: 'bottom top' });
  const p1 = t('heroTitlePart1');

  return (
    <section ref={ref} className="lx-hero" aria-labelledby="lx-h1">
      <EnvelopePoster className="lx-poster" label={t('sceneAlt')} />
      <div className="lx-wrap lx-hero__grid">
        <div className="lx-hero__text">
          <h1 id="lx-h1" className="lx-display-xl">
            <Words text={p1} />
            <Words text={t('heroTitleHighlight')} from={wordCount(p1)} className="lx-em" />
          </h1>
          <p className="lx-lead lx-fade" style={{ ['--d' as string]: '350ms' }}>{t('heroSubtitle')}</p>
          <div className="lx-hero__actions lx-fade" style={{ ['--d' as string]: '500ms' }}>
            <a href="#catalog" className="lx-btn" onClick={() => reachGoal('LANDING_CHOOSE_DESIGN', { from: 'hero' })}>
              {t('heroChooseDesign')}
            </a>
            <a href="#how-it-works" className="lx-link">
              {t('heroHowItWorks')} <ArrowRight size={16} aria-hidden />
            </a>
          </div>
          <dl className="lx-stats lx-fade" style={{ ['--d' as string]: '650ms' }}>
            <div><dt>{t('heroStat1Value')}</dt><dd>{t('heroStat1Label')}</dd></div>
            <div><dt>{t('heroStat2Value')}</dt><dd>{t('heroStat2Label')}</dd></div>
            <div><dt>{t('heroStat3Value')}</dt><dd>{t('heroStat3Label')}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
