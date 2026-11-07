import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage, TemplatePreview, type Template } from '../../../App';
import { useSceneProgress } from '../scroll';

const FEATURE_START = 0.1;
const FEATURE_SPAN = 0.22;

function Rsvp() {
  const { t } = useLanguage();
  return (
    <div className="lx-rsvp" aria-hidden>
      <div className="lx-rsvp__card" />
      <div className="lx-rsvp__card" />
      <div className="lx-rsvp__flip">
        <div className="lx-rsvp__card lx-rsvp__face">
          <small>RSVP</small>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem' }}>Malika &amp; Ulugʻbek</span>
        </div>
        <div className="lx-rsvp__card lx-rsvp__face lx-rsvp__face--back">
          <small>{t('demoGuest')}</small>
          <strong>{t('demoRsvp')}</strong>
          <small>{t('demoReplies')}</small>
        </div>
      </div>
    </div>
  );
}

function MapPlan() {
  const { t } = useLanguage();
  return (
    <div className="lx-map" aria-hidden>
      <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
        <g stroke="var(--line)" strokeWidth="1" fill="none">
          {[20, 50, 80, 110, 140].map((y) => <path key={y} d={`M0 ${y} L320 ${y - 14}`} />)}
          {[30, 90, 150, 210, 270].map((x) => <path key={x} d={`M${x} 0 L${x + 22} 150`} />)}
          <circle cx="118" cy="62" r="20" />
          <circle cx="118" cy="62" r="9" />
        </g>
        <path d="M-10 128 C60 100 90 120 140 92 S230 40 330 52" stroke="var(--turquoise)" strokeWidth="3" fill="none" opacity=".7" />
        <ellipse className="lx-pin-shadow" cx="212" cy="88" rx="10" ry="3" fill="#000" />
        <g className="lx-pin">
          <path d="M212 86 C204 74 198 68 198 60 a14 14 0 0 1 28 0 c0 8 -6 14 -14 26z" fill="var(--wax)" />
          <circle cx="212" cy="60" r="5" fill="var(--gold)" />
        </g>
        <text x="16" y="140" fontSize="11" fill="var(--text-2)" fontFamily="Inter, sans-serif">{t('demoVenue')}</text>
      </svg>
    </div>
  );
}

function FlipDigit({ value }: { value: string }) {
  const prev = useRef(value);
  const old = prev.current;
  useEffect(() => {
    prev.current = value;
  }, [value]);
  return (
    <span className="lx-flip">
      <span className="lx-flip__half lx-flip__half--top"><span>{value}</span></span>
      <span className="lx-flip__half lx-flip__half--bot"><span>{value}</span></span>
      {old !== value && (
        <span key={value} className="lx-flip__leaf"><span>{old}</span></span>
      )}
    </span>
  );
}

function FlipClock({ active }: { active: boolean }) {
  const { t } = useLanguage();
  const [left, setLeft] = useState(41 * 1440 + 7 * 60 + 38); // minutes until the demo toi
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setLeft((m) => m - 1), 1400);
    return () => window.clearInterval(id);
  }, [active]);
  const units: [number, string][] = [
    [Math.floor(left / 1440), t('timerDays')],
    [Math.floor((left % 1440) / 60), t('timerHours')],
    [left % 60, t('timerMinutes')],
  ];
  return (
    <div className="lx-clock" aria-hidden>
      {units.map(([v, label]) => (
        <div className="lx-clock__unit" key={label}>
          <div className="lx-clock__digits">
            {String(v).padStart(2, '0').split('').map((d, i) => <FlipDigit key={i} value={d} />)}
          </div>
          {label}
        </div>
      ))}
    </div>
  );
}

function Vinyl() {
  return (
    <div aria-hidden>
      <div className="lx-vinyl" />
      <div className="lx-wave">
        {Array.from({ length: 22 }, (_, k) => (
          <i key={k} style={{ ['--k' as string]: k, ['--h' as string]: ((k * 37) % 11) / 10 }} />
        ))}
      </div>
    </div>
  );
}

export function LivePhone({ template }: { template?: Template }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  const onUpdate = useCallback((p: number) => {
    const scroller = phoneRef.current?.querySelector<HTMLElement>('.website-preview-scroll');
    if (scroller) {
      const k = Math.min(1, Math.max(0, (p - 0.06) / 0.9));
      scroller.scrollTop = k * (scroller.scrollHeight - scroller.clientHeight);
    }
    const i = p < FEATURE_START ? -1 : Math.min(3, Math.floor((p - FEATURE_START) / FEATURE_SPAN));
    setActive((prev) => (prev === i ? prev : i));
  }, []);
  useSceneProgress(ref, 'live', { onUpdate });

  const features = [
    { title: t('adv1Title'), desc: t('adv1Desc'), obj: <Rsvp /> },
    { title: t('adv2Title'), desc: t('adv2Desc'), obj: <MapPlan /> },
    { title: t('adv3Title'), desc: t('adv3Desc'), obj: <FlipClock active={active === 2} /> },
    { title: t('adv4Title'), desc: t('adv4Desc'), obj: <Vinyl /> },
  ];

  return (
    <section ref={ref} className="lx-live" aria-labelledby="lx-live-title">
      <div className="lx-sticky">
        <div className="lx-live__head lx-wrap">
          <h2 id="lx-live-title" className="lx-eyebrow" style={{ margin: 0 }}>{t('liveTitle')}</h2>
        </div>
        <div className="lx-live__stage">
          <div ref={phoneRef} className="lx-phone" style={{ pointerEvents: 'none' }}>
            {template ? (
              <TemplatePreview template={template} formData={{}} catalogMode isOpened />
            ) : (
              <div style={{ width: 340, height: 640, borderRadius: '2.5rem', background: 'var(--surface)' }} />
            )}
          </div>
          {features.map((f, i) => (
            <article key={i} className="lx-feat" data-side={i % 2 ? 'r' : 'l'} data-active={active === i || undefined}>
              <div className="lx-feat__obj">{f.obj}</div>
              <h3>{f.title}</h3>
              <p className="lx-body">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
