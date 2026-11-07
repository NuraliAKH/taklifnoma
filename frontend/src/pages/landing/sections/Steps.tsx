import { useRef } from 'react';
import { useLanguage } from '../../../App';
import { useReveal, useSceneProgress, wordCount } from '../scroll';
import { Words } from './Words';

export function Steps() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  useReveal(headRef);
  useSceneProgress(ref, null, { start: 'top 70%', end: 'bottom 60%' });
  const part1 = t('stepsTitlePart1');

  const steps = [
    { n: '1', title: t('step1Title'), desc: t('step1Desc') },
    { n: '2', title: t('step2Title'), desc: t('step2Desc') },
    { n: '3', title: t('step3Title'), desc: t('step3Desc') },
  ];

  return (
    <section ref={ref} id="how-it-works" className="lx-steps" aria-labelledby="lx-steps-title">
      <div className="lx-wrap">
        <h2 ref={headRef} id="lx-steps-title" className="lx-display-l" style={{ maxWidth: '14ch' }}>
          <Words text={part1} />
          <Words text={t('stepsTitleHighlight')} from={wordCount(part1)} className="lx-em" />
        </h2>
        <div className="lx-steps__body">
          {/* Gold thread, revealed by scroll progress (--p) */}
          <svg className="lx-thread" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <path className="lx-thread--wide" d="M4 16 C 6 36, 26 32, 36 44 L 37 58 C 40 74, 56 70, 61 84" />
            <path className="lx-thread--narrow" d="M5.5 4 L 5.5 92" />
          </svg>
          <ol className="lx-steps__list">
          {steps.map((s) => (
            <li key={s.n} className="lx-step">
              <span className="lx-numeral" aria-hidden>{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p className="lx-body">{s.desc}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
