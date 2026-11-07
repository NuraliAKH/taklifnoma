import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../../App';

export function Faq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: t('faqQ1'), a: t('faqA1') },
    { q: t('faqQ2'), a: t('faqA2') },
    { q: t('faqQ3'), a: t('faqA3') },
    { q: t('faqQ4'), a: t('faqA4') },
  ];

  return (
    <section className="lx-faq" aria-labelledby="lx-faq-title">
      <div className="lx-wrap lx-faq__grid">
        <h2 id="lx-faq-title" className="lx-display-l">{t('faqTitle')}</h2>
        <div className="lx-faq__list">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="lx-faq__item">
                <h3 style={{ margin: 0 }}>
                  <button
                    type="button"
                    className="lx-faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`lx-faq-${i}`}
                    id={`lx-faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span className="lx-faq__icon" aria-hidden />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`lx-faq-${i}`}
                      role="region"
                      aria-labelledby={`lx-faq-q-${i}`}
                      className="lx-faq__a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.2, 0.75, 0.15, 1] }}
                    >
                      <p className="lx-body">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
