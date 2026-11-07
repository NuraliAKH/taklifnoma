import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  CalendarPlus,
  Check,
  Clock3,
  Copy,
  Heart,
  MapPin,
  Music2,
  Navigation,
  Pause,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
import type { CalendarEvent } from './shared';
import {
  createSectionVisibility,
  downloadIcs,
  formatCardNumber,
  formatEventDate,
  getDemoContent,
  getGoogleCalendarUrl,
  getGoogleMapsUrl,
  getMediaUrl,
  getYandexMapsUrl,
  isDemo,
  maskCardExample,
  useCalmMotion,
  useCopyToClipboard,
} from './shared';
import type { WebsiteTemplateProps } from './types';
import { parseEventDateTime, useCountdownTimer } from '../../utils/timer';
import { PrivacyConsentCheckbox } from '../../components/PrivacyConsentCheckbox';
import './OliveEnvelopeWeddingSite.css';

const DEFAULT_HERO = '/olive-editorial-hero.webp';
const DEFAULT_VENUE = '/olive-editorial-venue.webp';
const DEFAULT_DETAIL = '/olive-editorial-details.webp';

import { DRESS_PALETTES } from './palettes';
export { DRESS_PALETTES } from './palettes';

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
    {eyebrow && <p className={`olive-label mb-3 text-[11px] font-semibold ${light ? 'text-white/75' : 'text-[#737b55]'}`}>{eyebrow}</p>}
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
  const calm = useCalmMotion(isPreview);
  const { copied: addressCopied, copy: copyAddress } = useCopyToClipboard();
  const { copied: cardCopied, copy: copyCard } = useCopyToClipboard();

  useEffect(() => {
    if (isPreview) return;
    if (opened) {
      document.body.style.overflow = '';
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous || '';
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

  const copy = useMemo(() => {
    if (activeLang === 'uz') {
      return {
        invite: 'Toʻyga taklifnoma',
        open: 'Taklifnomani oching',
        scroll: 'Pastga suring',
        dear: 'Aziz mehmonlar!',
        intro: 'Hayotimizdagi eng muhim va quvonchli kunni siz bilan birga nishonlashdan baxtiyor boʻlamiz.',
        day: 'Bizning kunimiz',
        schedule: 'Kechki dastur',
        place: 'Tadbir manzili',
        dress: 'Dress-kod',
        dressText: 'Bayramimiz ranglarini qoʻllab-quvvatlasangiz, xursand boʻlamiz.',
        gallery: 'Fotogalereya',
        galleryEyebrow: 'Lahzalar',
        galleryCaption1: 'Baxtli onlar',
        galleryCaption2: 'Bir umr birga',
        galleryCaption3: 'Bizning tariximiz',
        details: 'Tafsilotlar',
        detailsText: 'Biz uchun eng muhimi — sizning ishtirokingiz. Iltimos, oq rangni kelin uchun qoldiring va oʻzingiz bilan ajoyib kayfiyat olib keling.',
        gift: 'Toʻy sovgʻasi',
        giftEyebrow: 'Sovgʻalar',
        giftDesc: 'Biz uchun eng katta sovgʻa — sizning tashrifingiz. Agar tabriklamoqchi boʻlsangiz, oilamiz byudjetiga oʻz hissangizni qoʻshishingiz mumkin.',
        cardHolder: 'Qabul qiluvchi',
        copyCard: 'Kartani nusxalash',
        cardCopied: 'Karta raqami nusxalandi!',
        copyAddress: 'Manzilni nusxalash',
        addressCopied: 'Manzil nusxalandi!',
        yandexMaps: 'Yandex Xarita',
        googleMaps: 'Google Xarita',
        addToCalendar: 'Taqvimga saqlash',
        downloadIcs: '.ics yuklab olish',
        googleCalendar: 'Google Taqvim',
        countdown: 'Uchrashuvimizgacha',
        days: 'kun',
        hours: 'soat',
        minutes: 'daqiqa',
        seconds: 'soniya',
        rsvp: 'Mehmon anketasi',
        rsvpIntro: 'Iltimos, mehmon uchun qisqa anketani toʻldiring.',
        namePlaceholder: 'Ism va familiyangiz',
        guestCount: 'Mehmonlar soni',
        wishesPlaceholder: 'Yangi turmush qurganlarga tilaklaringiz',
        yes: 'Albatta kelaman',
        no: 'Afsuski, kela olmayman',
        send: 'Javobni yuborish',
        thanks: 'Rahmat, javobingiz qabul qilindi!',
        previewSuccessNote: 'Mehmonlar javob yuborgandan soʻng shu xabar koʻrinadi',
        resetPreviewRsvp: 'Qaytadan toʻldirish',
        musicOrbit: 'MUSIQANI YOQISH UCHUN BOSING · ',
        musicPlay: 'Musiqani yoqish',
        musicPause: 'Musiqani pauza qilish',
        ceremony: 'Marosim',
        dinner: 'Toʻy oqshomi',
        cake: 'Toʻy torti',
        finale: 'Yakun',
      };
    }
    if (activeLang === 'en') {
      return {
        invite: 'Wedding invitation',
        open: 'Open invitation',
        scroll: 'Scroll down',
        dear: 'Dear guests!',
        intro: 'We would love to share the most important day of our lives with you.',
        day: 'Our day',
        schedule: 'Evening schedule',
        place: 'Wedding venue',
        dress: 'Dress code',
        dressText: 'We would be delighted if you supported the palette of our celebration.',
        gallery: 'Photo Gallery',
        galleryEyebrow: 'Moments',
        galleryCaption1: 'Moments of joy',
        galleryCaption2: 'Together forever',
        galleryCaption3: 'Our love story',
        details: 'Details',
        detailsText: 'Your presence is the greatest gift to us. Please leave white for the bride and bring your wonderful mood.',
        gift: 'Wedding Gift',
        giftEyebrow: 'Gifts',
        giftDesc: 'Your presence is our greatest gift. If you wish to bless us with a wedding gift, a monetary contribution would be warmly appreciated.',
        cardHolder: 'Recipient',
        copyCard: 'Copy card',
        cardCopied: 'Card number copied!',
        copyAddress: 'Copy address',
        addressCopied: 'Address copied!',
        yandexMaps: 'Yandex Maps',
        googleMaps: 'Google Maps',
        addToCalendar: 'Add to Calendar',
        downloadIcs: 'Download .ics',
        googleCalendar: 'Google Calendar',
        countdown: 'Until we meet',
        days: 'days',
        hours: 'hours',
        minutes: 'minutes',
        seconds: 'seconds',
        rsvp: 'Guest RSVP',
        rsvpIntro: 'Please complete the short guest form.',
        namePlaceholder: 'Your full name',
        guestCount: 'Number of guests',
        wishesPlaceholder: 'Your wishes for the couple',
        yes: 'Joyfully accept',
        no: 'Regretfully decline',
        send: 'Send response',
        thanks: 'Thank you, your response is saved!',
        previewSuccessNote: 'This is what guests will see after submitting',
        resetPreviewRsvp: 'Fill again',
        musicOrbit: 'TAP TO TURN ON THE MUSIC · ',
        musicPlay: 'Play music',
        musicPause: 'Pause music',
        ceremony: 'Ceremony',
        dinner: 'Wedding dinner',
        cake: 'Wedding cake',
        finale: 'Finale',
      };
    }
    return {
      invite: 'Приглашение на свадьбу',
      open: 'Открыть приглашение',
      scroll: 'Листайте вниз',
      dear: 'Дорогие гости!',
      intro: 'Мы очень хотим сделать этот день особенным, поэтому приглашаем вас разделить с нами торжество, посвящённое дню нашей свадьбы.',
      day: 'Наш день',
      schedule: 'Программа вечера',
      place: 'Место проведения',
      dress: 'Дресс-код',
      dressText: 'Мы будем очень благодарны, если вы поддержите цветовую палитру нашей свадьбы.',
      gallery: 'Фотогалерея',
      galleryEyebrow: 'Мгновения',
      galleryCaption1: 'Мгновения счастья',
      galleryCaption2: 'Вместе навсегда',
      galleryCaption3: 'Начало нашей истории',
      details: 'Детали',
      detailsText: 'Самое главное для нас — ваше присутствие. Пожалуйста, оставьте белый цвет для невесты и возьмите с собой прекрасное настроение.',
      gift: 'Свадебный комплимент',
      giftEyebrow: 'Подарки',
      giftDesc: 'Главный подарок для нас — ваше внимание и присутствие. Если вы хотите сделать памятный комплимент, можете поддержать наш семейный бюджет.',
      cardHolder: 'Получатель',
      copyCard: 'Скопировать номер карты',
      cardCopied: 'Номер карты скопирован!',
      copyAddress: 'Скопировать адрес',
      addressCopied: 'Адрес скопирован!',
      yandexMaps: 'Яндекс Карты',
      googleMaps: 'Google Карты',
      addToCalendar: 'В календарь',
      downloadIcs: 'Скачать .ics',
      googleCalendar: 'Google Календарь',
      countdown: 'До нашей встречи',
      days: 'дней',
      hours: 'часов',
      minutes: 'минут',
      seconds: 'секунд',
      rsvp: 'Анкета гостя',
      rsvpIntro: 'Пожалуйста, заполните короткую анкету гостя.',
      namePlaceholder: 'Имя и фамилия',
      guestCount: 'Количество гостей',
      wishesPlaceholder: 'Ваши пожелания молодожёнам',
      yes: 'С радостью приду',
      no: 'К сожалению, не смогу',
      send: 'Отправить ответ',
      thanks: 'Спасибо, ваш ответ принят!',
      previewSuccessNote: 'Так увидят гости после отправки',
      resetPreviewRsvp: 'Заполнить снова',
      musicOrbit: 'НАЖМИТЕ, ЧТОБЫ ВКЛЮЧИТЬ МУЗЫКУ · ',
      musicPlay: 'Включить музыку',
      musicPause: 'Поставить музыку на паузу',
      ceremony: 'Церемония',
      dinner: 'Начало банкета',
      cake: 'Торт',
      finale: 'Финал',
    };
  }, [activeLang]);

  const demo = useMemo(() => getDemoContent(activeLang), [activeLang]);
  const groomName = isDemo(isPreview, data.groomName, demo.groomName) || '';
  const brideName = isDemo(isPreview, data.brideName, demo.brideName) || '';
  const hasCoupleNames = Boolean(groomName || brideName);
  const coupleTitle = groomName && brideName
    ? `${groomName} & ${brideName}`
    : (groomName || brideName || '');
  const stackCoupleNames = groomName.trim().length + brideName.trim().length > 18;

  const targetDateStr = data.date || (isPreview ? '2026-08-12' : '');
  const time = data.time || '17:00';
  const venue = isDemo(isPreview, data.venue, demo.venue) || '';
  const address = isDemo(isPreview, data.address, demo.address) || '';

  const heroPhoto = getMediaUrl(data.photoUrl) || DEFAULT_HERO;
  const venuePhoto = getMediaUrl(data.venuePhoto || data.photos?.[0]) || DEFAULT_VENUE;
  const detailPhoto = getMediaUrl(data.photos?.[1]) || DEFAULT_DETAIL;

  const sectionVisible = useMemo(() => createSectionVisibility(data.hiddenSections), [data.hiddenSections]);

  const parsedDate = useMemo(() => parseEventDateTime(targetDateStr || '2026-08-12', time), [targetDateStr, time]);
  const formattedDate = useMemo(() => formatEventDate(targetDateStr || '2026-08-12', activeLang), [targetDateStr, activeLang]);

  const dateInfo = useMemo(() => {
    const d = parsedDate;
    const previousDate = new Date(d);
    previousDate.setDate(d.getDate() - 1);
    const nextDate = new Date(d);
    nextDate.setDate(d.getDate() + 1);

    return {
      day: formattedDate.day,
      month: formattedDate.month,
      monthShort: formattedDate.monthShort,
      numericMonth: String(d.getMonth() + 1).padStart(2, '0'),
      year: formattedDate.year,
      weekday: formattedDate.weekday,
      full: formattedDate.full,
      prev: String(previousDate.getDate()).padStart(2, '0'),
      next: String(nextDate.getDate()).padStart(2, '0'),
    };
  }, [parsedDate, formattedDate]);

  const calendarEvent: CalendarEvent = useMemo(() => {
    const title = hasCoupleNames
      ? `${coupleTitle} — ${copy.invite}`
      : copy.invite;
    return {
      title,
      start: parsedDate,
      durationMinutes: 240,
      location: [venue, address].filter(Boolean).join(', '),
      description: data.loveStory || copy.intro,
    };
  }, [hasCoupleNames, coupleTitle, copy.invite, copy.intro, data.loveStory, parsedDate, venue, address]);

  const googleCalUrl = useMemo(() => getGoogleCalendarUrl(calendarEvent), [calendarEvent]);
  const yandexMapsUrl = useMemo(() => getYandexMapsUrl(venue, address), [venue, address]);
  const googleMapsUrl = useMemo(() => getGoogleMapsUrl(venue, address), [venue, address]);

  const countdown = useCountdownTimer(targetDateStr, time, timeLeft);

  const schedule = Array.isArray(data.schedule) && data.schedule.length
    ? data.schedule
    : (Array.isArray(data.scheduleItems) && data.scheduleItems.length
        ? data.scheduleItems
        : (isPreview && demo.schedule ? demo.schedule : [
            { time, title: 'Welcome' },
            { time: addMinutes(time, 30), title: copy.ceremony },
            { time: addMinutes(time, 60), title: copy.dinner },
            { time: addMinutes(time, 300), title: copy.cake },
            { time: addMinutes(time, 360), title: copy.finale },
          ]));

  const userGalleryPhotos = useMemo(() => {
    if (!Array.isArray(data.photos)) return [];
    return data.photos.slice(2, 8).map(getMediaUrl).filter(Boolean);
  }, [data.photos]);

  const galleryPhotos = userGalleryPhotos.length > 0
    ? userGalleryPhotos
    : (isPreview ? [DEFAULT_HERO, DEFAULT_VENUE, DEFAULT_DETAIL] : []);

  const rawCard = data.giftCardNumber?.trim() || '';
  const hasCard = Boolean(rawCard);
  const displayCardNumber = hasCard ? formatCardNumber(rawCard) : (isPreview ? maskCardExample() : '');
  const cardOwner = data.giftCardOwner || (isPreview ? (coupleTitle || demo.coupleNames) : '');

  const sealMark = (groomName && brideName)
    ? `${groomName.trim().charAt(0).toUpperCase()} & ${brideName.trim().charAt(0).toUpperCase()}`
    : (hasCoupleNames ? coupleTitle.trim().charAt(0).toUpperCase() : 'W');

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
              className="olive-language-button rounded-full px-3 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[.08em] sm:tracking-[.12em]"
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
                <p className="olive-label mb-4 text-[11px] opacity-75">{dateInfo.day} · {dateInfo.month} · {dateInfo.year}</p>
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
                  {sealMark}
                </span>
              </motion.button>

              <motion.p
                className="olive-label absolute bottom-[15%] z-30 text-[11px] font-semibold"
                animate={calm ? undefined : { opacity: [0.45, 1, 0.45] }}
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
              alt={hasCoupleNames ? coupleTitle : copy.invite}
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
              <p className="olive-label mb-5 text-[11px] font-medium opacity-85">{copy.invite}</p>
              {hasCoupleNames ? (
                <h1 className={`olive-couple-names olive-script leading-[.78] drop-shadow-lg ${stackCoupleNames ? 'is-stacked' : 'whitespace-nowrap'}`}>
                  {groomName && <span>{groomName}</span>}
                  {groomName && brideName && <span className="olive-couple-amp mx-2 text-[.55em]">&</span>}
                  {brideName && <span>{brideName}</span>}
                </h1>
              ) : (
                <h1 className="olive-couple-names olive-script leading-[.78] drop-shadow-lg">
                  {copy.invite}
                </h1>
              )}
              <div className="mt-8 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-white/60" />
                <span className="olive-label text-[11px] font-medium">{dateInfo.day} / {dateInfo.numericMonth}</span>
                <span className="h-px w-10 bg-white/60" />
              </div>
            </motion.div>
            <motion.div
              className="olive-scroll-cue absolute bottom-10 right-3 z-20 flex items-center gap-2 text-[#fff9eb]/75"
              initial={{ opacity: 0 }}
              animate={opened ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: isPreview ? .35 : 1.55, duration: .7 }}
            >
              <span className="olive-label text-[11px] font-semibold tracking-[.15em]">{copy.scroll}</span>
              <motion.span
                className="block h-8 w-px bg-current"
                animate={calm ? undefined : { scaleY: [0.35, 1, 0.35], opacity: [.45, 1, .45] }}
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
                  <svg className={`olive-music-orbit absolute inset-0 h-full w-full ${isPlaying && !calm ? '' : 'is-paused'}`} viewBox="0 0 120 120" aria-hidden="true">
                    <defs><path id="oliveMusicPath" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" /></defs>
                    <text fill="currentColor" fontFamily="Montserrat" fontSize="11" letterSpacing="0.8">
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
                <p className="mx-auto mt-7 max-w-sm font-sans text-[15px] leading-[1.85] text-[#4d5144] sm:text-base">{data.loveStory || copy.intro}</p>
              </Reveal>
            </section>
          )}

          {sectionVisible('calendar') && (
            <section id="date" className="olive-paper-section olive-screen-section px-6 py-24 sm:px-12">
              <Reveal className="mx-auto max-w-md" delay={0.08}>
                <p className="olive-label mb-4 text-center text-[11px] font-semibold text-[#737b55]">{copy.day}</p>
                <SectionTitle>{dateInfo.month}</SectionTitle>
                <div className="olive-date-grid text-center">
                  <div>
                    <p className="olive-label text-[11px] opacity-75">{dateInfo.month}</p>
                    <p className="mt-2 text-3xl opacity-45">{dateInfo.prev}</p>
                  </div>
                  <div className="relative">
                    <p className="olive-label text-[11px] opacity-75">{dateInfo.weekday}</p>
                    <p className="olive-date-ring mt-2 text-4xl font-medium">{dateInfo.day}</p>
                  </div>
                  <div>
                    <p className="olive-label text-[11px] opacity-75">{dateInfo.year}</p>
                    <p className="mt-2 text-3xl opacity-45">{dateInfo.next}</p>
                  </div>
                </div>
                <p className="olive-label mt-7 text-center text-[11px] font-semibold text-[#737b55]">
                  {dateInfo.day} / {dateInfo.numericMonth} / {dateInfo.year} · {time}
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => downloadIcs(calendarEvent)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[#737b55]/40 bg-transparent px-4 py-2 font-sans text-[12px] font-medium text-[#3f4630] transition-colors hover:bg-[#3f4630] hover:text-white"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" />
                    {copy.downloadIcs}
                  </button>
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[#737b55]/40 bg-transparent px-4 py-2 font-sans text-[12px] font-medium text-[#3f4630] transition-colors hover:bg-[#3f4630] hover:text-white"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {copy.googleCalendar}
                  </a>
                </div>
              </Reveal>
            </section>
          )}

          {sectionVisible('schedule') && (
            <section id="timeline" className="olive-paper-section olive-screen-section px-6 pb-24 sm:px-12">
              <Reveal><p className="olive-label mb-5 text-center text-[11px] font-semibold text-[#737b55]">{copy.schedule}</p></Reveal>
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
                        <p className="olive-script text-[clamp(1.9rem,9.5cqi,2.65rem)] leading-[.92]">{item.title || item.label}</p>
                        <p className="mt-1 font-sans text-sm tracking-wide text-[#4f5540]">{item.time}</p>
                        {item.desc && <p className="mt-0.5 text-xs text-[#737b55]">{item.desc}</p>}
                      </div>
                      <motion.span
                        className="olive-heart absolute -ml-[10px]"
                        style={{ left: ['50%', '39%', '61%', '40%', '58%', '45%'][index % 6], top: '50%', marginTop: -10 }}
                        animate={calm ? { rotate: 45 } : { rotate: 45, scale: [1, 1.12, 1] }}
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
              <Reveal className="mx-auto mt-9 max-w-sm px-6 text-center" delay={0.08}>
                {venue && <h3 className="olive-script text-[2.35rem] leading-none text-[#303529]">{venue}</h3>}
                {address && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <p className="font-sans text-[13px] leading-relaxed tracking-wide text-[#606555]">{address}</p>
                    <button
                      type="button"
                      onClick={() => copyAddress(address)}
                      className="inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full border border-[#737b55]/30 p-1.5 text-[#606555] transition-colors hover:bg-[#737b55]/10 hover:text-[var(--olive-dark)]"
                      aria-label={copy.copyAddress}
                      title={copy.copyAddress}
                    >
                      {addressCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                )}
                {addressCopied && (
                  <p className="mt-1 font-sans text-[11px] text-emerald-700">{copy.addressCopied}</p>
                )}
                <div className="mt-4 flex items-center justify-center gap-2 text-[#737b55]">
                  <Clock3 className="h-3.5 w-3.5" />
                  <span className="olive-label text-[11px] font-semibold">{time}</span>
                </div>
                {(venue || address) && (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                    <a
                      href={yandexMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[var(--olive)] bg-transparent px-4 py-2 font-sans text-[12px] font-medium text-[var(--olive-dark)] transition-colors hover:bg-[var(--olive-dark)] hover:text-white"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {copy.yandexMaps}
                    </a>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[var(--olive)] bg-transparent px-4 py-2 font-sans text-[12px] font-medium text-[var(--olive-dark)] transition-colors hover:bg-[var(--olive-dark)] hover:text-white"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      {copy.googleMaps}
                    </a>
                  </div>
                )}
              </Reveal>
              <Reveal className="mt-9" delay={0.1}>
                <div className="olive-photo-card olive-torn-top olive-torn-bottom h-[440px] sm:h-[540px]">
                  <img src={venuePhoto} alt={venue || copy.place} className="h-full w-full object-cover" loading="lazy" decoding="async" />
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

          {sectionVisible('gallery', data.showGallery) && galleryPhotos.length > 0 && (
            <section id="gallery" className="olive-paper-section px-6 py-20 sm:px-12">
              <Reveal>
                <SectionTitle eyebrow={copy.galleryEyebrow}>{copy.gallery}</SectionTitle>
              </Reveal>
              <div className="mx-auto mt-10 max-w-lg space-y-6">
                {galleryPhotos[0] && (
                  <Reveal delay={0.06}>
                    <div className="olive-photo-card rounded-sm shadow-md overflow-hidden aspect-[16/10]">
                      <img
                        src={galleryPhotos[0]}
                        alt={`${copy.gallery} 1`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-2.5 text-center font-serif italic text-[13px] sm:text-sm text-[#606555]">
                      {copy.galleryCaption1}
                    </p>
                  </Reveal>
                )}

                {galleryPhotos.length > 1 && (
                  <Reveal delay={0.12}>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {galleryPhotos[1] && (
                        <div>
                          <div className="olive-photo-card rounded-sm shadow-md overflow-hidden aspect-[3/4]">
                            <img
                              src={galleryPhotos[1]}
                              alt={`${copy.gallery} 2`}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="mt-2 text-center font-serif italic text-[12px] sm:text-[13px] text-[#606555]">
                            {copy.galleryCaption2}
                          </p>
                        </div>
                      )}
                      {galleryPhotos[2] && (
                        <div>
                          <div className="olive-photo-card rounded-sm shadow-md overflow-hidden aspect-[3/4]">
                            <img
                              src={galleryPhotos[2]}
                              alt={`${copy.gallery} 3`}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="mt-2 text-center font-serif italic text-[12px] sm:text-[13px] text-[#606555]">
                            {copy.galleryCaption3}
                          </p>
                        </div>
                      )}
                    </div>
                  </Reveal>
                )}

                {galleryPhotos[3] && (
                  <Reveal delay={0.16}>
                    <div className="olive-photo-card rounded-sm shadow-md overflow-hidden aspect-[16/10]">
                      <img
                        src={galleryPhotos[3]}
                        alt={`${copy.gallery} 4`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-2.5 text-center font-serif italic text-[13px] sm:text-sm text-[#606555]">
                      {copy.galleryCaption1}
                    </p>
                  </Reveal>
                )}

                {galleryPhotos.length > 4 && (
                  <Reveal delay={0.2}>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {galleryPhotos[4] && (
                        <div>
                          <div className="olive-photo-card rounded-sm shadow-md overflow-hidden aspect-[3/4]">
                            <img
                              src={galleryPhotos[4]}
                              alt={`${copy.gallery} 5`}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="mt-2 text-center font-serif italic text-[12px] sm:text-[13px] text-[#606555]">
                            {copy.galleryCaption2}
                          </p>
                        </div>
                      )}
                      {galleryPhotos[5] && (
                        <div>
                          <div className="olive-photo-card rounded-sm shadow-md overflow-hidden aspect-[3/4]">
                            <img
                              src={galleryPhotos[5]}
                              alt={`${copy.gallery} 6`}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="mt-2 text-center font-serif italic text-[12px] sm:text-[13px] text-[#606555]">
                            {copy.galleryCaption3}
                          </p>
                        </div>
                      )}
                    </div>
                  </Reveal>
                )}
              </div>
            </section>
          )}

          {sectionVisible('details') && (
            <section className="olive-photo-card olive-torn-top olive-torn-bottom relative min-h-[620px] overflow-hidden">
              <motion.img
                src={detailPhoto}
                alt={copy.details}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
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

          {sectionVisible('giftCard', data.showGiftCard) && (hasCard || isPreview) && (
            <section id="gift" className="olive-paper-section px-6 py-20 sm:px-12">
              <Reveal className="mx-auto max-w-md text-center">
                <SectionTitle eyebrow={copy.giftEyebrow}>{copy.gift}</SectionTitle>
                <p className="mx-auto mt-5 max-w-sm font-sans text-[13px] sm:text-sm leading-relaxed text-[#606555]">
                  {copy.giftDesc}
                </p>

                <div className="olive-gift-card relative mx-auto mt-8 max-w-xs overflow-hidden rounded-2xl p-6 text-left shadow-lg">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex h-7 w-10 items-center justify-center rounded bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-inner">
                        <div className="h-4 w-6 rounded-sm border border-amber-800/40" />
                      </div>
                      {isPreview && !hasCard && (
                        <span className="rounded-full border border-amber-300/40 bg-amber-400/20 px-2.5 py-0.5 font-sans text-[11px] font-medium text-amber-200">
                          {demo.giftCardExampleLabel}
                        </span>
                      )}
                    </div>

                    <div className="mt-6">
                      <p className="select-all font-mono text-lg font-medium tracking-wider text-white sm:text-xl">
                        {displayCardNumber}
                      </p>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="olive-label text-[11px] text-white/70 opacity-70">{copy.cardHolder}</p>
                        <p className="max-w-[170px] truncate font-sans text-xs font-medium uppercase tracking-wide text-white/90">
                          {cardOwner}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyCard(rawCard || '8600000000000000')}
                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-sans text-[11px] font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95"
                        aria-label={copy.copyCard}
                      >
                        {cardCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{copy.cardCopied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>{copy.copyCard}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            </section>
          )}

          {sectionVisible('countdown', data.showCountdown) && (
            <section className="olive-paper-section px-6 py-24 sm:px-12">
              <Reveal>
                <p className="olive-label text-center text-[11px] font-semibold text-[#737b55]">{copy.countdown}</p>
                <div className="mt-8 grid grid-cols-4 border-y border-[#737b55]/25 py-6 text-center">
                  {[
                    [countdown.days, copy.days], [countdown.hours, copy.hours], [countdown.minutes, copy.minutes], [countdown.seconds, copy.seconds],
                  ].map(([value, label]) => (
                    <div key={String(label)} className="border-r border-[#737b55]/20 last:border-r-0">
                      <p className="text-3xl font-medium sm:text-4xl">{String(value).padStart(2, '0')}</p>
                      <p className="olive-label mt-2 text-[11px] tracking-[.12em]">{label}</p>
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
                <p className="mx-auto mt-4 max-w-xs text-center font-sans text-[13px] sm:text-sm leading-relaxed text-[#606555]">
                  {copy.rsvpIntro}
                </p>
                {success ? (
                  <motion.div initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#737b55] text-white">
                      <Check className="h-6 w-6" />
                    </span>
                    <p className="mt-5 text-xl font-medium">{copy.thanks}</p>
                    {!rsvpState && (
                      <p className="mt-2 font-sans text-xs text-[#606555]">
                        {copy.previewSuccessNote}
                      </p>
                    )}
                    {!rsvpState && (
                      <button
                        type="button"
                        onClick={() => setLocalSuccess(false)}
                        className="mt-5 inline-flex items-center gap-1 font-sans text-xs underline text-[#737b55] hover:text-[#3f4630]"
                      >
                        {copy.resetPreviewRsvp}
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <form onSubmit={submitLocal} className="mt-7 space-y-4">
                    <div>
                      <label htmlFor="olive-rsvp-name" className="sr-only">
                        {copy.namePlaceholder}
                      </label>
                      <input
                        id="olive-rsvp-name"
                        className="olive-input"
                        value={rsvpName}
                        onChange={(event) => rsvpState ? rsvpState.setName(event.target.value) : setLocalName(event.target.value)}
                        placeholder={copy.namePlaceholder}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        data-active={attending === true}
                        onClick={() => rsvpState ? rsvpState.setAttending(true) : setLocalAttending(true)}
                        className="olive-choice min-h-12 rounded-full px-3 py-2.5 font-sans text-[13px] font-medium leading-tight"
                      >
                        {copy.yes}
                      </button>
                      <button
                        type="button"
                        data-active={attending === false}
                        onClick={() => rsvpState ? rsvpState.setAttending(false) : setLocalAttending(false)}
                        className="olive-choice min-h-12 rounded-full px-3 py-2.5 font-sans text-[13px] font-medium leading-tight"
                      >
                        {copy.no}
                      </button>
                    </div>
                    <label className="block">
                      <span className="olive-label text-[11px] font-semibold text-[#737b55]">
                        {copy.guestCount}
                      </span>
                      <select
                        className="olive-input mt-1"
                        value={guestCount}
                        onChange={(event) => rsvpState ? rsvpState.setGuestCount(Number(event.target.value)) : setLocalGuestCount(Number(event.target.value))}
                      >
                        {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}</option>)}
                      </select>
                    </label>
                    <div>
                      <label htmlFor="olive-rsvp-wishes" className="sr-only">
                        {copy.wishesPlaceholder}
                      </label>
                      <textarea
                        id="olive-rsvp-wishes"
                        className="olive-input min-h-20 resize-none"
                        value={wishes}
                        onChange={(event) => rsvpState ? rsvpState.setWishes(event.target.value) : setLocalWishes(event.target.value)}
                        placeholder={copy.wishesPlaceholder}
                      />
                    </div>
                    <PrivacyConsentCheckbox lang={activeLang} />
                    <button
                      type="submit"
                      disabled={rsvpState ? (rsvpState.isSubmitting || attending === null) : (attending === null)}
                      className="olive-label flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#3f4630] px-5 py-3.5 text-[12px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-40"
                    >
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
            {hasCoupleNames && (
              <p className="olive-footer-names olive-script mt-5">{coupleTitle}</p>
            )}
            <p className="olive-label mt-5 text-[11px] opacity-75">{dateInfo.day} {dateInfo.month} {dateInfo.year}</p>
            {data.phone && (
              <a href={`tel:${data.phone}`} className="mt-7 inline-flex items-center gap-2 text-sm opacity-80"><Phone className="h-3.5 w-3.5" />{data.phone}</a>
            )}
          </footer>
        </main>

        {opened && onToggleAudio && (
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
