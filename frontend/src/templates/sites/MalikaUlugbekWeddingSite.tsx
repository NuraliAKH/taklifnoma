import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, VolumeX,
  Copy, Check, Gift, Navigation,
  X, Image as ImageIcon, Sparkles, ChevronDown,
  MapPin, Music, CheckCircle2, Globe, ExternalLink, Loader2
} from 'lucide-react';
import type { WebsiteTemplateProps, LoveStoryItem } from './types';
import { useCountdownTimer, parseEventDateTime } from '../../utils/timer';
import { PrivacyConsentCheckbox } from '../../components/PrivacyConsentCheckbox';
import {
  createSectionVisibility,
  getMediaUrl,
  formatEventDate,
  formatCardNumber,
  maskCardExample,
  getYandexMapsUrl,
  getGoogleMapsUrl,
  downloadIcs,
  getGoogleCalendarUrl,
  useCopyToClipboard,
  getDemoContent,
  useCalmMotion,
} from './shared';

// ==========================================
// TRANSLATION DICTIONARY (uz, ru, en)
// ==========================================
const translations = {
  uz: {
    coverBadge: 'SIZGA TAKLIFNOMA KELDI',
    coverAyahArabic: 'وَأَلَّفَ بَيْنَ قُلُوبِهِمْ',
    coverAyahTranslation: '«Va U ularning qalblarini birlashtirdi»',
    coverAyahSurah: 'ANFOL SURASI, 63-OYAT',
    swipeToOpen: 'OCHISH UCHUN SURING',
    openInvitationButton: 'Taklifnomani ochish',
    tapToOpenHint: 'Yoki tugmani bosing',
    musicToggle: 'Musiqani yoqish yoki oʻchirish',
    switchLang: 'Tilni tanlash',
    invitationTitle: 'NIKOH TOʻYIGA TAKLIFNOMA',
    scrollDown: 'DAVOMI BOR — SURING',
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    ayahArabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    ayahTranslation:
      '«Yana Uning oyatlaridan biri — sizlarga oʻzingizdan, koʻngillaringiz orom topishi uchun juftlar yaratgani va orangizda muhabbat hamda mehr-shafqat paydo qilib qoʻyganidir.»',
    ayahSurah: '(RUM SURASI, 21-OYAT)',
    withGreatRespect: 'KATTA HURMAT BILAN',
    brideSide: 'KELIN TOMONDAN',
    groomSide: 'KUYOV TOMONDAN',
    parentsInvitationNote: 'Farzandlarimizning baxtli kunini Siz bilan birga nishonlashdan mamnunmiz.',
    weInviteYou: 'SIZNI TAKLIF ETAMIZ',
    inviteQuote: '«Ikki yurak bir boʻlib, yangi hayot ostonasida turibmiz...»',
    inviteText:
      'Hayotimizdagi eng baxtli kun — nikoh toʻyimizda Siz aziz mehmonimiz boʻlishingizni samimiy tilak bilan soʻrab qolamiz.',
    countdownTitle: 'TOʻYGA QOLDI',
    days: 'KUN',
    hours: 'SOAT',
    minutes: 'DAQIQA',
    seconds: 'SONIYA',
    addToCalendar: 'KALENDARGA QOʻSHISH',
    googleCalendar: 'Google Calendar',
    appleCalendar: 'Apple / iCal',
    loveStoryBadge: 'SEVGI TARIXI',
    loveStoryTitle: 'Bizning hikoyamiz',
    scheduleBadge: 'KUN TARTIBI',
    scheduleTitle: 'Marosim dasturi',
    galleryBadge: 'LAHZALAR',
    galleryTitle: 'Bizning suratlarimiz',
    galleryHint: 'Suratga bosib kattalashtiring',
    uploadedPhotos: 'Yuklangan rasmlar:',
    photoAlt: 'Toʻy surati',
    closeModal: 'Yopish',
    venueBadge: 'MAROSIM MANZILI',
    venueTitle: 'Toʻy qayerda boʻladi',
    venueTimeFrom: 'Soat {time} dan',
    viewOnYandex: 'Yandex Maps',
    viewOnGoogle: 'Google Maps',
    copyAddress: 'Manzilni nusxalash',
    addressCopied: 'Manzil nusxalandi!',
    giftCardBadge: 'TOʻY SOVGʻASI',
    giftCardTitle: 'Ezgʻu tilaklar va hadyalar',
    giftCardDesc:
      'Sizning tashrifingiz — biz uchun eng katta tuhfa. Agar yosh oilamizga pul hadyasi qilmoqchi boʻlsangiz, quyidagi bank kartasidan foydalanishingiz mumkin.',
    giftCardHolder: 'Karta egasi:',
    copyCardNumber: 'Karta raqamini nusxalash',
    cardNumberCopied: 'Karta raqami nusxalandi!',
    giftCardExample: 'Namuna karta',
    weAreWaiting: 'Sizni kutib qolamiz',
    openRsvpButton: 'TASHRIFNI TASDIQLASH (RSVP)',
    rsvpBadge: 'ONLAYN TAKLIFNOMA',
    rsvpTitle: 'Tashrifingizni tasdiqlang',
    guestNameLabel: 'Ismingiz va familiyangiz:',
    guestNamePlaceholder: 'Masalan: Jamshid Aliyev',
    attendingQuestion: 'Tashrif buyurasizmi?',
    attendingYes: 'Albatta kelaman!',
    attendingNo: 'Bora olmayman',
    guestCountLabel: 'Mehmonlar soni:',
    wishesLabel: 'Samimiy tilagingiz (ixtiyoriy):',
    wishesPlaceholder: 'Yoshlarga baxt-saodat tilayman...',
    submitRsvp: 'YUBORISH',
    submittingRsvp: 'Yuborilmoqda...',
    rsvpSuccessTitle: 'Rahmat! Tashrifingiz qabul qilindi.',
    rsvpSuccessDesc: 'Sizni toʻyimizda koʻrishdan juda mamnun boʻlamiz!',
    rsvpPreviewNote: 'Bu namuna koʻrinishi. Haqiqiy saytda mehmon javobi saqlanadi.',
    rsvpError: 'Xatolik yuz berdi. Iltimos, qaytadan urinib koʻring.',
  },
  ru: {
    coverBadge: 'ВАМ ПРИГЛАШЕНИЕ',
    coverAyahArabic: 'وَأَلَّفَ بَيْنَ قُلُوبِهِمْ',
    coverAyahTranslation: '«И Он соединил их сердца»',
    coverAyahSurah: 'СУРА АЛЬ-АНФАЛЬ, АЯТ 63',
    swipeToOpen: 'ПРОВЕДИТЕ, ЧТОБЫ ОТКРЫТЬ',
    openInvitationButton: 'Открыть приглашение',
    tapToOpenHint: 'Или нажмите кнопку',
    musicToggle: 'Включить или выключить музыку',
    switchLang: 'Выбрать язык',
    invitationTitle: 'ПРИГЛАШЕНИЕ НА СВАДЬБУ',
    scrollDown: 'ПРОКРУТИТЕ ВНИЗ',
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    ayahArabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    ayahTranslation:
      '«Среди Его знамений — то, что Он сотворил из вас самих жен для вас, чтобы вы находили в них успокоение, и установил между вами любовь и милосердие.»',
    ayahSurah: '(СУРА АР-РУМ, АЯТ 21)',
    withGreatRespect: 'С БОЛЬШИМ УВАЖЕНИЕМ',
    brideSide: 'СО СТОРОНЫ НЕВЕСТЫ',
    groomSide: 'СО СТОРОНЫ ЖЕНИХА',
    parentsInvitationNote: 'Будем искренне рады разделить с вами счастливый день наших детей.',
    weInviteYou: 'МЫ ПРИГЛАШАЕМ ВАС',
    inviteQuote: '«Два сердца соединяются, открывая новую главу жизни...»',
    inviteText:
      'Приглашаем вас разделить с нами радость этого особенного и неповторимого дня — дня нашей свадьбы.',
    countdownTitle: 'ДО СВАДЬБЫ ОСТАЛОСЬ',
    days: 'ДНЕЙ',
    hours: 'ЧАСОВ',
    minutes: 'МИНУТ',
    seconds: 'СЕКУНД',
    addToCalendar: 'ДОБАВИТЬ В КАЛЕНДАРЬ',
    googleCalendar: 'Google Calendar',
    appleCalendar: 'Apple / iCal',
    loveStoryBadge: 'ИСТОРИЯ ЛЮБВИ',
    loveStoryTitle: 'Наша история',
    scheduleBadge: 'ПРОГРАММА ДНЯ',
    scheduleTitle: 'План торжества',
    galleryBadge: 'ФОТОГАЛЕРЕЯ',
    galleryTitle: 'Наши моменты',
    galleryHint: 'Нажмите на фото для увеличения',
    uploadedPhotos: 'Загружено фото:',
    photoAlt: 'Свадебная фотография',
    closeModal: 'Закрыть',
    venueBadge: 'МЕСТО ПРОВЕДЕНИЯ',
    venueTitle: 'Локация торжества',
    venueTimeFrom: 'С {time}',
    viewOnYandex: 'Яндекс Карты',
    viewOnGoogle: 'Google Maps',
    copyAddress: 'Скопировать адрес',
    addressCopied: 'Адрес скопирован!',
    giftCardBadge: 'СВАДЕБНЫЙ ПОДАРОК',
    giftCardTitle: 'Подарки и пожелания',
    giftCardDesc:
      'Главный подарок для нас — ваше присутствие и теплые улыбки. Если вы желаете порадовать молодую семью денежным подарком, воспользуйтесь реквизитами карты.',
    giftCardHolder: 'Владелец карты:',
    copyCardNumber: 'Скопировать номер карты',
    cardNumberCopied: 'Номер карты скопирован!',
    giftCardExample: 'Пример карты',
    weAreWaiting: 'С нетерпением ждём вас',
    openRsvpButton: 'ПОДТВЕРДИТЬ ПРИСУТСТВИЕ (RSVP)',
    rsvpBadge: 'ОНЛАЙН-АНКЕТА',
    rsvpTitle: 'Подтвердите присутствие',
    guestNameLabel: 'Ваше имя и фамилия:',
    guestNamePlaceholder: 'Например: Джамшид Алиев',
    attendingQuestion: 'Сможете ли вы прийти?',
    attendingYes: 'С удовольствием приду!',
    attendingNo: 'К сожалению, не смогу',
    guestCountLabel: 'Количество гостей:',
    wishesLabel: 'Пожелания паре (необязательно):',
    wishesPlaceholder: 'Желаем счастья и благополучия молодым...',
    submitRsvp: 'ОТПРАВИТЬ',
    submittingRsvp: 'Отправка...',
    rsvpSuccessTitle: 'Спасибо! Ваш ответ принят.',
    rsvpSuccessDesc: 'Будем очень рады видеть вас на нашем празднике!',
    rsvpPreviewNote: 'Это режим предпросмотра. На реальном сайте ответ гостя сохраняется.',
    rsvpError: 'Произошла ошибка. Пожалуйста, попробуйте снова.',
  },
  en: {
    coverBadge: 'YOU ARE CORDIALLY INVITED',
    coverAyahArabic: 'وَأَلَّفَ بَيْنَ قُلُوبِهِمْ',
    coverAyahTranslation: '“And He united their hearts”',
    coverAyahSurah: 'SURAH AL-ANFAL, AYAH 63',
    swipeToOpen: 'SWIPE TO OPEN',
    openInvitationButton: 'Open invitation',
    tapToOpenHint: 'Or tap to open',
    musicToggle: 'Toggle music sound',
    switchLang: 'Choose language',
    invitationTitle: 'WEDDING INVITATION',
    scrollDown: 'SCROLL DOWN',
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    ayahArabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    ayahTranslation:
      '“And among His signs is this: that He created for you mates from among yourselves, that ye may dwell in tranquility with them, and He has put love and mercy between your hearts.”',
    ayahSurah: '(SURAH AR-RUM, AYAH 21)',
    withGreatRespect: 'WITH GREAT RESPECT',
    brideSide: 'BRIDE’S FAMILY',
    groomSide: 'GROOM’S FAMILY',
    parentsInvitationNote: 'We are delighted to celebrate this joyous milestone of our children with you.',
    weInviteYou: 'WE CORDIALLY INVITE YOU',
    inviteQuote: '“Two hearts unite to begin a beautiful journey together...”',
    inviteText:
      'We warmly invite you to be our honored guest and celebrate this unforgettable day of our wedding.',
    countdownTitle: 'COUNTDOWN TO THE WEDDING',
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    seconds: 'SECONDS',
    addToCalendar: 'ADD TO CALENDAR',
    googleCalendar: 'Google Calendar',
    appleCalendar: 'Apple / iCal',
    loveStoryBadge: 'OUR LOVE STORY',
    loveStoryTitle: 'How our story began',
    scheduleBadge: 'ORDER OF EVENTS',
    scheduleTitle: 'Wedding Program',
    galleryBadge: 'MEMORIES',
    galleryTitle: 'Captured Moments',
    galleryHint: 'Tap to view full photo',
    uploadedPhotos: 'Uploaded photos:',
    photoAlt: 'Wedding photo',
    closeModal: 'Close',
    venueBadge: 'VENUE LOCATION',
    venueTitle: 'Where the Celebration Takes Place',
    venueTimeFrom: 'From {time}',
    viewOnYandex: 'Yandex Maps',
    viewOnGoogle: 'Google Maps',
    copyAddress: 'Copy address',
    addressCopied: 'Address copied!',
    giftCardBadge: 'WEDDING GIFT',
    giftCardTitle: 'Gifts & Best Wishes',
    giftCardDesc:
      'Your presence is the most cherished gift of all. Should you wish to bless us with a monetary gift, you may use the card details below.',
    giftCardHolder: 'Card holder:',
    copyCardNumber: 'Copy card number',
    cardNumberCopied: 'Card number copied!',
    giftCardExample: 'Card example',
    weAreWaiting: 'We look forward to seeing you',
    openRsvpButton: 'CONFIRM ATTENDANCE (RSVP)',
    rsvpBadge: 'ONLINE RSVP',
    rsvpTitle: 'Confirm Attendance',
    guestNameLabel: 'Full name:',
    guestNamePlaceholder: 'E.g.: Jamshid Aliyev',
    attendingQuestion: 'Will you be attending?',
    attendingYes: 'Joyfully Accept',
    attendingNo: 'Regretfully Decline',
    guestCountLabel: 'Number of guests:',
    wishesLabel: 'Warm wishes (optional):',
    wishesPlaceholder: 'Wishing you a lifetime of love and happiness...',
    submitRsvp: 'SUBMIT',
    submittingRsvp: 'Sending...',
    rsvpSuccessTitle: 'Thank you! Your RSVP is received.',
    rsvpSuccessDesc: 'We look forward to celebrating together!',
    rsvpPreviewNote: 'This is preview mode. On live site guest RSVP is saved.',
    rsvpError: 'An error occurred. Please try again.',
  },
};

const DEMO_TIMELINE: Record<'ru' | 'uz' | 'en', LoveStoryItem[]> = {
  uz: [
    { year: '2022', title: 'Ilk uchrashuv', desc: 'Taqdir bizni bahorning iliq kunida uchrashtirdi.' },
    { year: '2023', title: 'Sevgi izhori', desc: 'Samimiy doʻstligimiz chuqur muhabbatga aylandi.' },
    { year: '2024', title: 'Unashtiruv', desc: 'Oila aʼzolarimiz duosi bilan hayotimizni birga bogʻladik.' },
  ],
  ru: [
    { year: '2022', title: 'Первая встреча', desc: 'Судьба свела нас теплым весенним днем.' },
    { year: '2023', title: 'Признание в любви', desc: 'Наша дружба переросла в искреннюю любовь.' },
    { year: '2024', title: 'Помолвка', desc: 'С благословения родителей мы соединили наши судьбы.' },
  ],
  en: [
    { year: '2022', title: 'First Meeting', desc: 'Fate brought our paths together on a bright spring day.' },
    { year: '2023', title: 'Declaration of Love', desc: 'Our friendship blossomed into a deep, lasting love.' },
    { year: '2024', title: 'Engagement', desc: 'With the blessings of our families, we made our forever promise.' },
  ],
};

const DEMO_FAMILIES: Record<'ru' | 'uz' | 'en', { brideFamily: string; groomFamily: string }> = {
  uz: { brideFamily: 'Karimovlar', groomFamily: 'Soliyevlar' },
  ru: { brideFamily: 'Каримовы', groomFamily: 'Солиевы' },
  en: { brideFamily: 'Karimov family', groomFamily: 'Soliyev family' },
};

const PREVIEW_GALLERY = [
  '/olive-editorial-hero.webp',
  '/olive-editorial-details.webp',
  '/olive-editorial-venue.webp',
  '/wedding_doves.webp',
];

// ==========================================
// Golden Dust Ambient Particle System (Cover only, <= 10 particles)
// ==========================================
const GoldParticleSystem = ({ calmMotion }: { calmMotion: boolean }) => {
  if (calmMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`gold-dust-${i}`}
          className="absolute rounded-full"
          style={{
            top: `${(i * 13 + 7) % 94}%`,
            left: `${(i * 23 + 11) % 92}%`,
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            background: i % 2 === 0
              ? 'radial-gradient(circle, rgba(212,175,55,0.85) 0%, rgba(212,175,55,0) 70%)'
              : 'radial-gradient(circle, rgba(255,223,128,0.75) 0%, rgba(245,158,11,0) 70%)',
            boxShadow: '0 0 8px rgba(212, 175, 55, 0.4)',
          }}
          animate={{
            y: [0, -45, 0],
            x: [0, (i % 2 === 0 ? 12 : -12), 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 5 + (i % 3) * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.35,
          }}
        />
      ))}
    </div>
  );
};

// ==========================================
// SWIPE TO OPEN SLIDER BUTTON (With 70% threshold & accessibility)
// ==========================================
interface SwipeToOpenButtonProps {
  onOpen: () => void;
  label: string;
}

const SwipeToOpenButton: React.FC<SwipeToOpenButtonProps> = ({ onOpen, label }) => {
  const [dragged, setDragged] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(280);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const triggerSuccess = () => {
    if (dragged) return;
    setDragged(true);
    setTimeout(() => {
      onOpen();
    }, 450);
  };

  const maxDrag = Math.max(0, containerWidth - 56);

  const handleDragEnd = (_: any, info: any) => {
    // 70% threshold as required by task
    if (info.offset.x >= maxDrag * 0.70 || (info.point && containerWidth > 0 && info.point.x >= containerWidth * 0.70)) {
      triggerSuccess();
    }
  };

  return (
    <div 
      ref={containerRef}
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={dragged ? 100 : 0}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          triggerSuccess();
        }
      }}
      onClick={triggerSuccess}
      className="w-full h-14 sm:h-16 rounded-full bg-slate-900/90 border border-amber-400/50 backdrop-blur-md p-1.5 flex items-center relative overflow-hidden select-none shadow-[0_0_30px_rgba(212,175,55,0.35)] cursor-pointer group focus:outline-none focus:ring-2 focus:ring-amber-400"
    >
      {/* Shimmer Light Passing Through */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/25 to-transparent pointer-events-none"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Golden Drag Fill */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-full"
        initial={{ width: '56px' }}
        animate={{ width: dragged ? '100%' : '56px' }}
        transition={{ duration: dragged ? 0.45 : 0.2, ease: 'easeOut' }}
      />

      {/* Text in safe area to right of knob */}
      <div className="absolute inset-y-0 left-[68px] right-3 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
        <span className="text-[11px] font-sans font-bold uppercase tracking-[0.14em] whitespace-nowrap text-amber-200 group-hover:text-amber-100 transition-colors drop-shadow-md">
          {label}
        </span>
      </div>

      {/* Draggable Circle Knob */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.15}
        dragSnapToOrigin={!dragged}
        onDragEnd={handleDragEnd}
        animate={
          dragged
            ? { x: maxDrag }
            : { x: [0, 14, 0] }
        }
        transition={
          dragged
            ? { duration: 0.45, ease: 'easeOut' }
            : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
        }
        className="w-11 sm:w-13 h-11 sm:h-13 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-bold flex items-center justify-center shadow-lg z-20 shrink-0 cursor-grab active:cursor-grabbing border border-amber-200/80"
      >
        <span className="text-base sm:text-lg font-bold" aria-hidden="true">→</span>
      </motion.div>
    </div>
  );
};

// ==========================================
// MAIN TEMPLATE COMPONENT
// ==========================================
export const MalikaUlugbekWeddingSite: React.FC<WebsiteTemplateProps> = ({
  data,
  lang = 'uz',
  isOpened = false,
  onOpenEnvelope,
  isPlaying = false,
  onToggleAudio,
  timeLeft: externalTimeLeft,
  rsvpState,
  isPreview = false,
  isCatalogPreview = false,
  onLanguageChange,
}) => {
  // Opening state
  const [internalOpened, setInternalOpened] = useState(isOpened);

  useEffect(() => {
    setInternalOpened(isOpened);
  }, [isOpened]);

  const isOpenedState = isOpened || internalOpened;

  const handleOpen = () => {
    setInternalOpened(true);
    if (onOpenEnvelope) onOpenEnvelope();
  };

  // Language management
  const [currentLang, setCurrentLang] = useState<'ru' | 'uz' | 'en'>(lang || 'uz');

  useEffect(() => {
    if (lang) {
      setCurrentLang(lang);
    }
  }, [lang]);

  const handleLanguageChange = (nextLang: 'ru' | 'uz' | 'en') => {
    setCurrentLang(nextLang);
    if (onLanguageChange) {
      onLanguageChange(nextLang);
    }
  };

  const t = translations[currentLang] || translations.uz;
  const demo = getDemoContent(currentLang);
  const calmMotion = useCalmMotion(isPreview);

  // Section visibility control
  const isSectionVisible = createSectionVisibility(data.hiddenSections);

  // Content state with localized demo fallback in preview
  const groomName = data.groomName?.trim() || (isPreview ? demo.groomName : '');
  const brideName = data.brideName?.trim() || (isPreview ? demo.brideName : '');
  const weddingDate = data.date || (isPreview ? '2026-09-09' : '');
  const weddingTime = data.time || (isPreview ? '18:00' : '');
  const venueName = data.venue?.trim() || (isPreview ? demo.venue : '');
  const addressText = data.address?.trim() || (isPreview ? demo.address : '');

  // Formatted date using Intl / shared helper (Never 2026 . 10 . 10)
  const formattedDate = useMemo(() => {
    if (!weddingDate) return { day: '', month: '', monthShort: '', year: '', weekday: '', full: '' };
    return formatEventDate(weddingDate, currentLang);
  }, [weddingDate, currentLang]);

  // Parents content
  const brideParents = data.brideParents?.trim() || (isPreview ? demo.brideParents : undefined);
  const groomParents = data.groomParents?.trim() || (isPreview ? demo.groomParents : undefined);
  const brideFamily = data.brideFamily?.trim() || (isPreview ? DEMO_FAMILIES[currentLang].brideFamily : undefined);
  const groomFamily = data.groomFamily?.trim() || (isPreview ? DEMO_FAMILIES[currentLang].groomFamily : undefined);
  const hasParentsContent = Boolean(brideParents || groomParents || brideFamily || groomFamily);

  // Love Story content
  const hasUserLoveStory = typeof data.loveStory === 'string' && data.loveStory.trim().length > 0;
  const hasUserLoveStoryItems = Array.isArray(data.loveStoryItems) && data.loveStoryItems.length > 0;
  const hasLoveStoryContent = hasUserLoveStory || hasUserLoveStoryItems || isPreview;

  const loveStoryText = hasUserLoveStory
    ? (data.loveStory as string)
    : (!hasUserLoveStoryItems && isPreview ? demo.loveStory : undefined);

  const loveStoryTimeline = hasUserLoveStoryItems
    ? (data.loveStoryItems as LoveStoryItem[])
    : (!hasUserLoveStory && isPreview ? DEMO_TIMELINE[currentLang] : undefined);

  // Schedule content
  const userSchedule = (Array.isArray(data.schedule) && data.schedule.length > 0)
    ? data.schedule
    : (Array.isArray(data.scheduleItems) && data.scheduleItems.length > 0)
      ? data.scheduleItems
      : undefined;

  const scheduleItems = userSchedule || (isPreview ? demo.schedule : undefined);
  const hasScheduleContent = Boolean(scheduleItems && scheduleItems.length > 0);

  // Gallery Photos Display
  const userPhotos = Array.isArray(data.photos) && data.photos.length > 0
    ? data.photos.map((p) => getMediaUrl(p))
    : undefined;

  const photos = userPhotos || (isPreview ? PREVIEW_GALLERY : []);
  const maxPhotosLimit = 6;
  const [activeModalPhoto, setActiveModalPhoto] = useState<string | null>(null);

  // Gift Card content
  const giftCardNumber = data.giftCardNumber?.trim() || '';
  const giftCardOwner = data.giftCardOwner?.trim() || '';
  const hasGiftCardContent = Boolean(giftCardNumber || isPreview);

  // Live Timer
  const timerDisplay = useCountdownTimer(weddingDate || '2026-09-09', weddingTime || '18:00', externalTimeLeft);

  // Calendar Event & Actions
  const calendarEvent = useMemo(() => {
    const start = parseEventDateTime(weddingDate || '2026-09-09', weddingTime || '18:00');
    return {
      title: `${brideName} & ${groomName} | ${t.invitationTitle}`,
      start,
      durationMinutes: 240,
      location: [venueName, addressText].filter(Boolean).join(', '),
      description: t.inviteText,
    };
  }, [weddingDate, weddingTime, brideName, groomName, venueName, addressText, t.invitationTitle, t.inviteText]);

  const handleAddToCalendarIcs = () => {
    downloadIcs(calendarEvent);
  };

  const googleCalendarHref = useMemo(() => {
    return getGoogleCalendarUrl(calendarEvent);
  }, [calendarEvent]);

  // Copy helpers
  const { copied: addressCopied, copy: copyAddress } = useCopyToClipboard();
  const { copied: cardCopied, copy: copyCard } = useCopyToClipboard();

  // RSVP Form Modal State
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [localName, setLocalName] = useState('');
  const [localAttending, setLocalAttending] = useState<boolean | null>(true);
  const [localGuestCount, setLocalGuestCount] = useState<number>(1);
  const [localWishes, setLocalWishes] = useState('');
  const [previewSubmitted, setPreviewSubmitted] = useState(false);
  const [rsvpErrorMsg, setRsvpErrorMsg] = useState<string | null>(null);

  const guestName = rsvpState ? rsvpState.name : localName;
  const setGuestName = rsvpState ? rsvpState.setName : setLocalName;
  const isAttending = rsvpState ? rsvpState.attending : localAttending;
  const setIsAttending = rsvpState ? rsvpState.setAttending : setLocalAttending;
  const guestCount = rsvpState ? rsvpState.guestCount : localGuestCount;
  const setGuestCount = rsvpState ? rsvpState.setGuestCount : setLocalGuestCount;
  const guestWishes = rsvpState ? rsvpState.wishes : localWishes;
  const setGuestWishes = rsvpState ? rsvpState.setWishes : setLocalWishes;
  const isSubmitting = rsvpState?.isSubmitting || false;
  const isSuccess = Boolean(rsvpState ? rsvpState.isSuccess : previewSubmitted);
  const effectiveRsvpError = rsvpState?.error ? t.rsvpError : rsvpErrorMsg;

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpErrorMsg(null);

    if (rsvpState?.onSubmit) {
      try {
        await rsvpState.onSubmit(e);
      } catch {
        setRsvpErrorMsg(t.rsvpError);
      }
    } else if (isPreview) {
      setPreviewSubmitted(true);
    }
  };

  // Keyboard escape listeners for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowRsvpModal(false);
        setActiveModalPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Map URLs
  const yandexMapUrl = getYandexMapsUrl(venueName, addressText);
  const googleMapUrl = getGoogleMapsUrl(venueName, addressText);

  // Cover screen should show only if hero section is visible and not opened
  const showCover = isSectionVisible('hero') && !isOpenedState;

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#2C2420] font-serif antialiased relative selection:bg-amber-200 selection:text-amber-900 overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* LUXURY SILK SHIMMER BACKGROUND (Slow 25s diagonal shift) */}
      {/* ======================================================== */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 60%), linear-gradient(135deg, #FAF7F2 0%, #F5EDE0 28%, #FAF7F2 50%, #F1E5D3 75%, #FAF7F2 100%)',
          backgroundSize: '250% 250%',
        }}
        animate={
          calmMotion
            ? undefined
            : {
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }
        }
        transition={
          calmMotion
            ? undefined
            : {
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      />

      {/* Floating Audio & Language Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* Language selector */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-amber-400/40 rounded-full p-1 flex items-center shadow-xl">
          <Globe className="w-3.5 h-3.5 text-amber-300 ml-1.5 mr-0.5 shrink-0" aria-hidden="true" />
          {(['uz', 'ru', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => handleLanguageChange(l)}
              className={`px-2 py-0.5 text-[11px] font-sans font-bold tracking-wider rounded-full uppercase transition-all cursor-pointer ${
                currentLang === l
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-amber-200/80 hover:text-amber-100'
              }`}
              aria-pressed={currentLang === l}
              aria-label={`${t.switchLang}: ${l.toUpperCase()}`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Floating Audio Toggle */}
        {onToggleAudio && (
          <button
            onClick={onToggleAudio}
            className="w-10 h-10 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-xl hover:scale-105 transition-transform cursor-pointer"
            aria-label={t.musicToggle}
            title={t.musicToggle}
          >
            {isPlaying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <Music className="w-4 h-4 text-amber-400" />
              </motion.div>
            ) : (
              <VolumeX className="w-4 h-4 opacity-70" />
            )}
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* COVER / ENVELOPE INTRO SCREEN (SLIDES UPWARDS ON OPEN) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showCover && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={{ 
              y: '-100%', 
              opacity: 0,
              transition: { duration: 0.85, ease: [0.33, 1, 0.68, 1] } 
            }}
            className="fixed inset-0 z-40 bg-[#0A0E17] flex flex-col items-center justify-between p-6 sm:p-10 text-center select-none overflow-hidden"
          >
            {/* Particles on cover only (<= 10 elements) */}
            <GoldParticleSystem calmMotion={calmMotion} />

            {/* Luxury Border Ornaments */}
            <div className="absolute inset-4 sm:inset-8 border border-amber-500/30 rounded-3xl pointer-events-none flex flex-col justify-between p-4 z-10">
              <div className="flex justify-between items-start">
                <div className="w-5 h-5 border-t-2 border-l-2 border-amber-400/70 rounded-tl"></div>
                <div className="w-5 h-5 border-t-2 border-r-2 border-amber-400/70 rounded-tr"></div>
              </div>
              <div className="flex justify-between items-end">
                <div className="w-5 h-5 border-b-2 border-l-2 border-amber-400/70 rounded-bl"></div>
                <div className="w-5 h-5 border-b-2 border-r-2 border-amber-400/70 rounded-br"></div>
              </div>
            </div>

            {/* Top Badge */}
            <div className="pt-8 sm:pt-12 z-20">
              <span className="inline-block px-5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm uppercase tracking-[0.25em] font-sans">
                {t.coverBadge}
              </span>
            </div>

            {/* Center Names & Quranic Ayah */}
            <div className={`my-auto z-20 max-w-md w-full px-4 ${isCatalogPreview ? 'space-y-4' : 'space-y-4'}`}>
              <div className="flex flex-col items-center">
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="text-4xl sm:text-6xl font-serif leading-[1.05] tracking-wide text-amber-200 drop-shadow-md"
                >
                  {brideName}
                </motion.h1>
                <span className="text-amber-400/80 text-2xl font-light italic font-serif my-1 block">&</span>
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="text-4xl sm:text-6xl font-serif leading-[1.05] tracking-wide text-amber-200 drop-shadow-md"
                >
                  {groomName}
                </motion.h1>
              </div>

              {formattedDate.full && (
                <div className="text-amber-300/80 tracking-widest text-xs sm:text-sm font-sans pt-1">
                  {formattedDate.full}
                </div>
              )}

              {/* Calligraphy Card with Amiri Font */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className={`rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-sm shadow-2xl flex flex-col items-center justify-center ${
                  isCatalogPreview ? 'min-h-[140px] px-5 py-4 gap-2.5' : 'p-5 sm:p-6 gap-3'
                }`}
              >
                <p 
                  dir="rtl" 
                  lang="ar" 
                  className="block w-full text-2xl sm:text-3xl text-amber-200 font-arabic leading-[1.8] pb-1"
                >
                  {t.coverAyahArabic}
                </p>
                <p className="block w-full max-w-[280px] text-xs sm:text-sm leading-[1.55] text-amber-100/90 italic font-serif">
                  {t.coverAyahTranslation}
                </p>
                <p className="block w-full text-[11px] leading-none text-amber-400/70 uppercase tracking-[0.16em] font-sans mt-0.5">
                  {t.coverAyahSurah}
                </p>
              </motion.div>
            </div>

            {/* Bottom Controls: Slider + Tap Alternative Button */}
            <div className="pb-8 sm:pb-12 z-20 w-full max-w-xs px-4">
              {isCatalogPreview ? (
                <button
                  type="button"
                  onClick={handleOpen}
                  className="w-full h-14 rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-slate-950 border border-amber-200/80 shadow-[0_0_24px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 px-5 font-sans font-extrabold text-xs uppercase tracking-[0.12em] whitespace-nowrap cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.openInvitationButton}</span>
                </button>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <SwipeToOpenButton onOpen={handleOpen} label={t.swipeToOpen} />
                  
                  {/* Tap Alternative Button for Elderly Guests */}
                  <button
                    type="button"
                    onClick={handleOpen}
                    className="w-full mt-3 py-2.5 px-4 rounded-full border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 active:scale-[0.98] text-amber-200 text-xs font-sans tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                    <span>{t.openInvitationButton}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MAIN CONTAINER: 480px Centered Column (No phone mockup frame) */}
      {/* ======================================================== */}
      <div className="w-full max-w-[480px] mx-auto min-h-screen relative flex flex-col justify-between z-10">

        <main className="w-full px-5 py-8 space-y-14 z-20">

          {/* ------------------------------------------------------ */}
          {/* SECTION: COUPLE INVITATION BLOCK */}
          {/* ------------------------------------------------------ */}
          {isSectionVisible('couple') && (
            <>
              <section className="pt-6 text-center space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-3"
                >
                  <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-amber-800/80 border-b border-amber-300/60 pb-1 inline-block">
                    {t.invitationTitle}
                  </span>
                  
                  <h1 className="text-4xl sm:text-5xl font-serif text-[#2C2420] tracking-wide pt-1">
                    {brideName}
                  </h1>
                  <div className="text-amber-600/80 text-xl font-light italic font-serif">&</div>
                  <h1 className="text-4xl sm:text-5xl font-serif text-[#2C2420] tracking-wide">
                    {groomName}
                  </h1>

                  {formattedDate.full && (
                    <div className="pt-3 flex items-center justify-center gap-3 text-amber-900/90 text-xs sm:text-sm font-sans tracking-widest">
                      <span className="h-[1px] w-6 bg-amber-400/60"></span>
                      <span>{formattedDate.full}</span>
                      <span className="h-[1px] w-6 bg-amber-400/60"></span>
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="pt-6 text-center text-[11px] text-amber-900/70 font-sans tracking-widest uppercase flex flex-col items-center gap-1.5"
                >
                  <span>{t.scrollDown}</span>
                  <motion.div
                    animate={calmMotion ? undefined : { y: [0, 5, 0] }}
                    transition={calmMotion ? undefined : { duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronDown className="w-4 h-4 text-amber-600" />
                  </motion.div>
                </motion.div>
              </section>

              {/* SACRED AYAH CARD (Amiri Font, No Traditional Arabic) */}
              <section>
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-amber-200/80 shadow-[0_8px_25px_rgba(212,175,55,0.08)] text-center space-y-3.5 relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>

                  <p 
                    dir="rtl" 
                    lang="ar" 
                    className="text-2xl text-amber-950 font-arabic leading-relaxed pt-1"
                  >
                    {t.bismillah}
                  </p>

                  <p 
                    dir="rtl" 
                    lang="ar" 
                    className="text-xl sm:text-2xl text-amber-900/90 font-arabic leading-loose"
                  >
                    {t.ayahArabic}
                  </p>

                  <p className="text-xs sm:text-sm text-stone-700 italic font-serif leading-relaxed">
                    {t.ayahTranslation}
                  </p>

                  <span className="inline-block text-[11px] text-amber-800/70 uppercase tracking-widest font-sans">
                    {t.ayahSurah}
                  </span>
                </motion.div>
              </section>
            </>
          )}

          {/* ------------------------------------------------------ */}
          {/* SECTION: HOSTS & PARENTS (Divided by subtle vertical gold line) */}
          {/* ------------------------------------------------------ */}
          {isSectionVisible('parents') && hasParentsContent && (
            <section className="text-center space-y-6">
              <div className="space-y-1.5">
                <span className="text-[11px] font-sans tracking-[0.2em] text-amber-800/70 uppercase font-semibold">
                  {t.withGreatRespect}
                </span>
                <div className="w-10 h-[1px] bg-amber-400/60 mx-auto"></div>
              </div>

              {/* Elegant Two Columns with Vertical Gold Divider (No heavy white cards) */}
              <div className="relative py-3">
                <div className="grid grid-cols-2 gap-4">
                  {/* Bride's Side */}
                  <div className="text-center px-2 space-y-1">
                    <span className="text-[11px] font-sans tracking-widest uppercase text-amber-800/80 font-bold block">
                      {t.brideSide}
                    </span>
                    {brideParents && (
                      <p className="text-sm sm:text-base font-serif text-stone-900 font-semibold leading-snug">
                        {brideParents}
                      </p>
                    )}
                    {brideFamily && (
                      <p className="text-xs font-serif text-amber-900/80">
                        {brideFamily}
                      </p>
                    )}
                  </div>

                  {/* Groom's Side */}
                  <div className="text-center px-2 space-y-1">
                    <span className="text-[11px] font-sans tracking-widest uppercase text-amber-800/80 font-bold block">
                      {t.groomSide}
                    </span>
                    {groomParents && (
                      <p className="text-sm sm:text-base font-serif text-stone-900 font-semibold leading-snug">
                        {groomParents}
                      </p>
                    )}
                    {groomFamily && (
                      <p className="text-xs font-serif text-amber-900/80">
                        {groomFamily}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subtle vertical gold divider */}
                <div className="absolute top-1 bottom-1 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-amber-400/60 to-transparent pointer-events-none" />
              </div>

              <p className="text-xs sm:text-sm text-stone-700 font-serif italic max-w-xs mx-auto">
                {t.parentsInvitationNote}
              </p>

              <div className="pt-2 space-y-2.5">
                <span className="text-[11px] font-sans tracking-[0.2em] text-amber-800/70 uppercase block font-semibold">
                  {t.weInviteYou}
                </span>
                <div className="p-5 rounded-2xl bg-white/85 border border-amber-200/70 shadow-sm text-xs sm:text-sm font-serif leading-relaxed text-stone-800">
                  <p className="italic mb-2 text-amber-950 font-medium text-sm sm:text-base">
                    {t.inviteQuote}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                    {t.inviteText}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------ */}
          {/* SECTION: COUNTDOWN & CALENDAR */}
          {/* ------------------------------------------------------ */}
          {isSectionVisible('countdown') && (
            <section className="text-center space-y-5">
              <span className="text-[11px] font-sans tracking-[0.2em] text-amber-800/80 uppercase font-semibold">
                {t.countdownTitle}
              </span>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: t.days, value: timerDisplay.days },
                  { label: t.hours, value: timerDisplay.hours },
                  { label: t.minutes, value: timerDisplay.minutes },
                  { label: t.seconds, value: timerDisplay.seconds },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl bg-white/90 border border-amber-200/80 shadow-sm flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-950">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] font-sans tracking-wider text-stone-600 mt-0.5 uppercase font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add to Calendar Actions (Google Calendar & iCal) */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <a
                  href={googleCalendarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-amber-300 text-amber-900 text-xs font-sans font-semibold tracking-wider uppercase shadow-sm hover:bg-amber-50 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.googleCalendar}</span>
                  <ExternalLink className="w-3 h-3 text-amber-500/70 ml-0.5" />
                </a>

                <button
                  type="button"
                  onClick={handleAddToCalendarIcs}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-amber-300 text-amber-900 text-xs font-sans font-semibold tracking-wider uppercase shadow-sm hover:bg-amber-50 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.appleCalendar}</span>
                </button>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------ */}
          {/* SECTION: LOVE STORY */}
          {/* ------------------------------------------------------ */}
          {isSectionVisible('loveStory') && hasLoveStoryContent && (
            <section className="space-y-5">
              <div className="text-center space-y-0.5">
                <span className="text-[11px] font-sans tracking-[0.2em] text-amber-800/70 uppercase font-semibold">
                  {t.loveStoryBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">
                  {t.loveStoryTitle}
                </h2>
              </div>

              {/* Text paragraphs if loveStory is a string */}
              {loveStoryText && (
                <div className="p-5 rounded-2xl bg-white/85 border border-amber-200/60 shadow-sm text-stone-700 font-serif leading-relaxed text-sm sm:text-base space-y-2.5">
                  {loveStoryText.split('\n').filter((p) => p.trim().length > 0).map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Timeline steps if loveStoryItems are provided */}
              {loveStoryTimeline && loveStoryTimeline.length > 0 && (
                <div className="space-y-3 relative before:absolute before:left-5 before:top-2.5 before:bottom-2.5 before:w-[1px] before:bg-amber-300/60">
                  {loveStoryTimeline.map((step, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className="absolute left-3.5 top-2 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-sm -translate-x-1/2"></div>
                      <div className="p-3.5 rounded-2xl bg-white/85 border border-amber-200/50 shadow-sm space-y-0.5">
                        <span className="text-xs font-sans font-bold text-amber-800 tracking-wider">
                          {step.year}
                        </span>
                        <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900">
                          {step.title}
                        </h3>
                        {step.desc && (
                          <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                            {step.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ------------------------------------------------------ */}
          {/* SECTION: PROGRAM SCHEDULE */}
          {/* ------------------------------------------------------ */}
          {isSectionVisible('schedule') && hasScheduleContent && scheduleItems && (
            <section className="space-y-5">
              <div className="text-center space-y-0.5">
                <span className="text-[11px] font-sans tracking-[0.2em] text-amber-800/70 uppercase font-semibold">
                  {t.scheduleBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">
                  {t.scheduleTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {scheduleItems.map((item: any, idx: number) => {
                  return (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/85 border border-amber-200/60 shadow-sm flex items-center gap-3.5"
                    >
                      <div className="w-14 h-10 rounded-xl bg-amber-100/80 border border-amber-300/60 flex items-center justify-center text-amber-900 shrink-0 font-bold text-xs font-sans">
                        {item.time}
                      </div>
                      <div>
                        <span className="text-sm font-serif text-stone-900 font-bold block">
                          {item.title || item.label}
                        </span>
                        {item.desc && (
                          <span className="text-xs font-sans text-stone-600 block mt-0.5">
                            {item.desc}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------ */}
          {/* SECTION: PHOTO GALLERY */}
          {/* ------------------------------------------------------ */}
          {isSectionVisible('gallery') && photos.length > 0 && (
            <section className="space-y-5">
              <div className="text-center space-y-0.5">
                <span className="text-[11px] font-sans tracking-[0.2em] text-amber-800/70 uppercase font-semibold">
                  {t.galleryBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">
                  {t.galleryTitle}
                </h2>
                <p className="text-xs text-stone-600 font-sans">
                  {t.galleryHint}
                </p>
              </div>

              {/* UPLOAD COUNTER BADGE - SHOWN ONLY IN isPreview */}
              {isPreview && (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white border border-amber-200/70 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-sans font-medium text-stone-700">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>{t.uploadedPhotos}</span>
                  </div>
                  <span className="px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-900 font-sans font-bold text-xs">
                    {photos.length} / {maxPhotosLimit}
                  </span>
                </div>
              )}

              {/* PHOTO GRID */}
              <div className="grid grid-cols-2 gap-2.5">
                {photos.map((url, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveModalPhoto(url)}
                    className="aspect-[4/5] rounded-2xl overflow-hidden border border-amber-200/60 shadow-sm cursor-pointer relative group bg-stone-100"
                  >
                    <img 
                      src={url} 
                      alt={`${t.photoAlt} ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------ */}
          {/* SECTION: VENUE & LOCATION */}
          {/* ------------------------------------------------------ */}
          {isSectionVisible('venue') && (
            <section className="space-y-5 text-center">
              <div className="space-y-0.5">
                <span className="text-[11px] font-sans tracking-[0.2em] text-amber-800/70 uppercase font-semibold">
                  {t.venueBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">
                  {t.venueTitle}
                </h2>
              </div>

              <div className="p-6 rounded-3xl bg-white/90 border border-amber-200/80 shadow-md text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300/60 mx-auto flex items-center justify-center text-amber-800">
                  <MapPin className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-950">
                    {venueName}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 font-sans max-w-xs mx-auto leading-relaxed">
                    {addressText}
                  </p>
                  {weddingTime && (
                    <p className="text-xs font-sans font-semibold text-amber-900 pt-1">
                      {t.venueTimeFrom.replace('{time}', weddingTime)}
                    </p>
                  )}
                </div>

                {/* Copy address button */}
                {addressText && (
                  <div>
                    <button
                      type="button"
                      onClick={() => copyAddress(addressText)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-900 text-xs font-sans font-medium hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      {addressCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">{t.addressCopied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-700" />
                          <span>{t.copyAddress}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Navigation Map Buttons (Both Yandex & Google Maps) */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <a
                    href={yandexMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 text-stone-950 font-sans font-bold text-xs tracking-wider uppercase shadow-md hover:bg-amber-400 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{t.viewOnYandex}</span>
                  </a>

                  <a
                    href={googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-stone-800 text-white font-sans font-bold text-xs tracking-wider uppercase shadow-md hover:bg-stone-700 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{t.viewOnGoogle}</span>
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------ */}
          {/* SECTION: GIFT CARD (Only shown if card exists or in preview) */}
          {/* ------------------------------------------------------ */}
          {isSectionVisible('giftCard') && hasGiftCardContent && (
            <section className="space-y-5 text-center">
              <div className="space-y-0.5">
                <span className="text-[11px] font-sans tracking-[0.2em] text-amber-800/70 uppercase font-semibold">
                  {t.giftCardBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">
                  {t.giftCardTitle}
                </h2>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/95 to-amber-50/80 border border-amber-200/90 shadow-md text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300/60 mx-auto flex items-center justify-center text-amber-800">
                  <Gift className="w-6 h-6" />
                </div>

                <p className="text-xs sm:text-sm text-stone-700 font-sans max-w-xs mx-auto leading-relaxed">
                  {t.giftCardDesc}
                </p>

                {/* Luxury Bank Card representation */}
                <div className="max-w-xs mx-auto p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-amber-200 border border-amber-400/40 shadow-xl space-y-3">
                  <div className="flex justify-between items-center text-[11px] font-sans text-amber-300/80 uppercase tracking-widest">
                    <span>BANK CARD</span>
                    {isPreview && !giftCardNumber && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px]">
                        {t.giftCardExample}
                      </span>
                    )}
                  </div>

                  <p className="text-lg sm:text-xl font-mono tracking-widest text-white font-bold">
                    {giftCardNumber ? formatCardNumber(giftCardNumber) : maskCardExample()}
                  </p>

                  <div className="flex justify-between items-end pt-1 text-left">
                    <div>
                      <span className="text-[11px] text-amber-300/60 uppercase block font-sans">
                        {t.giftCardHolder}
                      </span>
                      <span className="text-xs sm:text-sm font-sans font-semibold text-amber-100 uppercase">
                        {giftCardOwner || (isPreview ? 'Jasur & Madina' : '')}
                      </span>
                    </div>

                    {giftCardNumber && (
                      <button
                        type="button"
                        onClick={() => copyCard(giftCardNumber.replace(/\s+/g, ''))}
                        className="p-2 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 active:scale-95 transition-all cursor-pointer shadow-md"
                        title={t.copyCardNumber}
                        aria-label={t.copyCardNumber}
                      >
                        {cardCopied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {cardCopied && (
                  <p className="text-xs font-sans text-emerald-700 font-bold">
                    {t.cardNumberCopied}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ------------------------------------------------------ */}
          {/* SECTION: RSVP & CLOSING DARK CARD */}
          {/* ------------------------------------------------------ */}
          {isSectionVisible('rsvp') && (
            <section className="pt-4 pb-4">
              <div className="p-7 rounded-3xl bg-[#0B0F17] border border-amber-500/30 text-center text-amber-100 shadow-2xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500"></div>

                <h2 className="text-3xl sm:text-4xl font-serif text-amber-300">
                  {brideName} & {groomName}
                </h2>

                <p className="text-xs sm:text-sm font-serif italic text-amber-200/80">
                  {t.weAreWaiting}
                </p>

                {formattedDate.full && (
                  <p className="text-xs font-sans tracking-widest text-amber-400/80 uppercase">
                    {formattedDate.full}
                  </p>
                )}

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowRsvpModal(true)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {t.openRsvpButton}
                  </button>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* LIGHTBOX MODAL FOR GALLERY PHOTOS (Accessible with Esc) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeModalPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveModalPhoto(null)}
          >
            <button 
              type="button"
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              onClick={() => setActiveModalPhoto(null)}
              aria-label={t.closeModal}
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={activeModalPhoto} 
              alt={t.photoAlt}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* RSVP FORM MODAL (Shows success ONLY when rsvpState.isSuccess) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showRsvpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 text-stone-900 shadow-2xl border border-amber-200 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                type="button"
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer transition-colors"
                aria-label={t.closeModal}
              >
                <X className="w-5 h-5" />
              </button>

              {/* SUCCESS STATE - Shown ONLY when isSuccess is true */}
              {isSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">
                    {t.rsvpSuccessTitle}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-stone-600">
                    {!rsvpState && isPreview ? t.rsvpPreviewNote : t.rsvpSuccessDesc}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowRsvpModal(false)}
                    className="mt-3 px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-sans font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    {t.closeModal}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-3.5">
                  <div className="text-center space-y-0.5">
                    <span className="text-[11px] font-sans tracking-[0.2em] text-amber-800/80 uppercase font-semibold">
                      {t.rsvpBadge}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-stone-900">
                      {t.rsvpTitle}
                    </h3>
                  </div>

                  {effectiveRsvpError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
                      {effectiveRsvpError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label 
                      htmlFor="malika-guest-name" 
                      className="text-xs font-sans font-semibold text-stone-700"
                    >
                      {t.guestNameLabel}
                    </label>
                    <input
                      id="malika-guest-name"
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder={t.guestNamePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-sans font-semibold text-stone-700 block">
                      {t.attendingQuestion}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAttending(true)}
                        className={`py-2.5 rounded-xl font-sans text-xs font-bold border transition-all cursor-pointer ${
                          isAttending === true
                            ? 'bg-amber-500 border-amber-500 text-stone-950 shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {t.attendingYes}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsAttending(false)}
                        className={`py-2.5 rounded-xl font-sans text-xs font-bold border transition-all cursor-pointer ${
                          isAttending === false
                            ? 'bg-stone-800 border-stone-800 text-white shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {t.attendingNo}
                      </button>
                    </div>
                  </div>

                  {isAttending === true && (
                    <div className="space-y-1">
                      <label 
                        htmlFor="malika-guest-count" 
                        className="text-xs font-sans font-semibold text-stone-700"
                      >
                        {t.guestCountLabel}
                      </label>
                      <select
                        id="malika-guest-count"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans bg-white"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label 
                      htmlFor="malika-guest-wishes" 
                      className="text-xs font-sans font-semibold text-stone-700"
                    >
                      {t.wishesLabel}
                    </label>
                    <textarea
                      id="malika-guest-wishes"
                      rows={2}
                      value={guestWishes}
                      onChange={(e) => setGuestWishes(e.target.value)}
                      placeholder={t.wishesPlaceholder}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <PrivacyConsentCheckbox lang={currentLang} />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-amber-500 text-stone-950 font-sans font-bold text-xs uppercase tracking-wider hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.submittingRsvp}</span>
                      </>
                    ) : (
                      <span>{t.submitRsvp}</span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
