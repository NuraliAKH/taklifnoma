import { useRef } from 'react';
import { useLanguage } from '../../../App';
import { useSceneProgress } from '../scroll';

/** Tall scroll runway; the envelope opens in the WebGL layer while this caption sits on top. */
export function Opening() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  useSceneProgress(ref, 'open');

  return (
    <section ref={ref} className="lx-open" aria-labelledby="lx-open-title">
      <div className="lx-sticky">
        <div className="lx-open__caption">
          <h2 id="lx-open-title" className="lx-display-m">{t('openTitle')}</h2>
          <p className="lx-body">{t('openDesc')}</p>
        </div>
      </div>
    </section>
  );
}
