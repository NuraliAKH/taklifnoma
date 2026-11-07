import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage, useTheme, useIsMobile, PaginationBar, TemplatePreview, getMediaUrl, getTemplateName, type Template } from '../../../App';
import { reachGoal } from '../../../utils/analytics';
import { useReveal } from '../scroll';

const ITEMS_PER_PAGE = 6;

function TemplateCard({ template, index }: { template: Template; index: number }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, '0px 0px -8% 0px');

  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`);
    e.currentTarget.style.setProperty('--rx', `${(0.5 - (e.clientY - r.top) / r.height) * 6}deg`);
  };
  const untilt = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--ry', '0deg');
    e.currentTarget.style.setProperty('--rx', '0deg');
  };

  const badge = template.type === 'website' ? t('badgeWebsite') : template.type === 'physical' ? t('badgePrint') : t('badgePhoto');
  const category = template.category === 'wedding' ? t('catWedding') : template.category === 'birthday' ? t('catBirthday') : template.category;
  const hasDiscount = template.discount_price !== null && template.discount_price !== undefined;
  const fmt = (n: number) => `${Number(n || 0).toLocaleString('ru-RU')} ${t('cardPriceCurrency')}`;

  return (
    <div
      ref={ref}
      className="lx-card"
      style={{ ['--d' as string]: `${(index % 3) * 90}ms` }}
      onPointerMove={tilt}
      onPointerLeave={untilt}
      onClick={() => {
        reachGoal('LANDING_TEMPLATE_CLICK', { templateId: template.id });
        navigate(`/editor/${template.id}`);
      }}
    >
      <div className="lx-card__media">
        {template.type === 'website' ? (
          <div className="lx-card__preview">
            <div>
              <TemplatePreview template={template} formData={{}} autoScrollOnHover catalogMode />
            </div>
          </div>
        ) : (
          <img src={getMediaUrl(template.media_url)} alt="" loading="lazy" decoding="async" />
        )}
        <div className="lx-card__badge"><span className="lx-eyebrow">{badge}</span></div>
      </div>
      <div className="lx-card__body">
        <div>
          <h3 className="lx-card__title">
            {/* Card click bubbles from this button, so keyboard and pointer share one handler */}
            <button type="button" className="lx-card__hit">{getTemplateName(template)}</button>
          </h3>
          <p className="lx-card__meta">
            {category} ·{' '}
            {template.type === 'website'
              ? t('cardFormatWebsite')
              : `${t('cardSizeLabel')} ${template.text_config.dimensions?.width}×${template.text_config.dimensions?.height}`}
          </p>
        </div>
        <div className="lx-card__foot">
          <span className="lx-price">
            {hasDiscount && <s>{fmt(template.price)}</s>}
            {fmt(hasDiscount ? (template.discount_price as number) : template.price)}
          </span>
          <span className="lx-card__cta">
            {t('cardCreate')} <ArrowRight size={16} aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}

export function Catalog({ templates }: { templates: Template[] }) {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('website');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(6);
  const mobileSentinelRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLDivElement>(null);
  useReveal(headRef);

  useEffect(() => {
    setCurrentPage(1);
    setMobileVisibleCount(6);
  }, [categoryFilter, typeFilter]);

  const filteredTemplates = templates.filter((tpl) => {
    if (tpl.media_url?.endsWith('.mp4')) return false;
    const matchCategory = categoryFilter === 'all' || tpl.category === categoryFilter || tpl.type === 'website';
    const matchType =
      typeFilter === 'all' ||
      (typeFilter === 'virtual_photo' && tpl.type === 'virtual') ||
      (typeFilter === 'physical' && tpl.type === 'physical') ||
      (typeFilter === 'website' && tpl.type === 'website');
    return matchCategory && matchType;
  });

  // Mobile infinite scroll
  useEffect(() => {
    if (!isMobile) return;
    const sentinel = mobileSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMobileVisibleCount((prev) => (prev < filteredTemplates.length ? Math.min(prev + 6, filteredTemplates.length) : prev));
        }
      },
      { rootMargin: '250px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isMobile, filteredTemplates.length, mobileVisibleCount]);

  const displayed = isMobile
    ? filteredTemplates.slice(0, mobileVisibleCount)
    : filteredTemplates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const types = [
    { id: 'virtual_photo', label: t('filterTypePhoto'), disabled: false },
    { id: 'website', label: t('filterTypeWebsite'), disabled: false },
    { id: 'physical', label: t('filterTypePhysical'), disabled: true },
  ];
  const categories = [
    { id: 'all', label: t('catAll') },
    { id: 'wedding', label: t('catWedding') },
    { id: 'birthday', label: t('catBirthday') },
  ];

  return (
    <section id="catalog" className="lx-catalog" aria-labelledby="lx-catalog-title">
      <div className="lx-wrap">
        <div ref={headRef} className="lx-catalog__head">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: '36rem' }}>
            <h2 id="lx-catalog-title" className="lx-display-l">{t('catalogTitle')}</h2>
            <p className="lx-body lx-fade">{t('catalogSubtitle')}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="lx-chips" role="group" aria-label={t('catalogTitle')}>
              {types.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="lx-chip"
                  disabled={item.disabled}
                  aria-pressed={typeFilter === item.id}
                  title={item.disabled ? t('disabledNotice') : undefined}
                  onClick={() => !item.disabled && setTypeFilter(item.id)}
                >
                  {item.label}
                  {item.disabled && <small>{t('badgeSoon')}</small>}
                </button>
              ))}
            </div>
            <div className="lx-chips" role="group" aria-label={t('catAll')}>
              {categories.map((item) => (
                <button key={item.id} type="button" className="lx-chip" aria-pressed={categoryFilter === item.id} onClick={() => setCategoryFilter(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredTemplates.length > 0 ? (
          <>
            <div className="lx-grid">
              {displayed.map((tpl, i) => <TemplateCard key={tpl.id} template={tpl} index={i} />)}
            </div>
            {!isMobile && (
              <PaginationBar
                currentPage={currentPage}
                totalPages={Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE) || 1}
                onPageChange={setCurrentPage}
                totalItems={filteredTemplates.length}
                itemsPerPage={ITEMS_PER_PAGE}
                isDark={theme === 'dark'}
              />
            )}
            {isMobile && mobileVisibleCount < filteredTemplates.length && (
              <div ref={mobileSentinelRef} style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={24} color="var(--gold)" aria-hidden />
              </div>
            )}
          </>
        ) : (
          <div className="lx-empty">
            <p className="lx-body">{t('noTemplatesFound')}</p>
            <p className="lx-body" style={{ color: 'var(--text-3)' }}>{t('tryChangingFilter')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
