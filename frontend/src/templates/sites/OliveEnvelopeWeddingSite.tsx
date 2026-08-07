import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Clock3,
  Heart,
  Music2,
  Pause,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
import type { WebsiteTemplateProps } from './types';
import { useCountdownTimer } from '../../utils/timer';
import './OliveEnvelopeWeddingSite.css';

const DEFAULT_HERO = '/olive-editorial-hero.webp';
const DEFAULT_VENUE = '/olive-editorial-venue.webp';
const DEFAULT_DETAIL = '/olive-editorial-details.webp';

export const DRESS_PALETTES: Record<string, string[]> = {
  default: ['#465443', '#73806a', '#a9ad98', '#aabbd0', '#d8e0e5', '#f6f2e9'],
  'olive-emerald': ['#0F4C3A', '#1B4D3E', '#537C6C', '#D4AF37', '#E8D7A1', '#FDFBF7'],
  'olive-champagne': ['#D8C3A5', '#E6D7C3', '#C7A17A', '#D6B680', '#F0E5D7', '#FAF8F5'],
  'olive-dusty-rose': ['#C48B9F', '#D8A7B1', '#E8B4A2', '#F1C9BE', '#9A5F75', '#FFF9FA'],
  'olive-dusty-blue': ['#8E9AAF', '#AEB8C7', '#9BAF9D', '#C9D4D0', '#E6EBEF', '#FFFFFF'],
  'olive-navy': ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#C0C0C0', '#EEF3F8'],
  'olive-burgundy': ['#581845', '#6B1724', '#8B3042', '#B76E79', '#D4AF37', '#F4E8DC'],
};

const getMediaUrl = (url?: string) => {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  if (url.startsWith('/olive-editorial-')) return url;
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const origin = apiUrl.replace(/\/api\/?$/, '');
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
};

const addMinutes = (time: string, minutes: number) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return time;
  const total = (Number(match[1]) * 60 + Number(match[2]) + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const Reveal: React.FC<React.PropsWithChildren<{ className?: string; delay?: number }>> = ({
  children,
  className = '',
  delay = 0,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 34, filter: 'blur(8px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, amount: 0.16 }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const SectionTitle: React.FC<{ eyebrow?: string; children: React.ReactNode; light?: boolean }> = ({ eyebrow, children, light = false }) => (
  <div className="text-center">
    {eyebrow && <p className={`olive-label mb-3 text-[9px] font-semibold ${light ? 'text-white/70' : 'text-[#737b55]'}`}>{eyebrow}</p>}
    <h2 className={`olive-section-title olive-script leading-[.96] ${light ? 'text-white' : 'text-[#303529]'}`}>{children}</h2>
  </div>
);

export const OliveEnvelopeWeddingSite: React.FC<WebsiteTemplateProps> = ({
  data,
  lang = 'ru',
  isOpened = false,
  onOpenEnvelope,
  isPlaying = false,
  onToggleAudio,
  timeLeft,
  rsvpState,
  isPreview = false,
  visualVariant = 'default',
  onLanguageChange,
}) => {
  const [localOpened, setLocalOpened] = useState(false);
  const [activeLang, setActiveLang] = useState<'ru' | 'uz' | 'en'>(lang);
  const [localName, setLocalName] = useState('');
  const [localAttending, setLocalAttending] = useState<boolean | null>(null);
  const [localGuestCount, setLocalGuestCount] = useState(1);
  const [localWishes, setLocalWishes] = useState('');
  const [localSuccess, setLocalSuccess] = useState(false);
  const opened = isOpened || localOpened;
  const countdown = useCountdownTimer(data.date, data.time, timeLeft);

  useEffect(() => {
    if (isPreview || opened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isPreview, opened]);

  useEffect(() => {
    if (isPreview && !isOpened) setLocalOpened(false);
  }, [isOpened, isPreview]);

  useEffect(() => {
    setActiveLang(lang);
  }, [lang]);

  const changeLanguage = (nextLang: 'ru' | 'uz' | 'en') => {
    setActiveLang(nextLang);
    onLanguageChange?.(nextLang);
  };

  const locale = activeLang === 'uz' ? 'uz-UZ' : activeLang === 'en' ? 'en-US' : 'ru-RU';
  const copy = activeLang === 'uz'
    ? {
        invite: 'To‘yga taklifnoma', open: 'Taklifnomani oching', scroll: 'Pastga suring', dear: 'Aziz mehmonlar!',
        intro: 'Hayotimizdagi eng muhim kunni siz bilan birga nishonlashni istaymiz.',
        day: 'Bizning kunimiz', schedule: 'Kechki dastur', place: 'Tadbir manzili',
        dress: 'Dress-kod', dressText: 'Bayramimiz ranglarini qo‘llab-quvvatlasangiz, xursand bo‘lamiz.',
        details: 'Tafsilotlar', rsvp: 'Mehmon anketasi', yes: 'Albatta kelaman', no: 'Afsuski, kela olmayman', send: 'Javobni yuborish', thanks: 'Rahmat, javobingiz qabul qilindi!',
        musicOrbit: 'MUSIQANI YOQISH UCHUN BOSING · ', musicPlay: 'Musiqani yoqish', musicPause: 'Musiqani pauza qilish',
        detailsText: 'Biz uchun eng muhimi — sizning ishtirokingiz. Iltimos, oq rangni kelin uchun qoldiring va o‘zingiz bilan ajoyib kayfiyat olib keling.',
        countdown: 'Uchrashuvimizgacha', days: 'kun', hours: 'soat', minutes: 'daqiqa', seconds: 'soniya',
        rsvpIntro: 'Iltimos, mehmon uchun qisqa anketani to‘ldiring.', namePlaceholder: 'Ism va familiyangiz', guestCount: 'Mehmonlar soni', wishesPlaceholder: 'Yangi turmush qurganlarga tilaklaringiz',
        ceremony: 'Marosim', dinner: 'Bayram kechasi', cake: 'Tort', finale: 'Yakun',
        defaultGroom: 'Daniil', defaultBride: 'Anna', defaultAddress: 'Toshkent, Amir Temur ko‘chasi, 108', fallbackMonth: 'avgust', fallbackWeekday: 'chorshanba',
      }
    : activeLang === 'en'
      ? {
          invite: 'Wedding invitation', open: 'Open invitation', scroll: 'Scroll down', dear: 'Dear guests!',
          intro: 'We would love to share the most important day of our lives with you.',
          day: 'Our day', schedule: 'Evening schedule', place: 'Wedding venue',
          dress: 'Dress code', dressText: 'We would be delighted if you supported the palette of our celebration.',
          details: 'Details', rsvp: 'Guest RSVP', yes: 'Joyfully accept', no: 'Regretfully decline', send: 'Send response', thanks: 'Thank you, your response is saved!',
          musicOrbit: 'TAP TO TURN ON THE MUSIC · ', musicPlay: 'Play music', musicPause: 'Pause music',
          detailsText: 'Your presence is the greatest gift to us. Please leave white for the bride and bring your wonderful mood.',
          countdown: 'Until we meet', days: 'days', hours: 'hours', minutes: 'minutes', seconds: 'seconds',
          rsvpIntro: 'Please complete the short guest form.', namePlaceholder: 'Your full name', guestCount: 'Number of guests', wishesPlaceholder: 'Your wishes for the couple',
          ceremony: 'Ceremony', dinner: 'Wedding dinner', cake: 'Wedding cake', finale: 'Finale',
          defaultGroom: 'Daniel', defaultBride: 'Anna', defaultAddress: '108 Amir Temur Street, Tashkent', fallbackMonth: 'August', fallbackWeekday: 'Wednesday',
        }
      : {
          invite: 'Приглашение на свадьбу', open: 'Открыть приглашение', scroll: 'Листайте вниз', dear: 'Дорогие гости!',
          intro: 'Мы очень хотим сделать этот день особенным, поэтому приглашаем вас разделить с нами торжество, посвящённое дню нашей свадьбы.',
          day: 'Наш день', schedule: 'Программа вечера', place: 'Место проведения',
          dress: 'Дресс-код', dressText: 'Мы будем очень благодарны, если вы поддержите цветовую палитру нашей свадьбы.',
          details: 'Детали', rsvp: 'Анкета гостя', yes: 'С радостью приду', no: 'К сожалению, не смогу', send: 'Отправить ответ', thanks: 'Спасибо, ваш ответ принят!',
          musicOrbit: 'НАЖМИТЕ, ЧТОБЫ ВКЛЮЧИТЬ МУЗЫКУ · ', musicPlay: 'Включить музыку', musicPause: 'Поставить музыку на паузу',
          detailsText: 'Самое главное для нас — ваше присутствие. Пожалуйста, оставьте белый цвет для невесты и возьмите с собой прекрасное настроение.',
          countdown: 'До нашей встречи', days: 'дней', hours: 'часов', minutes: 'минут', seconds: 'секунд',
          rsvpIntro: 'Пожалуйста, заполните короткую анкету гостя.', namePlaceholder: 'Имя и фамилия', guestCount: 'Количество гостей', wishesPlaceholder: 'Ваши пожелания молодожёнам',
          ceremony: 'Церемония', dinner: 'Начало банкета', cake: 'Торт', finale: 'Финал',
          defaultGroom: 'Даниил', defaultBride: 'Анна', defaultAddress: 'Ташкент, ул. Амира Темура, 108', fallbackMonth: 'августа', fallbackWeekday: 'среда',
        };

  const groomName = data.groomName || copy.defaultGroom;
  const brideName = data.brideName || copy.defaultBride;
  const stackCoupleNames = groomName.trim().length + brideName.trim().length > 18;
  const date = data.date || '2026-08-12';
  const time = data.time || '17:00';
  const venue = data.venue || 'Villa Verde';
  const address = data.address || copy.defaultAddress;
  const heroPhoto = getMediaUrl(data.photoUrl) || DEFAULT_HERO;
  const venuePhoto = getMediaUrl(data.venuePhoto || data.photos?.[0]) || DEFAULT_VENUE;
  const detailPhoto = getMediaUrl(data.photos?.[1]) || DEFAULT_DETAIL;
  const hidden = new Set(Array.isArray(data.hiddenSections) ? data.hiddenSections : []);
  const sectionVisible = (name: string, flag?: boolean) => !hidden.has(name) && flag !== false;

  const dateInfo = useMemo(() => {
    const parsed = new Date(`${date}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return { day: '12', month: copy.fallbackMonth, numericMonth: '08', year: '2026', weekday: copy.fallbackWeekday, prev: '11', next: '13' };
    }
    const day = parsed.getDate();
    const previousDate = new Date(parsed);
    previousDate.setDate(day - 1);
    const nextDate = new Date(parsed);
    nextDate.setDate(day + 1);
    return {
      day: String(day).padStart(2, '0'),
      month: parsed.toLocaleDateString(locale, { month: 'long' }),
      numericMonth: String(parsed.getMonth() + 1).padStart(2, '0'),
      year: String(parsed.getFullYear()),
      weekday: parsed.toLocaleDateString(locale, { weekday: 'long' }),
      prev: String(previousDate.getDate()).padStart(2, '0'),
      next: String(nextDate.getDate()).padStart(2, '0'),
    };
  }, [copy.fallbackMonth, copy.fallbackWeekday, date, locale]);

  const schedule = Array.isArray(data.schedule) && data.schedule.length
    ? data.schedule
    : [
        { time, title: 'Welcome' },
        { time: addMinutes(time, 30), title: copy.ceremony },
        { time: addMinutes(time, 60), title: copy.dinner },
        { time: addMinutes(time, 300), title: copy.cake },
        { time: addMinutes(time, 360), title: copy.finale },
      ];

  const openEnvelope = () => {
    setLocalOpened(true);
    onOpenEnvelope?.();
  };

  const submitLocal = (event: React.FormEvent) => {
    event.preventDefault();
    if (rsvpState) {
      rsvpState.onSubmit(event);
      return;
    }
    setLocalSuccess(true);
  };

  const attending = rsvpState?.attending ?? localAttending;
  const rsvpName = rsvpState?.name ?? localName;
  const success = rsvpState?.isSuccess ?? localSuccess;
  const guestCount = rsvpState?.guestCount ?? localGuestCount;
  const wishes = rsvpState?.wishes ?? localWishes;
  const paletteClass = visualVariant.startsWith('olive-') ? `olive-palette-${visualVariant.slice(6)}` : '';
  const defaultDressPalette = DRESS_PALETTES[visualVariant] || DRESS_PALETTES.default;
  const dressPalette = useMemo(() => {
    if (Array.isArray(data.dressColors) && data.dressColors.length > 0) {
      return data.dressColors;
    }
    if (typeof data.dressColors === 'string' && data.dressColors.trim()) {
      return data.dressColors.split(',').map((c: string) => c.trim()).filter(Boolean);
    }
    return defaultDressPalette;
  }, [data.dressColors, visualVariant, defaultDressPalette]);

  return (
    <div className={`olive-invite ${paletteClass}`}>
      <div className="olive-invite-inner relative bg-[#f4eedf]">
        <div
          className={`olive-language-switcher ${isPreview ? 'absolute' : 'fixed'} left-1/2 top-5 z-[140] flex -translate-x-1/2 items-center gap-1 rounded-full p-1`}
          role="group"
          aria-label="Language / Til / Язык"
        >
          {(['ru', 'uz', 'en'] as const).map((language) => (
            <button
              key={language}
              type="button"
              className="olive-language-button rounded-full px-3 py-1.5 font-sans text-[9px] font-semibold uppercase tracking-[.12em]"
              data-active={activeLang === language}
              aria-pressed={activeLang === language}
              onClick={() => changeLanguage(language)}
            >
              {language}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {!opened && (
            <motion.div
              className={`${
                isPreview
                  ? 'absolute left-0 top-0 h-[640px] max-h-[100svh] min-h-[480px] w-full'
                  : 'fixed inset-0 min-h-[100svh]'
              } olive-envelope z-[100] flex cursor-pointer items-center justify-center`}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, visibility: 'hidden' }}
              transition={{ duration: 0.28, delay: 2.9, ease: 'easeOut' }}
              onClick={openEnvelope}
            >
              <motion.div
                className="olive-envelope-top olive-envelope-panel"
                exit={{ y: '-104%' }}
                transition={{ duration: 1.75, delay: 1.12, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.div
                className="olive-envelope-left olive-envelope-panel"
                exit={{ x: '-106%' }}
                transition={{ duration: 1.28, delay: 0.24, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.div
                className="olive-envelope-right olive-envelope-panel"
                exit={{ x: '106%' }}
                transition={{ duration: 1.28, delay: 0.24, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.div
                className="olive-envelope-bottom olive-envelope-panel"
                exit={{ y: '108%' }}
                transition={{ duration: 1.75, delay: 1.12, ease: [0.76, 0, 0.24, 1] }}
              />

              <motion.div
                className="pointer-events-none absolute top-[15%] z-20 w-full px-6 text-center"
                exit={{ y: '-220%' }}
                transition={{ duration: 1.75, delay: 1.12, ease: [0.76, 0, 0.24, 1] }}
              >
                <p className="olive-label mb-4 text-[9px] opacity-70">{dateInfo.day} · {dateInfo.month} · {dateInfo.year}</p>
                <h1 className="olive-script text-5xl leading-none sm:text-6xl">{copy.invite}</h1>
              </motion.div>

              <motion.button
                type="button"
                className="olive-seal absolute left-1/2 top-[57%] z-30 h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 rounded-full text-[#633f2d]"
                whileHover={{ scale: 1.08, rotate: -4 }}
                whileTap={{ scale: 0.9 }}
                exit={{ scale: 0.2, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                aria-label={copy.open}
              >
                <span className="olive-seal-mark">
                  {groomName.trim().charAt(0).toUpperCase()} & {brideName.trim().charAt(0).toUpperCase()}
                </span>
              </motion.button>

              <motion.p
                className="olive-label absolute bottom-[15%] z-30 text-[9px] font-semibold"
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
              >
                {copy.open}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <main aria-hidden={!opened && !isPreview}>
          <section
            className="olive-hero olive-torn-bottom flex items-end justify-center overflow-hidden"
            style={isPreview ? { height: 520, minHeight: 520 } : undefined}
          >
            <motion.img
              src={heroPhoto}
              alt={`${groomName} & ${brideName}`}
              className="absolute inset-0 h-full w-full object-cover grayscale"
              initial={{ scale: 1.12 }}
              animate={opened ? { scale: 1 } : { scale: 1.12 }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="relative z-10 mb-20 w-full px-6 text-center text-[#fff9eb]"
              initial={{ opacity: 0, y: 48 }}
              animate={opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
              transition={{ duration: isPreview ? 0.65 : 1, delay: isPreview ? 0.08 : 0.9 }}
            >
              <p className="olive-label mb-5 text-[9px] font-medium opacity-80">{copy.invite}</p>
              <h1 className={`olive-couple-names olive-script leading-[.78] drop-shadow-lg ${stackCoupleNames ? 'is-stacked' : 'whitespace-nowrap'}`}>
                <span>{groomName}</span>
                <span className="olive-couple-amp mx-2 text-[.55em]">&</span>
                <span>{brideName}</span>
              </h1>
              <div className="mt-8 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-white/60" />
                <span className="olive-label text-[11px]">{dateInfo.day} / {dateInfo.numericMonth}</span>
                <span className="h-px w-10 bg-white/60" />
              </div>
            </motion.div>
            <motion.div
              className="olive-scroll-cue absolute bottom-10 right-3 z-20 flex items-center gap-2 text-[#fff9eb]/75"
              initial={{ opacity: 0 }}
              animate={opened ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: isPreview ? .35 : 1.55, duration: .7 }}
            >
              <span className="olive-label text-[6px] font-semibold">{copy.scroll}</span>
              <motion.span
                className="block h-8 w-px bg-current"
                animate={{ scaleY: [0.35, 1, 0.35], opacity: [.45, 1, .45] }}
                transition={{ duration: 1.7, repeat: Infinity }}
              />
            </motion.div>
          </section>

          {sectionVisible('letter') && (
          <section id="letter" className="olive-paper-section olive-screen-section px-6 pb-24 pt-14 sm:px-12">
            <Reveal className="flex justify-center">
              <button
                type="button"
                onClick={onToggleAudio}
                className="relative flex h-28 w-28 items-center justify-center rounded-full text-[#3f4630]"
                aria-label={isPlaying ? copy.musicPause : copy.musicPlay}
              >
                <svg className={`olive-music-orbit absolute inset-0 h-full w-full ${isPlaying ? '' : 'is-paused'}`} viewBox="0 0 120 120" aria-hidden="true">
                  <defs><path id="oliveMusicPath" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" /></defs>
                  <text fill="currentColor" fontFamily="Montserrat" fontSize="8" letterSpacing="2.1">
                    <textPath href="#oliveMusicPath">{copy.musicOrbit}</textPath>
                  </text>
                </svg>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#3f4630]/40 bg-[#f7f1e4] shadow-sm">
                  {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Music2 className="h-4 w-4" />}
                </span>
              </button>
            </Reveal>

            <Reveal className="mx-auto mt-12 max-w-lg text-center">
              <SectionTitle>{copy.dear}</SectionTitle>
              <p className="mx-auto mt-7 max-w-sm font-sans text-[12px] leading-[1.85] text-[#4d5144]">{data.loveStory || copy.intro}</p>
            </Reveal>

          </section>
          )}

          {sectionVisible('calendar') && (
            <section id="date" className="olive-paper-section olive-screen-section px-6 py-24 sm:px-12">
              <Reveal className="mx-auto max-w-md" delay={0.08}>
                <p className="olive-label mb-4 text-center text-[9px] font-semibold text-[#737b55]">{copy.day}</p>
                <SectionTitle>{dateInfo.month}</SectionTitle>
                <div className="olive-date-grid text-center">
                  <div>
                    <p className="olive-label text-[7px] opacity-60">{dateInfo.month}</p>
                    <p className="mt-2 text-3xl opacity-45">{dateInfo.prev}</p>
                  </div>
                  <div className="relative">
                    <p className="olive-label text-[7px] opacity-60">{dateInfo.weekday}</p>
                    <p className="olive-date-ring mt-2 text-4xl font-medium">{dateInfo.day}</p>
                  </div>
                  <div>
                    <p className="olive-label text-[7px] opacity-60">{dateInfo.year}</p>
                    <p className="mt-2 text-3xl opacity-45">{dateInfo.next}</p>
                  </div>
                </div>
                <p className="olive-label mt-7 text-center text-[8px] font-semibold text-[#737b55]">
                  {dateInfo.day} / {dateInfo.numericMonth} / {dateInfo.year} · {time}
                </p>
              </Reveal>
            </section>
          )}

          {sectionVisible('schedule') && (
            <section id="timeline" className="olive-paper-section olive-screen-section px-6 pb-24 sm:px-12">
              <Reveal><p className="olive-label mb-5 text-center text-[8px] font-semibold text-[#737b55]">{copy.schedule}</p></Reveal>
              <div className="olive-route mx-auto max-w-lg" style={{ height: Math.max(1040, schedule.length * 205) }}>
                <svg className="olive-route-line" viewBox="0 0 260 1040" preserveAspectRatio="none" aria-hidden="true">
                  <motion.path
                    d="M130 0 C252 90 258 205 132 270 C4 336 8 454 132 520 C254 586 256 704 132 770 C8 836 8 940 132 1000 C168 1018 181 1030 176 1040"
                    fill="none"
                    stroke="var(--olive-line)"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 3.2, ease: 'easeInOut' }}
                  />
                </svg>
                <div className="relative z-10 flex h-full flex-col justify-around py-8">
                  {schedule.map((item: any, index: number) => (
                    <motion.div
                      key={`${item.time}-${index}`}
                      className={`relative flex min-h-36 items-center ${index % 2 ? 'justify-end text-left' : 'justify-start text-right'}`}
                      initial={{ opacity: 0, x: index % 2 ? 34 : -34 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.45 }}
                      transition={{ duration: 0.65, delay: index * 0.06 }}
                    >
                      <div className={`w-[44%] ${index % 2 ? 'pl-2' : 'pr-2'}`}>
                        <p className="olive-script text-[clamp(1.9rem,9.5cqi,2.65rem)] leading-[.92]">{item.title}</p>
                        <p className="mt-1 font-sans text-[13px] tracking-wide text-[#4f5540]">{item.time}</p>
                      </div>
                      <motion.span
                        className="olive-heart absolute -ml-[10px]"
                        style={{ left: ['50%', '39%', '61%', '40%', '58%', '45%'][index % 6], top: '50%', marginTop: -10 }}
                        animate={{ rotate: 45, scale: [1, 1.12, 1] }}
                        transition={{ duration: 2, delay: index * 0.35, repeat: Infinity }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {sectionVisible('venue') && (
            <section id="venue" className="olive-paper-section olive-screen-section pb-20 pt-20">
              <Reveal className="px-6 sm:px-12"><SectionTitle eyebrow={dateInfo.day + ' · ' + dateInfo.month}>{copy.place}</SectionTitle></Reveal>
              <Reveal className="mx-auto mt-9 max-w-sm px-7 text-center" delay={0.08}>
                <h3 className="olive-script text-[2.35rem] leading-none text-[#303529]">{venue}</h3>
                <p className="mt-3 font-sans text-[10px] leading-relaxed tracking-wide text-[#606555]">{address}</p>
                <div className="mt-5 flex items-center justify-center gap-2 text-[#737b55]">
                  <Clock3 className="h-3.5 w-3.5" />
                  <span className="olive-label text-[8px] font-semibold">{time}</span>
                </div>
              </Reveal>
              <Reveal className="mt-9" delay={0.1}>
                <div className="olive-photo-card olive-torn-top olive-torn-bottom h-[440px] sm:h-[540px]">
                  <img src={venuePhoto} alt={venue} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-[#30352a]/20" />
                </div>
              </Reveal>
            </section>
          )}

          {sectionVisible('dressCode', data.showDressCode) && (
            <section className="olive-paper-section px-6 pb-24 pt-6 sm:px-12">
              <Reveal>
                <SectionTitle>{copy.dress}</SectionTitle>
                <p className="mx-auto mt-6 max-w-sm text-center text-base leading-relaxed text-[#54584a]">{copy.dressText}</p>
                <div className="mt-9 flex justify-center gap-2.5">
                  {dressPalette.map((color, index) => (
                    <motion.span
                      key={color}
                      className="h-10 w-10 rounded-sm border border-black/5 shadow-sm sm:h-12 sm:w-12"
                      style={{ backgroundColor: color }}
                      initial={{ opacity: 0, y: 18, rotate: -8 }}
                      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08, type: 'spring' }}
                    />
                  ))}
                </div>
              </Reveal>
            </section>
          )}

          {sectionVisible('details') && (
            <section className="olive-photo-card olive-torn-top olive-torn-bottom relative min-h-[620px] overflow-hidden">
              <motion.img
                src={detailPhoto}
                alt={copy.details}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1.6 }}
              />
              <div className="absolute inset-0 bg-[#30352a]/55" />
              <Reveal className="relative z-10 flex min-h-[620px] flex-col items-center justify-center px-8 py-20 text-center text-white">
                <Sparkles className="mb-5 h-5 w-5 opacity-80" />
                <SectionTitle light>{copy.details}</SectionTitle>
                <p className="mt-8 max-w-sm text-lg leading-relaxed text-white/90">
                  {data.details || copy.detailsText}
                </p>
              </Reveal>
            </section>
          )}

          {sectionVisible('countdown', data.showCountdown) && (
            <section className="olive-paper-section px-6 py-24 sm:px-12">
              <Reveal>
                <p className="olive-label text-center text-[9px] font-semibold text-[#737b55]">{copy.countdown}</p>
                <div className="mt-8 grid grid-cols-4 border-y border-[#737b55]/25 py-6 text-center">
                  {[
                    [countdown.days, copy.days], [countdown.hours, copy.hours], [countdown.minutes, copy.minutes], [countdown.seconds, copy.seconds],
                  ].map(([value, label]) => (
                    <div key={String(label)} className="border-r border-[#737b55]/20 last:border-r-0">
                      <p className="text-3xl font-medium sm:text-4xl">{String(value).padStart(2, '0')}</p>
                      <p className="olive-label mt-2 text-[6px] sm:text-[7px]">{label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>
          )}

          {sectionVisible('rsvp') && (
            <section id="rsvp" className="olive-rsvp-section olive-paper-section olive-screen-section px-6 py-16 sm:px-12">
              <Reveal className="mx-auto max-w-md">
                <SectionTitle eyebrow="RSVP">{copy.rsvp}</SectionTitle>
                <p className="mx-auto mt-4 max-w-[250px] text-center font-sans text-[10px] leading-[1.65] text-[#606555]">
                  {copy.rsvpIntro}
                </p>
                {success ? (
                  <motion.div initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#737b55] text-white"><Check /></span>
                    <p className="mt-5 text-lg">{copy.thanks}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={submitLocal} className="mt-7 space-y-4">
                    <input
                      className="olive-input"
                      value={rsvpName}
                      onChange={(event) => rsvpState ? rsvpState.setName(event.target.value) : setLocalName(event.target.value)}
                      placeholder={copy.namePlaceholder}
                      required
                    />
                    <div className="grid grid-cols-2 gap-2.5">
                      <button type="button" data-active={attending === true} onClick={() => rsvpState ? rsvpState.setAttending(true) : setLocalAttending(true)} className="olive-choice min-h-12 rounded-full px-2.5 py-2.5 font-sans text-[9px] font-medium leading-tight">{copy.yes}</button>
                      <button type="button" data-active={attending === false} onClick={() => rsvpState ? rsvpState.setAttending(false) : setLocalAttending(false)} className="olive-choice min-h-12 rounded-full px-2.5 py-2.5 font-sans text-[9px] font-medium leading-tight">{copy.no}</button>
                    </div>
                    <label className="block">
                      <span className="olive-label text-[7px] font-semibold text-[#737b55]">
                        {copy.guestCount}
                      </span>
                      <select
                        className="olive-input"
                        value={guestCount}
                        onChange={(event) => rsvpState ? rsvpState.setGuestCount(Number(event.target.value)) : setLocalGuestCount(Number(event.target.value))}
                      >
                        {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}</option>)}
                      </select>
                    </label>
                    <textarea
                      className="olive-input min-h-20 resize-none"
                      value={wishes}
                      onChange={(event) => rsvpState ? rsvpState.setWishes(event.target.value) : setLocalWishes(event.target.value)}
                      placeholder={copy.wishesPlaceholder}
                    />
                    <button type="submit" disabled={rsvpState?.isSubmitting || attending === null} className="olive-label flex w-full items-center justify-center gap-2 rounded-full bg-[#3f4630] px-5 py-3.5 text-[8px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-40">
                      {rsvpState?.isSubmitting ? <Clock3 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {copy.send}
                    </button>
                  </form>
                )}
              </Reveal>
            </section>
          )}

          <footer className="bg-[#3f4630] px-6 py-16 text-center text-[#f4eedf]">
            <Heart className="mx-auto h-4 w-4" fill="currentColor" />
            <p className="olive-footer-names olive-script mt-5">{groomName} & {brideName}</p>
            <p className="olive-label mt-5 text-[7px] opacity-60">{dateInfo.day} {dateInfo.month} {dateInfo.year}</p>
            {data.phone && (
              <a href={`tel:${data.phone}`} className="mt-7 inline-flex items-center gap-2 text-sm opacity-80"><Phone className="h-3.5 w-3.5" />{data.phone}</a>
            )}
          </footer>
        </main>

        {opened && onToggleAudio && !isPreview && (
          <motion.button
            type="button"
            className="olive-floating-music fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white"
            initial={{ opacity: 0, scale: 0, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 1.4, type: 'spring' }}
            onClick={onToggleAudio}
            aria-label={isPlaying ? copy.musicPause : copy.musicPlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Music2 className="h-4 w-4" />}
          </motion.button>
        )}
      </div>
    </div>
  );
};
