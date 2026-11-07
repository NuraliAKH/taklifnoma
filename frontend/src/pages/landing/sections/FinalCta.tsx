import { useRef } from 'react';
import { useLanguage } from '../../../App';
import { reachGoal } from '../../../utils/analytics';
import { useReveal, useSceneProgress } from '../scroll';
import { EnvelopePoster } from './Hero';

/** The envelope closes again in the WebGL layer while the user scrolls through this runway. */
export function FinalCta() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  useSceneProgress(ref, 'final', { start: 'top bottom', end: 'bottom bottom' });
  // once the footer pushes this section up, the fixed 3D envelope must follow it
  useSceneProgress(ref, 'finalOut', { start: 'bottom bottom', end: 'bottom top' });
  useReveal(innerRef, '0px 0px -20% 0px');

  return (
    <section ref={ref} className="lx-final" aria-labelledby="lx-final-title">
      <div className="lx-sticky">
        <div ref={innerRef} className="lx-final__inner">
          <EnvelopePoster className="lx-final__poster" label={t('sceneAlt')} />
          <h2 id="lx-final-title" className="lx-display-l lx-fade" style={{ maxWidth: '16ch' }}>{t('finalTitle')}</h2>
          <p className="lx-lead lx-fade" style={{ ['--d' as string]: '120ms' }}>{t('finalDesc')}</p>
          <a href="#catalog" className="lx-btn lx-fade" style={{ ['--d' as string]: '240ms' }} onClick={() => reachGoal('LANDING_CHOOSE_DESIGN', { from: 'final' })}>
            {t('finalCta')}
          </a>
          <div className="lx-final__social lx-fade" style={{ ['--d' as string]: '360ms' }}>
            <span className="lx-body" style={{ alignSelf: 'center' }}>{t('finalAsk')}</span>
            <a className="lx-link" href="https://t.me/web_taklifnoma" target="_blank" rel="noopener noreferrer">Telegram</a>
            <a className="lx-link" href="https://instagram.com/web_taklifnoma" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>
    </section>
  );
}
