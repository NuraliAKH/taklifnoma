import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  VolumeX,
  Volume2,
  Send,
  Copy,
  Check,
  Gift,
  Navigation,
  X,
  Globe,
  SlidersHorizontal,
  Eye,
  MapPin,
  User,
  Users,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquareHeart,
  ArrowDown,
  CalendarPlus,
  Download,
} from 'lucide-react';
import type { WebsiteTemplateProps } from './types';
import { useCountdownTimer, parseEventDateTime } from '../../utils/timer';
import { PrivacyConsentCheckbox } from '../../components/PrivacyConsentCheckbox';
import {
  getMediaUrl,
  createSectionVisibility,
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
  type CalendarEvent,
} from './shared';

// ==========================================
// Color Palettes & CSS Variables System
// 8 Muted, Dusty Botanical Stationery Variants
// ==========================================
export interface EnvelopePalette {
  name: string;
  themeClass: string;
  paper: string;      // --env-paper (card & section paper background)
  flap: string;       // --env-flap (outer envelope flap)
  pocket: string;     // --env-pocket (front pocket)
  ink: string;        // --env-ink (primary text & headings)
  accent: string;     // --env-accent (warm gold metallic detail)
  seal: string;       // --env-seal (organic wax seal tone)
  lining: string;     // --env-lining (inner flap patterned lining)
  canvas: string;     // --env-canvas (page backdrop)
  muted: string;      // --env-muted (secondary text)
  border: string;     // --env-border (delicate hairline dividers)
  cardBg: string;     // --env-card-bg (soft container background)
  petalColor: string; // slow gentle falling petals
}

export const ENVELOPE_PALETTES: Record<string, EnvelopePalette> = {
  default: {
    name: 'Dusty Lavender (ID 8)',
    themeClass: 'taklifet-theme-default',
    paper: '#F6F1F7',
    flap: '#C2B2D1',
    pocket: '#B9A7C9',
    ink: '#4A3A57',
    accent: '#C6A15B',
    seal: '#B8934E',
    lining: '#EFE9F3',
    canvas: '#FAF7FB',
    muted: '#756485',
    border: 'rgba(185, 167, 201, 0.45)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    petalColor: 'rgba(185, 167, 201, 0.6)',
  },
  'pink-envelope': {
    name: 'Dusty Rose & Blush (ID 13)',
    themeClass: 'taklifet-theme-pink-envelope',
    paper: '#FCF6F7',
    flap: '#DEAFB8',
    pocket: '#D49FA9',
    ink: '#5C313B',
    accent: '#C99765',
    seal: '#B85D72',
    lining: '#F7E8EB',
    canvas: '#FFF9FA',
    muted: '#8A5C67',
    border: 'rgba(212, 159, 169, 0.45)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    petalColor: 'rgba(212, 159, 169, 0.6)',
  },
  'emerald-envelope': {
    name: 'Muted Emerald & Gold (ID 14)',
    themeClass: 'taklifet-theme-emerald-envelope',
    paper: '#F5F8F6',
    flap: '#4F6F63',
    pocket: '#466358',
    ink: '#233830',
    accent: '#C6A15B',
    seal: '#A8823E',
    lining: '#EBF0ED',
    canvas: '#FAFBF9',
    muted: '#526E64',
    border: 'rgba(70, 99, 88, 0.35)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    petalColor: 'rgba(164, 185, 175, 0.6)',
  },
  'champagne-envelope': {
    name: 'Champagne Nude (ID 15)',
    themeClass: 'taklifet-theme-champagne-envelope',
    paper: '#FAF7F2',
    flap: '#D9CCA7',
    pocket: '#D1C2A5',
    ink: '#4F4335',
    accent: '#BF9056',
    seal: '#AC793D',
    lining: '#F7F2EA',
    canvas: '#FCFAF6',
    muted: '#7D6F5D',
    border: 'rgba(209, 194, 165, 0.45)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    petalColor: 'rgba(209, 194, 165, 0.6)',
  },
  'dusty-rose-envelope': {
    name: 'Dusty Rose & Peach (ID 16)',
    themeClass: 'taklifet-theme-dusty-rose-envelope',
    paper: '#FDF7F5',
    flap: '#D4ABA0',
    pocket: '#CCA094',
    ink: '#573730',
    accent: '#C8935D',
    seal: '#B86D58',
    lining: '#F8EDE9',
    canvas: '#FFFAF8',
    muted: '#885E55',
    border: 'rgba(204, 160, 148, 0.45)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    petalColor: 'rgba(204, 160, 148, 0.6)',
  },
  'dusty-blue-envelope': {
    name: 'Dusty Blue & Slate (ID 17)',
    themeClass: 'taklifet-theme-dusty-blue-envelope',
    paper: '#F5F8FA',
    flap: '#A6BAC9',
    pocket: '#9BB0C1',
    ink: '#334351',
    accent: '#BFA16F',
    seal: '#546E82',
    lining: '#EDF3F7',
    canvas: '#FAFCFD',
    muted: '#607383',
    border: 'rgba(155, 176, 193, 0.45)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    petalColor: 'rgba(155, 176, 193, 0.6)',
  },
  'navy-envelope': {
    name: 'Midnight Navy & Gold (ID 18)',
    themeClass: 'taklifet-theme-navy-envelope',
    paper: '#F4F7FA',
    flap: '#364A5F',
    pocket: '#2D3E50',
    ink: '#1B2735',
    accent: '#CBB279',
    seal: '#BFA467',
    lining: '#E6ECF2',
    canvas: '#F8FAFC',
    muted: '#495E74',
    border: 'rgba(45, 62, 80, 0.35)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    petalColor: 'rgba(140, 160, 185, 0.6)',
  },
  'burgundy-envelope': {
    name: 'Burgundy & Wine (ID 19)',
    themeClass: 'taklifet-theme-burgundy-envelope',
    paper: '#FAF4F5',
    flap: '#733C47',
    pocket: '#66333D',
    ink: '#3F1B22',
    accent: '#C6A15B',
    seal: '#9B3344',
    lining: '#F6EAEC',
    canvas: '#FCF8F9',
    muted: '#72404A',
    border: 'rgba(102, 51, 61, 0.35)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    petalColor: 'rgba(180, 120, 130, 0.6)',
  },
};

// ==========================================
// Botanical SVG Components
// ==========================================
const BotanicalBranch: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-10',
  color = 'currentColor',
}) => (
  <svg
    viewBox="0 0 40 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Central Stem */}
    <path
      d="M 20 68 C 19 50 20 30 22 4"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Lower Leaves */}
    <path
      d="M 20 48 C 14 46 10 40 12 34 C 15 38 18 43 20 45"
      fill={color}
      fillOpacity="0.25"
      stroke={color}
      strokeWidth="0.9"
    />
    <path
      d="M 21 40 C 27 38 31 32 29 26 C 26 30 23 35 21 37"
      fill={color}
      fillOpacity="0.25"
      stroke={color}
      strokeWidth="0.9"
    />
    {/* Florets */}
    <ellipse
      cx="17"
      cy="24"
      rx="2.8"
      ry="4.5"
      transform="rotate(-25 17 24)"
      fill={color}
      fillOpacity="0.4"
      stroke={color}
      strokeWidth="0.8"
    />
    <ellipse
      cx="25"
      cy="20"
      rx="2.8"
      ry="4.5"
      transform="rotate(25 25 20)"
      fill={color}
      fillOpacity="0.4"
      stroke={color}
      strokeWidth="0.8"
    />
    <ellipse
      cx="18"
      cy="14"
      rx="2.5"
      ry="4"
      transform="rotate(-20 18 14)"
      fill={color}
      fillOpacity="0.4"
      stroke={color}
      strokeWidth="0.8"
    />
    <ellipse
      cx="24"
      cy="11"
      rx="2.5"
      ry="4"
      transform="rotate(20 24 11)"
      fill={color}
      fillOpacity="0.4"
      stroke={color}
      strokeWidth="0.8"
    />
    <ellipse
      cx="21"
      cy="5"
      rx="2.2"
      ry="3.5"
      fill={color}
      fillOpacity="0.5"
      stroke={color}
      strokeWidth="0.8"
    />
  </svg>
);

const FloralOrnamentDivider: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-48 h-6',
  color = 'currentColor',
}) => (
  <svg
    viewBox="0 0 240 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Left Hairline */}
    <line
      x1="10"
      y1="15"
      x2="85"
      y2="15"
      stroke={color}
      strokeWidth="0.75"
      strokeOpacity="0.4"
    />
    <circle cx="85" cy="15" r="1.5" fill={color} fillOpacity="0.6" />
    {/* Left Botanical Branch */}
    <path
      d="M 90 15 C 98 12 104 9 110 15"
      stroke={color}
      strokeWidth="0.9"
      strokeLinecap="round"
    />
    <path
      d="M 97 13 C 95 9 98 6 102 8 C 101 11 99 12 97 13 Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="0.6"
    />
    {/* Central Bloom */}
    <ellipse
      cx="120"
      cy="15"
      rx="3.5"
      ry="5.5"
      fill={color}
      fillOpacity="0.45"
      stroke={color}
      strokeWidth="0.9"
    />
    <circle cx="120" cy="15" r="1.2" fill={color} />
    {/* Right Botanical Branch */}
    <path
      d="M 150 15 C 142 12 136 9 130 15"
      stroke={color}
      strokeWidth="0.9"
      strokeLinecap="round"
    />
    <path
      d="M 143 13 C 145 9 142 6 138 8 C 139 11 141 12 143 13 Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="0.6"
    />
    {/* Right Hairline */}
    <circle cx="155" cy="15" r="1.5" fill={color} fillOpacity="0.6" />
    <line
      x1="155"
      y1="15"
      x2="230"
      y2="15"
      stroke={color}
      strokeWidth="0.75"
      strokeOpacity="0.4"
    />
  </svg>
);

// ==========================================
// Organic Melted Wax Seal (SVG Path)
// Monogram without heart (Initials: G · B)
// ==========================================
const OrganicWaxSeal: React.FC<{
  groomInit: string;
  brideInit: string;
  sealColor: string;
  accentColor: string;
  paperColor: string;
}> = ({ groomInit, brideInit, sealColor, accentColor, paperColor }) => (
  <svg
    viewBox="0 0 80 80"
    className="w-16 h-16 select-none"
    style={{
      filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.22))',
    }}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="waxPerimeterGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor={accentColor} stopOpacity="0.75" />
        <stop offset="45%" stopColor={sealColor} />
        <stop offset="100%" stopColor="color-mix(in srgb, var(--env-seal) 68%, #000)" />
      </radialGradient>
      <radialGradient id="waxInnerWell" cx="38%" cy="38%" r="60%">
        <stop offset="0%" stopColor="color-mix(in srgb, var(--env-seal) 85%, #fff)" />
        <stop offset="65%" stopColor={sealColor} />
        <stop offset="100%" stopColor="color-mix(in srgb, var(--env-seal) 60%, #000)" />
      </radialGradient>
      <filter id="waxStampShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="-1" dy="-1" stdDeviation="0.8" floodColor="#ffffff" floodOpacity="0.3" />
        <feDropShadow dx="1.5" dy="1.5" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Irregular organic wax perimeter path */}
    <path
      d="M 40 4
         C 47 4, 53 7, 59 11
         C 65 15, 71 18, 73 25
         C 75 32, 73 37, 75 43
         C 77 49, 75 56, 70 62
         C 65 68, 59 71, 52 74
         C 45 77, 38 75, 31 74
         C 24 73, 17 71, 12 64
         C 7 57, 6 50, 5 43
         C 4 36, 6 30, 9 24
         C 12 18, 17 13, 23 9
         C 29 5, 34 4, 40 4 Z"
      fill="url(#waxPerimeterGrad)"
      filter="url(#waxStampShadow)"
    />

    {/* Pressed wax inner well */}
    <circle
      cx="40"
      cy="40"
      r="23"
      fill="url(#waxInnerWell)"
      stroke="rgba(255, 255, 255, 0.2)"
      strokeWidth="1.2"
    />
    <circle
      cx="40"
      cy="40"
      r="21.5"
      fill="none"
      stroke="rgba(0, 0, 0, 0.25)"
      strokeWidth="0.8"
      strokeDasharray="2.5 1.5"
      opacity="0.5"
    />

    {/* Monogram initials without heart */}
    <text
      x="40"
      y="44.5"
      textAnchor="middle"
      fill={paperColor}
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '0.14em',
        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.45))',
      }}
    >
      {`${groomInit} · ${brideInit}`}
    </text>
  </svg>
);

// ==========================================
// Falling Petal Particle System
// ≤ 10 petals, slow & gentle, only 6s after open
// ==========================================
const PetalParticleSystem: React.FC<{
  active: boolean;
  color: string;
  isPreview?: boolean;
}> = ({ active, color, isPreview }) => {
  const calm = useCalmMotion(isPreview);
  if (calm || !active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20 select-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`petal-${i}`}
          className="absolute rounded-tl-full rounded-br-full"
          style={{
            top: '-5%',
            left: `${8 + (i * 12) % 84}%`,
            width: `${11 + (i % 3) * 3}px`,
            height: `${15 + (i % 3) * 4}px`,
            backgroundColor: color,
            opacity: 0.65,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
          }}
          initial={{ y: '-5vh', x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ['0vh', '105vh'],
            x: [0, i % 2 === 0 ? 25 : -25, 0],
            rotate: [0, i % 2 === 0 ? 180 : -180],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: 6.5 + (i % 3) * 0.8,
            ease: 'easeOut',
            delay: i * 0.45,
          }}
        />
      ))}
    </div>
  );
};

// ==========================================
// Multilingual Translations (Proper Uzbek Latin)
// ==========================================
const translations = {
  uz: {
    assalomuAlaykum: 'ASSALOMU ALAYKUM',
    taklifnoma: 'Taklifnoma',
    invitationSubtitle: 'Toʻyimizga tashrif buyurishingizni soʻraymiz',
    scrollDown: 'PASTGA SURING',
    weddingTitle: 'NIKOH TOʻYI TANTANASI',
    and: '&',
    quote: 'Muhabbat — bu ikki qalbning abadiy uygʻunligi va baxtli hayot ibtidosidir...',
    galleryTitle: 'SURATLAR',
    calendarTitle: 'TOʻY SANASI',
    startTime: 'Boshlanish vaqti',
    weekdays: ['Dsh', 'Ssh', 'Chsh', 'Psh', 'Jum', 'Shb', 'Yak'],
    addToCalendar: 'Taqvimga qoʻshish',
    googleCalendar: 'Google Taqvim',
    downloadIcs: 'ICS fayli',
    countdownTitle: 'TOʻYGA QADAR',
    countdownSub: 'Sizni koʻrishni sabrsizlik bilan kutamiz',
    days: 'KUN',
    hours: 'SOAT',
    minutes: 'DAQIQA',
    seconds: 'SONIYA',
    scheduleTitle: 'KUN TARTIBI',
    scheduleHeader: 'Toʻy dasturi',
    venueHeader: 'TANTANALI MAROSIM',
    venueTitle: 'Navroʻz saroyi',
    openMap: 'Xaritada koʻrish',
    copyAddress: 'Manzilni nusxalash',
    wishHeader: 'SAMIMIY TILAK',
    wishFrom: 'Hurmat bilan:',
    defaultWishText:
      'Gulday ochilgan bu baxt kunida siz bilan birga boʻlishni istardik. Kelishingizni intizorlik bilan kutamiz.',
    defaultWishFrom: 'Shomurodovlar oilasi',
    wishesTitle: 'Tilaklar',
    leaveWish: 'TILAK BILDIRISH',
    willYouAttend: 'TASHRIFINGIZNI TASDIQLAYSIZMI?',
    yes: 'Albatta boraman',
    no: 'Afsuski, borolmayman',
    nameLabel: 'Ismingiz va familiyangiz',
    namePlaceholder: 'Ismingizni kiriting',
    guestsLabel: 'Mehmonlar soni',
    guestCountUnit: 'kishi',
    submitRsvp: 'Javobni yuborish',
    rsvpSuccess: 'TASHRIFINGIZDAN MAMNUNMIZ!',
    rsvpSuccessSub: 'Javobingiz muvaffaqiyatli qabul qilindi. Rahmat!',
    tapTheSeal: 'MUHRNI BOSING',
    exclusivelyForYou: 'Siz uchun maxsus taklifnoma',
    footerText: 'Bunday taklifnomani siz ham buyurtma bering',
    writeWish: 'Samimiy tilagingizni yozing',
    sendWish: 'Tilakni yuborish',
    wishPlaceholder: 'Kelin va kuyovga samimiy niyatlaringiz...',
    wishSentSuccess: 'Rahmat! Tilagingiz yetkazildi.',
    giftSectionTitle: 'SOVGʻALAR VA TILAKLAR',
    giftCardHeading: 'Pul koʻrinishidagi sovgʻa',
    giftCardSub:
      'Sizning tashrifingiz biz uchun eng qimmatli sovgʻadir! Agar pul koʻrinishida tabriklamoqchi boʻlsangiz:',
    copyCardNumber: 'Karta raqamini nusxalash',
    copied: 'Nusxalandi!',
    cardExampleLabel: 'Namuna karta',
    prevSlide: 'Oldingi surat',
    nextSlide: 'Keyingi surat',
    closeModal: 'Yopish',
    manageSections: 'Sektsiyalarni boshqarish',
    switchLanguage: 'Tilni oʻzgartirish',
    playMusic: 'Musiqani yoqish',
    pauseMusic: 'Musiqani toʻxtatish',
  },
  ru: {
    assalomuAlaykum: 'ДОБРО ПОЖАЛОВАТЬ',
    taklifnoma: 'Приглашение',
    invitationSubtitle: 'Приглашаем вас разделить с нами радость торжества',
    scrollDown: 'ЛИСТАЙТЕ ВНИЗ',
    weddingTitle: 'СВАДЕБНОЕ ТОРЖЕСТВО',
    and: '&',
    quote: 'Любовь — это гармония двух сердец, соединившихся навсегда...',
    galleryTitle: 'ГАЛЕРЕЯ',
    calendarTitle: 'ДАТА СВАДЬБЫ',
    startTime: 'Время начала',
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    addToCalendar: 'Добавить в календарь',
    googleCalendar: 'Google Календарь',
    downloadIcs: 'Файл .ics',
    countdownTitle: 'ДО СВАДЬБЫ',
    countdownSub: 'С нетерпением ждём нашей встречи',
    days: 'ДНЕЙ',
    hours: 'ЧАСОВ',
    minutes: 'МИНУТ',
    seconds: 'СЕКУНД',
    scheduleTitle: 'ПРОГРАММА ВЕЧЕРА',
    scheduleHeader: 'Праздничный распорядок',
    venueHeader: 'ТОРЖЕСТВЕННЫЙ ЗАЛ',
    venueTitle: 'Ресторан Navroʻz',
    openMap: 'Посмотреть на карте',
    copyAddress: 'Скопировать адрес',
    wishHeader: 'ПОЖЕЛАНИЕ',
    wishFrom: 'С уважением:',
    defaultWishText:
      'В этот счастливый день мы будем рады видеть вас рядом с нами. С нетерпением ждём встречи на нашем празднике!',
    defaultWishFrom: 'Семья жениха и невесты',
    wishesTitle: 'Пожелания',
    leaveWish: 'ОСТАВИТЬ ПОЖЕЛАНИЕ',
    willYouAttend: 'ВЫ ПРИДЁТЕ НА НАШ ПРАЗДНИК?',
    yes: 'Да, обязательно приду',
    no: 'К сожалению, не смогу',
    nameLabel: 'Ваше имя и фамилия',
    namePlaceholder: 'Введите ваше имя',
    guestsLabel: 'Количество гостей',
    guestCountUnit: 'чел.',
    submitRsvp: 'Подтвердить присутствие',
    rsvpSuccess: 'СПАСИБО ЗА ВАШ ОТВЕТ!',
    rsvpSuccessSub: 'Ваше подтверждение успешно принято!',
    tapTheSeal: 'НАЖМИТЕ НА ПЕЧАТЬ',
    exclusivelyForYou: 'Это приглашение создано специально для вас',
    footerText: 'Создайте такое же красивое приглашение',
    writeWish: 'Напишите ваши тёплые слова',
    sendWish: 'Отправить пожелание',
    wishPlaceholder: 'Ваши добрые пожелания молодожёнам...',
    wishSentSuccess: 'Спасибо! Ваше пожелание отправлено.',
    giftSectionTitle: 'ПОДАРКИ И ПОЖЕЛАНИЯ',
    giftCardHeading: 'Денежный подарок',
    giftCardSub:
      'Ваше присутствие — лучший подарок для нас! Если вы хотите сделать подарок в виде денежного перевода:',
    copyCardNumber: 'Скопировать номер карты',
    copied: 'Скопировано!',
    cardExampleLabel: 'Пример карты',
    prevSlide: 'Предыдущее фото',
    nextSlide: 'Следующее фото',
    closeModal: 'Закрыть',
    manageSections: 'Управление секциями',
    switchLanguage: 'Сменить язык',
    playMusic: 'Включить музыку',
    pauseMusic: 'Приостановить музыку',
  },
  en: {
    assalomuAlaykum: 'WELCOME',
    taklifnoma: 'Invitation',
    invitationSubtitle: 'We cordially invite you to celebrate our special day',
    scrollDown: 'SCROLL DOWN',
    weddingTitle: 'WEDDING CELEBRATION',
    and: '&',
    quote: 'Love is the harmony of two souls joining together forever...',
    galleryTitle: 'GALLERY',
    calendarTitle: 'WEDDING DATE',
    startTime: 'Start Time',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    addToCalendar: 'Add to Calendar',
    googleCalendar: 'Google Calendar',
    downloadIcs: '.ics File',
    countdownTitle: 'COUNTDOWN',
    countdownSub: 'We look forward to celebrating with you',
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    seconds: 'SECONDS',
    scheduleTitle: 'TIMELINE',
    scheduleHeader: 'Order of Events',
    venueHeader: 'CELEBRATION VENUE',
    venueTitle: 'Navroʻz Palace',
    openMap: 'View on map',
    copyAddress: 'Copy address',
    wishHeader: 'WARM WISHES',
    wishFrom: 'Warm regards:',
    defaultWishText:
      'On this joyous day, we would be delighted to have you celebrate with us. We warmly look forward to welcoming you!',
    defaultWishFrom: 'The Wedding Family',
    wishesTitle: 'Wishes',
    leaveWish: 'LEAVE A WISH',
    willYouAttend: 'WILL YOU ATTEND OUR WEDDING?',
    yes: 'Yes, I will attend',
    no: 'Regretfully decline',
    nameLabel: 'Your Full Name',
    namePlaceholder: 'Enter your name',
    guestsLabel: 'Number of Guests',
    guestCountUnit: 'guest(s)',
    submitRsvp: 'Submit RSVP',
    rsvpSuccess: 'THANK YOU FOR YOUR RSVP!',
    rsvpSuccessSub: 'Your response has been saved successfully!',
    tapTheSeal: 'TAP THE SEAL',
    exclusivelyForYou: 'This invitation is exclusively for you',
    footerText: 'Create a beautiful invitation like this',
    writeWish: 'Write your warm wishes',
    sendWish: 'Send Wish',
    wishPlaceholder: 'Share your warm blessings with the couple...',
    wishSentSuccess: 'Thank you! Your wish has been sent.',
    giftSectionTitle: 'GIFTS & BLESSINGS',
    giftCardHeading: 'Monetary Gift',
    giftCardSub:
      'Your presence is the greatest gift of all! If you wish to honor us with a monetary gift:',
    copyCardNumber: 'Copy card number',
    copied: 'Copied!',
    cardExampleLabel: 'Card example',
    prevSlide: 'Previous photo',
    nextSlide: 'Next photo',
    closeModal: 'Close',
    manageSections: 'Manage sections',
    switchLanguage: 'Switch language',
    playMusic: 'Play music',
    pauseMusic: 'Pause music',
  },
};

// ==========================================
// Main Taklifet Pink Site Component
// ==========================================
export const TaklifetPinkSite: React.FC<WebsiteTemplateProps> = ({
  data,
  lang = 'uz',
  isOpened: externalIsOpened = false,
  onOpenEnvelope,
  isPlaying = false,
  onToggleAudio,
  timeLeft,
  rsvpState,
  isPreview = false,
  isCatalogPreview = false,
  visualVariant = 'default',
  onToggleSection,
  onLanguageChange,
}) => {
  // 1. Color Palette Configuration
  const palette = useMemo(() => {
    return ENVELOPE_PALETTES[visualVariant] || ENVELOPE_PALETTES.default;
  }, [visualVariant]);

  // 2. Language & Localized Strings
  const [currentLang, setCurrentLang] = useState<'uz' | 'ru' | 'en'>(lang || 'uz');
  useEffect(() => {
    if (lang && (lang === 'uz' || lang === 'ru' || lang === 'en')) {
      setCurrentLang(lang);
    }
  }, [lang]);

  const t = translations[currentLang] || translations.uz;
  const demoContent = useMemo(() => getDemoContent(currentLang), [currentLang]);

  // 3. Opening Animation State
  const [internalOpened, setInternalOpened] = useState(externalIsOpened);
  const [isOpening, setIsOpening] = useState(false);
  const [petalsActive, setPetalsActive] = useState(false);

  useEffect(() => {
    setInternalOpened(externalIsOpened);
    if (!externalIsOpened) {
      setIsOpening(false);
      setPetalsActive(false);
    } else {
      setPetalsActive(true);
      const timer = window.setTimeout(() => setPetalsActive(false), 6000);
      return () => window.clearTimeout(timer);
    }
  }, [externalIsOpened]);

  const isOpened = externalIsOpened || internalOpened;

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    setTimeout(() => {
      setInternalOpened(true);
      setPetalsActive(true);
      if (onOpenEnvelope) onOpenEnvelope();
      // Petals stop automatically after 6 seconds
      setTimeout(() => {
        setPetalsActive(false);
      }, 6000);
    }, 1500);
  };

  // 4. Section Visibility Management
  const [hiddenSections, setHiddenSections] = useState<string[]>(data.hiddenSections || []);
  useEffect(() => {
    if (data.hiddenSections) {
      setHiddenSections(data.hiddenSections);
    }
  }, [data.hiddenSections]);

  const [showSectionManager, setShowSectionManager] = useState(false);
  const isSectionVisible = useMemo(
    () => createSectionVisibility(hiddenSections),
    [hiddenSections]
  );

  const toggleSection = (id: string) => {
    if (onToggleSection) {
      onToggleSection(id);
    } else {
      setHiddenSections((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      );
    }
  };

  // 5. Data & Typography
  const groomName = data.groomName || (isPreview ? demoContent.groomName : 'Jasur');
  const brideName = data.brideName || (isPreview ? demoContent.brideName : 'Madina');
  const groomInit = groomName.trim().charAt(0).toUpperCase();
  const brideInit = brideName.trim().charAt(0).toUpperCase();

  const dateStr = data.date || '2026-09-18';
  const timeStr = data.time || '18:00';
  const formattedDate = useMemo(() => formatEventDate(dateStr, currentLang), [dateStr, currentLang]);

  const venueName = data.venue || (isPreview ? demoContent.venue : 'Navroʻz saroyi');
  const venueAddress = data.address || (isPreview ? demoContent.address : 'Toshkent sh., Alisher Navoiy koʻchasi, 15-uy');

  // Wish section data
  const wishText = data.wishText?.trim() || t.defaultWishText;
  const wishFrom = data.wishFrom?.trim() || (isPreview ? t.defaultWishFrom : '');

  // Gift card data
  const rawGiftCard = data.giftCardNumber?.trim();
  const showGiftSection = Boolean(rawGiftCard || isPreview);
  const displayCardNumber = rawGiftCard ? formatCardNumber(rawGiftCard) : maskCardExample();
  const giftCardOwner =
    data.giftCardOwner ||
    (isPreview ? (currentLang === 'uz' ? 'Kelin-kuyov hisobiga' : 'На имя молодожёнов') : '');

  // 6. Gallery & Touch-Swipe Carousel
  const galleryMedia = useMemo(() => {
    if (data.photos && data.photos.length > 0) {
      return data.photos.map((p) => getMediaUrl(p));
    }
    if (isPreview) {
      return [
        '/olive-editorial-hero.webp',
        '/olive-editorial-venue.webp',
        '/olive-editorial-details.webp',
      ];
    }
    return [];
  }, [data.photos, isPreview]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeModalMedia, setActiveModalMedia] = useState<string | null>(null);

  const handleCarouselDragEnd = (
    _: any,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (galleryMedia.length <= 1) return;
    const swipeConfidenceThreshold = 45;
    const velocityThreshold = 350;
    if (info.offset.x < -swipeConfidenceThreshold || info.velocity.x < -velocityThreshold) {
      setCurrentSlide((prev) => (prev === galleryMedia.length - 1 ? 0 : prev + 1));
    } else if (info.offset.x > swipeConfidenceThreshold || info.velocity.x > velocityThreshold) {
      setCurrentSlide((prev) => (prev === 0 ? galleryMedia.length - 1 : prev - 1));
    }
  };

  // 7. Clipboard Utilities
  const { copied: addressCopied, copy: copyAddress } = useCopyToClipboard();
  const { copied: cardCopied, copy: copyCard } = useCopyToClipboard();

  // 8. Countdown Timer
  const calculatedTimeLeft = useCountdownTimer(data.date, data.time, timeLeft);

  // 9. Calendar Day Highlighting Setup
  const parsedEventDate = useMemo(() => parseEventDateTime(dateStr, timeStr), [dateStr, timeStr]);
  const targetYear = parsedEventDate ? parsedEventDate.getFullYear() : 2026;
  const targetMonth = parsedEventDate ? parsedEventDate.getMonth() : 8; // 0-indexed
  const targetDay = parsedEventDate ? parsedEventDate.getDate() : 18;

  const calendarDays = useMemo(() => {
    const totalDays = new Date(targetYear, targetMonth + 1, 0).getDate();
    const firstDayIndex = new Date(targetYear, targetMonth, 1).getDay();
    const startPadding = (firstDayIndex + 6) % 7; // Monday-start padding

    const days: (number | null)[] = [];
    for (let i = 0; i < startPadding; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    return days;
  }, [targetYear, targetMonth]);

  const calendarEvent: CalendarEvent = useMemo(() => {
    const start = parsedEventDate || new Date('2026-09-18T18:00:00');
    return {
      title: `${groomName} & ${brideName} — ${t.weddingTitle}`,
      start,
      location: `${venueName}, ${venueAddress}`,
      description: t.invitationSubtitle,
    };
  }, [groomName, brideName, venueName, venueAddress, parsedEventDate, t]);

  // 10. Schedule Items
  const scheduleItems = useMemo(() => {
    if (Array.isArray(data.schedule) && data.schedule.length > 0) return data.schedule;
    if (Array.isArray(data.scheduleItems) && data.scheduleItems.length > 0) return data.scheduleItems;
    if (isPreview) {
      return [
        { time: '17:00', title: currentLang === 'uz' ? 'Mehmonlar tashrifi' : currentLang === 'en' ? 'Welcome & Gathering' : 'Сбор гостей', desc: currentLang === 'uz' ? 'Jonli musiqa va kutib olish' : 'Живая музыка и фотозона' },
        { time: '18:00', title: currentLang === 'uz' ? 'Nikoh tantanasi' : currentLang === 'en' ? 'Wedding Ceremony' : 'Торжественная церемония', desc: currentLang === 'uz' ? 'Kelin va kuyovning kirib kelishi' : 'Официальная регистрация' },
        { time: '19:00', title: currentLang === 'uz' ? 'Toʻy oqshomi' : currentLang === 'en' ? 'Gala Dinner' : 'Свадебный банкет', desc: currentLang === 'uz' ? 'Raqslar va tabriklar' : 'Танцы и поздравления' },
        { time: '21:30', title: currentLang === 'uz' ? 'Toʻy torti' : currentLang === 'en' ? 'Cake Cutting' : 'Свадебный торт', desc: currentLang === 'uz' ? 'Oqshom yakuni' : 'Финал вечера' },
      ];
    }
    return [];
  }, [data.schedule, data.scheduleItems, isPreview, currentLang]);

  // 11. RSVP Form State
  const [rsvpName, setRsvpName] = useState(rsvpState?.name || '');
  const [rsvpGuests, setRsvpGuests] = useState(rsvpState?.guestCount || 1);
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(rsvpState?.attending ?? null);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const updateRsvpName = (val: string) => {
    setRsvpName(val);
    rsvpState?.setName(val);
  };

  const updateRsvpAttending = (val: boolean) => {
    setRsvpAttending(val);
    rsvpState?.setAttending(val);
  };

  const updateRsvpGuests = (val: number) => {
    setRsvpGuests(val);
    rsvpState?.setGuestCount(val);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpState?.onSubmit) {
      rsvpState.onSubmit(e);
    } else {
      setRsvpSubmitted(true);
    }
  };

  // 12. Leave A Wish Modal State
  const [showWishModal, setShowWishModal] = useState(false);
  const [userWishText, setUserWishText] = useState('');
  const [userWishSent, setUserWishSent] = useState(false);

  // Esc key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalMedia(null);
        setShowWishModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`relative min-h-screen font-serif text-[var(--env-ink)] selection:bg-[var(--env-accent)] selection:text-white overflow-x-hidden ${palette.themeClass}`}
      style={
        {
          '--env-paper': palette.paper,
          '--env-flap': palette.flap,
          '--env-pocket': palette.pocket,
          '--env-ink': palette.ink,
          '--env-accent': palette.accent,
          '--env-seal': palette.seal,
          '--env-lining': palette.lining,
          '--env-canvas': palette.canvas,
          '--env-muted': palette.muted,
          '--env-border': palette.border,
          '--env-card-bg': palette.cardBg,
          backgroundColor: 'var(--env-canvas)',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        } as React.CSSProperties
      }
    >
      {/* Invisible SVG Definition for Paper Grain & Floral Lining */}
      <svg className="sr-only" aria-hidden="true">
        <defs>
          <filter id="taklifet-paper-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"
            />
          </filter>
          <pattern
            id="taklifet-floral-lining"
            width="46"
            height="46"
            patternUnits="userSpaceOnUse"
          >
            <g
              fill="none"
              stroke="var(--env-accent)"
              strokeWidth="0.8"
              strokeOpacity="0.45"
            >
              <path d="M 12 34 C 14 24 20 18 28 14" strokeLinecap="round" />
              <path
                d="M 28 14 C 30 11 33 12 32 15 C 31 17 28 17 28 14 Z"
                fill="var(--env-accent)"
                fillOpacity="0.3"
              />
              <ellipse
                cx="19"
                cy="21"
                rx="2.2"
                ry="3.8"
                transform="rotate(-28 19 21)"
                fill="var(--env-accent)"
                fillOpacity="0.25"
              />
              <circle
                cx="38"
                cy="36"
                r="1.4"
                fill="var(--env-accent)"
                fillOpacity="0.4"
              />
              <circle
                cx="8"
                cy="8"
                r="1.1"
                fill="var(--env-accent)"
                fillOpacity="0.35"
              />
            </g>
          </pattern>
        </defs>
      </svg>

      {/* Falling Botanical Petals (≤ 10, slow, only 6s after open) */}
      <PetalParticleSystem
        active={petalsActive}
        color={palette.petalColor}
        isPreview={isPreview}
      />

      {/* Floating Audio & Language Controls */}
      {!isCatalogPreview && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {/* Language selector */}
          <div className="bg-white/85 border border-[var(--env-border)] rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-[var(--env-ink)] backdrop-blur-md shadow-md font-sans">
            <Globe className="w-3.5 h-3.5 text-[var(--env-accent)]" />
            <button
              type="button"
              aria-label={t.switchLanguage}
              onClick={() => {
                const nextLang = currentLang === 'uz' ? 'ru' : currentLang === 'ru' ? 'en' : 'uz';
                setCurrentLang(nextLang);
                if (onLanguageChange) onLanguageChange(nextLang);
              }}
              className="uppercase font-semibold tracking-wider hover:text-[var(--env-accent)] transition-colors min-h-[30px] flex items-center"
            >
              {currentLang}
            </button>
          </div>

          {/* Audio Toggle */}
          {onToggleAudio && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={onToggleAudio}
              aria-label={isPlaying ? t.pauseMusic : t.playMusic}
              className="w-10 h-10 rounded-full bg-white/85 border border-[var(--env-border)] flex items-center justify-center text-[var(--env-ink)] backdrop-blur-md shadow-md hover:bg-white transition-all cursor-pointer"
            >
              {isPlaying ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                >
                  <Volume2 className="w-4 h-4 text-[var(--env-accent)]" />
                </motion.div>
              ) : (
                <VolumeX className="w-4 h-4 opacity-60" />
              )}
            </motion.button>
          )}

          {/* Preview Section Manager Button */}
          {isPreview && (
            <button
              type="button"
              aria-label={t.manageSections}
              onClick={() => setShowSectionManager(!showSectionManager)}
              className="w-10 h-10 rounded-full bg-[var(--env-ink)] text-white flex items-center justify-center shadow-lg font-sans hover:opacity-90 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Preview Section Manager Drawer */}
      {isPreview && !isCatalogPreview && showSectionManager && (
        <div className="fixed top-16 right-4 z-50 bg-white/95 border border-[var(--env-border)] rounded-2xl p-4 w-72 shadow-2xl backdrop-blur-xl text-xs font-sans text-[var(--env-ink)]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--env-border)]">
            <span className="font-bold flex items-center gap-1.5 text-[var(--env-ink)]">
              <Eye className="w-4 h-4 text-[var(--env-accent)]" /> {t.manageSections}
            </span>
            <button
              type="button"
              aria-label={t.closeModal}
              onClick={() => setShowSectionManager(false)}
              className="text-gray-400 hover:text-[var(--env-ink)] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {[
              { id: 'hero', name: '1. ' + t.taklifnoma },
              { id: 'couple', name: '2. ' + t.weddingTitle },
              { id: 'gallery', name: '3. ' + t.galleryTitle },
              { id: 'calendar', name: '4. ' + t.calendarTitle },
              { id: 'schedule', name: '5. ' + t.scheduleTitle },
              { id: 'countdown', name: '6. ' + t.countdownTitle },
              { id: 'venue', name: '7. ' + t.venueHeader },
              { id: 'wish', name: '8. ' + t.wishHeader },
              { id: 'rsvp', name: '9. RSVP' },
              { id: 'giftCard', name: '10. ' + t.giftSectionTitle },
            ].map((sec) => (
              <label
                key={sec.id}
                className="flex items-center justify-between p-2 rounded-lg bg-[var(--env-paper)] border border-[var(--env-border)] cursor-pointer hover:border-[var(--env-accent)]"
              >
                <span>{sec.name}</span>
                <input
                  type="checkbox"
                  checked={isSectionVisible(sec.id)}
                  onChange={() => toggleSection(sec.id)}
                  className="accent-[var(--env-accent)] w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. REALISTIC C6 PAPER ENVELOPE OPENING SCREEN                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={
              isOpening
                ? { opacity: [1, 1, 0], scale: [1, 1.02, 1.05] }
                : { opacity: 1, scale: 1 }
            }
            exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
            transition={{ duration: 1.25, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 select-none overflow-hidden"
            style={{ backgroundColor: 'var(--env-canvas)' }}
          >
            {/* Soft Ambient Illumination */}
            <div
              className="absolute w-[420px] h-[420px] rounded-full pointer-events-none blur-3xl opacity-35"
              style={{
                background: `radial-gradient(circle at center, var(--env-accent) 0%, transparent 70%)`,
              }}
            />

            {/* C6 Envelope Construction (~1.42:1 aspect ratio, rounded 8px) */}
            <div
              className="relative w-full max-w-[336px] aspect-[1.42/1] rounded-[8px] flex items-center justify-center p-2"
              style={{
                backgroundColor: 'var(--env-pocket)',
                boxShadow:
                  '0 18px 42px -6px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Back Wall Lining (revealed behind letter as it lifts) */}
              <div
                className="absolute inset-0 rounded-[8px] overflow-hidden pointer-events-none"
                style={{ backgroundColor: 'var(--env-lining)' }}
              >
                <div
                  className="absolute inset-0 opacity-40 mix-blend-multiply"
                  style={{ backgroundImage: 'url(#taklifet-floral-lining)' }}
                >
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="url(#taklifet-floral-lining)" />
                  </svg>
                </div>
              </div>

              {/* Letter Card sliding UP out of envelope */}
              <motion.div
                initial={{ y: 0, opacity: 0.95 }}
                animate={
                  isOpening
                    ? { y: -130, scale: 1.04, opacity: 1 }
                    : { y: 0, opacity: 0.95 }
                }
                transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-2 w-[90%] h-[88%] rounded-[6px] shadow-lg p-4 text-center flex flex-col items-center justify-center z-10"
                style={{
                  backgroundColor: 'var(--env-paper)',
                  border: '1px solid var(--env-border)',
                  boxShadow:
                    'inset 0 1px 3px rgba(0,0,0,0.06), 0 8px 20px -2px rgba(0,0,0,0.14)',
                }}
              >
                {/* Botanical sprig ornament */}
                <BotanicalBranch
                  className="w-5 h-8 mb-1"
                  color="var(--env-accent)"
                />

                <span
                  className="text-xl sm:text-2xl font-serif font-bold tracking-wider"
                  style={{ color: 'var(--env-ink)' }}
                >
                  {groomName} & {brideName}
                </span>

                <p
                  className="text-xs font-sans tracking-wide mt-1.5 font-medium opacity-80"
                  style={{ color: 'var(--env-muted)' }}
                >
                  {t.exclusivelyForYou}
                </p>
              </motion.div>

              {/* Envelope Front Pocket Base (Real folded polygon) */}
              <div
                className="absolute inset-0 rounded-[8px] z-20 pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: 'var(--env-pocket)',
                  clipPath: 'polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 50%)',
                  boxShadow:
                    'inset 0 2px 4px rgba(0,0,0,0.08), inset 0 -2px 4px rgba(0,0,0,0.08)',
                }}
              >
                {/* Paper texture overlay */}
                <div
                  className="absolute inset-0 opacity-[0.06] mix-blend-multiply pointer-events-none"
                  style={{ filter: 'url(#taklifet-paper-grain)' }}
                />
              </div>

              {/* Top Triangular Flap Folding OPEN (rotateX 180deg) */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={isOpening ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-0 inset-x-0 h-[56%] z-30 origin-top"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Flap Outer Face (Paper Front) */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: 'var(--env-flap)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    backfaceVisibility: 'hidden',
                    filter: isOpening
                      ? 'drop-shadow(0 0 0 transparent)'
                      : 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.18))',
                    transition: 'filter 0.5s ease',
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.06] mix-blend-multiply pointer-events-none"
                    style={{ filter: 'url(#taklifet-paper-grain)' }}
                  />
                </div>

                {/* Flap Inner Lining (Pattern Back revealed upon 180deg flip) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    backgroundColor: 'var(--env-lining)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    transform: 'rotateX(180deg)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <svg className="w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="url(#taklifet-floral-lining)" />
                  </svg>
                </div>
              </motion.div>

              {/* Central Wax Seal Button (Irregular edge, Monogram without heart) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleOpenClick}
                  disabled={isOpening}
                  aria-label={t.tapTheSeal}
                  className="cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--env-accent)] rounded-full p-1 transition-transform"
                >
                  <OrganicWaxSeal
                    groomInit={groomInit}
                    brideInit={brideInit}
                    sealColor={palette.seal}
                    accentColor={palette.accent}
                    paperColor={palette.paper}
                  />
                </motion.button>
              </div>
            </div>

            {/* Seal Hint Text */}
            <span
              className="text-[11px] sm:text-xs font-sans font-bold tracking-[0.25em] uppercase mt-8 z-10"
              style={{ color: 'var(--env-ink)' }}
            >
              {t.tapTheSeal}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MAIN INVITATION CONTENT                                                  */}
      {/* ========================================================================= */}
      <main className="w-full max-w-md mx-auto px-4 py-8 space-y-12">
        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 1: GREETING & TAKLIFNOMA TITLE (`hero`)                         */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('hero') && (
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center pt-6 space-y-6"
          >
            {/* Top Botanical Branch Accent */}
            <div className="flex justify-center text-[var(--env-accent)]">
              <BotanicalBranch className="w-6 h-10" color="var(--env-accent)" />
            </div>

            <div className="space-y-2 px-2">
              <span
                className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold block"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.assalomuAlaykum}
              </span>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-wide break-words max-w-full overflow-hidden"
                style={{ color: 'var(--env-ink)' }}
              >
                {t.taklifnoma}
              </h1>
              <p
                className="text-sm font-sans font-normal max-w-xs mx-auto leading-relaxed"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.invitationSubtitle}
              </p>
            </div>

            {/* Scroll Down Cue */}
            <div className="pt-4 flex flex-col items-center gap-1.5">
              <span
                className="text-[11px] tracking-[0.2em] font-sans font-semibold uppercase"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.scrollDown}
              </span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-8 h-8 rounded-full bg-white/85 border border-[var(--env-border)] flex items-center justify-center text-[var(--env-ink)] shadow-sm"
              >
                <ArrowDown className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 2: GROOM & BRIDE COUPLE SHOWCASE (`couple`)                     */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('couple') && (
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-8 rounded-[10px] border border-[var(--env-border)] shadow-xl text-center space-y-4 backdrop-blur-sm"
            style={{
              backgroundColor: 'var(--env-card-bg)',
              boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.06)',
            }}
          >
            <span
              className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold"
              style={{ color: 'var(--env-muted)' }}
            >
              {t.weddingTitle}
            </span>

            <div className="space-y-2 py-2">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold"
                style={{ color: 'var(--env-ink)' }}
              >
                {groomName}
              </h2>
              <div
                className="text-2xl font-serif italic my-1"
                style={{ color: 'var(--env-accent)' }}
              >
                {t.and}
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold"
                style={{ color: 'var(--env-ink)' }}
              >
                {brideName}
              </h2>
            </div>

            <FloralOrnamentDivider
              className="w-44 h-5 mx-auto my-3"
              color="var(--env-accent)"
            />

            <p
              className="text-sm font-serif italic max-w-xs mx-auto leading-relaxed"
              style={{ color: 'var(--env-muted)' }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 3: PHOTO CAROUSEL / SLIDER (`gallery`)                          */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('gallery') && galleryMedia.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4 text-center"
          >
            <span
              className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold"
              style={{ color: 'var(--env-muted)' }}
            >
              {t.galleryTitle}
            </span>

            {/* Carousel Box with Touch-Swipe (drag="x") */}
            <div
              className="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden border border-[var(--env-border)] shadow-xl group touch-pan-y"
              style={{ backgroundColor: 'var(--env-paper)' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleCarouselDragEnd}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.6 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full cursor-grab active:cursor-grabbing select-none"
                >
                  <img
                    src={galleryMedia[currentSlide]}
                    alt={`${t.galleryTitle} — ${currentSlide + 1}`}
                    loading={currentSlide === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    onClick={() => setActiveModalMedia(galleryMedia[currentSlide])}
                    className="w-full h-full object-cover select-none pointer-events-auto cursor-pointer"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Controls with accessible labels */}
              {galleryMedia.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={t.prevSlide}
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? galleryMedia.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-[var(--env-ink)] flex items-center justify-center shadow-md hover:bg-white transition-all z-10 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label={t.nextSlide}
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === galleryMedia.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-[var(--env-ink)] flex items-center justify-center shadow-md hover:bg-white transition-all z-10 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Pagination Dots with aria-current */}
              {galleryMedia.length > 1 && (
                <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-2 z-10">
                  {galleryMedia.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Slide ${idx + 1}`}
                      aria-current={currentSlide === idx ? 'true' : undefined}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx
                          ? 'w-7 bg-[var(--env-accent)]'
                          : 'w-2.5 bg-white/70 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 4: CALENDAR CARD (`calendar`)                                   */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('calendar') && (
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 rounded-[10px] border border-[var(--env-border)] shadow-xl space-y-5 font-sans text-center"
            style={{ backgroundColor: 'var(--env-card-bg)' }}
          >
            <div className="space-y-1.5">
              <span
                className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold block"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.calendarTitle}
              </span>
              <h3
                className="text-2xl font-serif font-bold capitalize"
                style={{ color: 'var(--env-ink)' }}
              >
                {formattedDate.full}
              </h3>
            </div>

            {/* Calendar Month Grid */}
            <div className="pt-2">
              <div
                className="grid grid-cols-7 text-center text-xs font-bold mb-2 pb-1 border-b border-[var(--env-border)]"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.weekdays.map((wd, i) => (
                  <div key={i}>{wd}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center text-xs gap-y-2">
                {calendarDays.map((d, i) => {
                  const isWeddingDay = d === targetDay;
                  return (
                    <div key={i} className="h-8 flex items-center justify-center">
                      {d && (
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-medium transition-all ${
                            isWeddingDay
                              ? 'bg-[var(--env-accent)] text-white font-bold shadow-md scale-105'
                              : 'text-[var(--env-ink)] hover:bg-black/5'
                          }`}
                        >
                          {d}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Indicator */}
            <div
              className="pt-3 border-t border-[var(--env-border)] text-xs font-medium flex items-center justify-center gap-1.5"
              style={{ color: 'var(--env-muted)' }}
            >
              <Clock className="w-4 h-4 text-[var(--env-accent)]" />
              <span>
                {timeStr} — {t.startTime}
              </span>
            </div>

            {/* Add to Calendar Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href={getGoogleCalendarUrl(calendarEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-[8px] bg-white border border-[var(--env-border)] text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-[var(--env-accent)] transition-all shadow-sm"
                style={{ color: 'var(--env-ink)' }}
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[var(--env-accent)]" />
                {t.googleCalendar}
              </a>
              <button
                type="button"
                onClick={() => downloadIcs(calendarEvent)}
                className="py-2.5 px-3 rounded-[8px] bg-white border border-[var(--env-border)] text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-[var(--env-accent)] transition-all shadow-sm cursor-pointer"
                style={{ color: 'var(--env-ink)' }}
              >
                <Download className="w-3.5 h-3.5 text-[var(--env-accent)]" />
                {t.downloadIcs}
              </button>
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 5: COUNTDOWN TIMER (`countdown`)                                */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('countdown') && (
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-5"
          >
            <div className="space-y-1">
              <span
                className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold block"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.countdownTitle}
              </span>
              <p className="text-xs font-sans" style={{ color: 'var(--env-muted)' }}>
                {t.countdownSub}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2.5 font-sans">
              {[
                { label: t.days, val: calculatedTimeLeft.days },
                { label: t.hours, val: calculatedTimeLeft.hours },
                { label: t.minutes, val: calculatedTimeLeft.minutes },
                { label: t.seconds, val: calculatedTimeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-3 rounded-[8px] border border-[var(--env-border)] shadow-md"
                  style={{ backgroundColor: 'var(--env-card-bg)' }}
                >
                  <span
                    className="text-2xl sm:text-3xl font-serif font-bold"
                    style={{ color: 'var(--env-ink)' }}
                  >
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span
                    className="text-[11px] uppercase tracking-wider mt-1 font-semibold"
                    style={{ color: 'var(--env-muted)' }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 5.5: PROGRAM SCHEDULE (`schedule`)                              */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('schedule') && scheduleItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 rounded-[10px] border border-[var(--env-border)] shadow-xl text-center space-y-4 font-sans"
            style={{ backgroundColor: 'var(--env-card-bg)' }}
          >
            <div className="space-y-1">
              <span
                className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold block"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.scheduleTitle}
              </span>
              <h3
                className="text-2xl font-serif font-bold"
                style={{ color: 'var(--env-ink)' }}
              >
                {t.scheduleHeader}
              </h3>
            </div>

            <div className="flex flex-col gap-3.5 text-left pt-2 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[var(--env-border)]">
              {scheduleItems.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-3.5 relative z-10">
                  <div
                    className="w-10 h-10 rounded-full border border-[var(--env-border)] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm bg-white"
                    style={{ color: 'var(--env-ink)' }}
                  >
                    {item.time}
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <h4
                      className="text-xs font-bold"
                      style={{ color: 'var(--env-ink)' }}
                    >
                      {item.title || item.label}
                    </h4>
                    {item.desc && (
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'var(--env-muted)' }}
                      >
                        {item.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 6: RECEPTION VENUE CARD (`venue`)                               */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('venue') && (
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 rounded-[10px] border border-[var(--env-border)] shadow-xl text-center space-y-4 font-sans"
            style={{ backgroundColor: 'var(--env-card-bg)' }}
          >
            <div className="space-y-1.5">
              <span
                className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold block"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.venueHeader}
              </span>
              <h3
                className="text-2xl sm:text-3xl font-serif font-bold"
                style={{ color: 'var(--env-ink)' }}
              >
                {venueName}
              </h3>
              <p
                className="text-xs flex items-center justify-center gap-1.5 max-w-xs mx-auto leading-relaxed"
                style={{ color: 'var(--env-muted)' }}
              >
                <MapPin className="w-4 h-4 text-[var(--env-accent)] shrink-0" />
                {venueAddress}
              </p>
            </div>

            {/* Address Copy Action */}
            <button
              type="button"
              onClick={() => copyAddress(venueAddress)}
              className="px-4 py-2 rounded-full border border-[var(--env-border)] bg-white text-xs font-medium hover:border-[var(--env-accent)] transition-all shadow-sm flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              style={{ color: 'var(--env-ink)' }}
            >
              {addressCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[var(--env-accent)]" />
                  <span>{t.copyAddress}</span>
                </>
              )}
            </button>

            {/* Map Action Buttons (Google & Yandex) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={getGoogleMapsUrl(venueName, venueAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-[8px] bg-white border border-[var(--env-border)] text-xs font-bold flex items-center justify-center gap-1.5 hover:border-[var(--env-accent)] transition-all shadow-sm"
                style={{ color: 'var(--env-ink)' }}
              >
                <Navigation className="w-4 h-4 text-[var(--env-accent)]" />
                Google Maps
              </a>
              <a
                href={getYandexMapsUrl(venueName, venueAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-[8px] bg-white border border-[var(--env-border)] text-xs font-bold flex items-center justify-center gap-1.5 hover:border-[var(--env-accent)] transition-all shadow-sm"
                style={{ color: 'var(--env-ink)' }}
              >
                <Navigation className="w-4 h-4 text-[var(--env-accent)]" />
                Yandex Maps
              </a>
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 7: WARM WISH CARD (`wish`)                                      */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('wish') && (
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 sm:p-8 rounded-[10px] border border-[var(--env-border)] text-center space-y-3 shadow-lg"
            style={{ backgroundColor: 'var(--env-card-bg)' }}
          >
            <span
              className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-sans font-semibold block"
              style={{ color: 'var(--env-muted)' }}
            >
              {t.wishHeader}
            </span>

            {wishFrom && (
              <p
                className="text-xs font-sans font-medium"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.wishFrom}{' '}
                <span className="font-bold" style={{ color: 'var(--env-ink)' }}>
                  {wishFrom}
                </span>
              </p>
            )}

            <FloralOrnamentDivider
              className="w-36 h-4 mx-auto my-2"
              color="var(--env-accent)"
            />

            <p
              className="text-sm font-serif italic leading-relaxed px-2"
              style={{ color: 'var(--env-ink)' }}
            >
              &laquo;{wishText}&raquo;
            </p>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 8: RSVP & LEAVE A WISH (`rsvp`)                                 */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('rsvp') && (
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 rounded-[10px] border border-[var(--env-border)] shadow-xl space-y-5 font-sans"
            style={{ backgroundColor: 'var(--env-card-bg)' }}
          >
            {/* Modal Trigger for Guest Wishes */}
            <div className="text-center space-y-2">
              <span
                className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold block"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.wishesTitle}
              </span>
              <div>
                <button
                  type="button"
                  onClick={() => setShowWishModal(true)}
                  className="py-3 px-6 rounded-full border border-[var(--env-accent)] bg-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[var(--env-accent)] hover:text-white transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  style={{ color: 'var(--env-ink)' }}
                >
                  <MessageSquareHeart className="w-4 h-4 text-[var(--env-accent)]" />
                  {t.leaveWish}
                </button>
              </div>
            </div>

            <div className="w-16 h-[1px] bg-[var(--env-border)] mx-auto" />

            {/* Attendance Question */}
            <div className="text-center space-y-1">
              <span
                className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold block"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.willYouAttend}
              </span>
            </div>

            {rsvpState?.isSuccess || rsvpSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-[8px] bg-emerald-50/70 border border-emerald-200 text-center space-y-2"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950 font-serif">
                  {t.rsvpSuccess}
                </h4>
                <p className="text-xs text-emerald-800">{t.rsvpSuccessSub}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs">
                {/* Attendance Toggle */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => updateRsvpAttending(true)}
                    className={`py-3 px-3 rounded-[8px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      rsvpAttending === true
                        ? 'bg-[var(--env-accent)] text-white shadow-md'
                        : 'bg-white border border-[var(--env-border)] hover:border-[var(--env-accent)]'
                    }`}
                    style={
                      rsvpAttending === true
                        ? undefined
                        : { color: 'var(--env-ink)' }
                    }
                  >
                    <Check className="w-4 h-4" /> {t.yes}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateRsvpAttending(false)}
                    className={`py-3 px-3 rounded-[8px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      rsvpAttending === false
                        ? 'bg-rose-700 text-white shadow-md'
                        : 'bg-white border border-[var(--env-border)] hover:border-[var(--env-accent)]'
                    }`}
                    style={
                      rsvpAttending === false
                        ? undefined
                        : { color: 'var(--env-ink)' }
                    }
                  >
                    <X className="w-4 h-4" /> {t.no}
                  </button>
                </div>

                {/* Name Field */}
                <div className="space-y-1 text-left">
                  <label
                    htmlFor="rsvp-name-input"
                    className="font-medium flex items-center gap-1.5 text-xs"
                    style={{ color: 'var(--env-ink)' }}
                  >
                    <User className="w-3.5 h-3.5 text-[var(--env-accent)]" /> {t.nameLabel}
                  </label>
                  <input
                    id="rsvp-name-input"
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => updateRsvpName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full px-4 py-3 rounded-[8px] bg-white border border-[var(--env-border)] text-xs focus:outline-none focus:border-[var(--env-accent)] transition-colors"
                    style={{ color: 'var(--env-ink)' }}
                  />
                </div>

                {/* Guest Count Field */}
                {rsvpAttending && (
                  <div className="space-y-1 text-left">
                    <label
                      htmlFor="rsvp-guests-select"
                      className="font-medium flex items-center gap-1.5 text-xs"
                      style={{ color: 'var(--env-ink)' }}
                    >
                      <Users className="w-3.5 h-3.5 text-[var(--env-accent)]" /> {t.guestsLabel}
                    </label>
                    <select
                      id="rsvp-guests-select"
                      value={rsvpGuests}
                      onChange={(e) => updateRsvpGuests(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-[8px] bg-white border border-[var(--env-border)] text-xs focus:outline-none focus:border-[var(--env-accent)] transition-colors"
                      style={{ color: 'var(--env-ink)' }}
                    >
                      <option value="1">1 {t.guestCountUnit}</option>
                      <option value="2">2 {t.guestCountUnit}</option>
                      <option value="3">3 {t.guestCountUnit}</option>
                      <option value="4">4+ {t.guestCountUnit}</option>
                    </select>
                  </div>
                )}

                <PrivacyConsentCheckbox lang={currentLang} />

                <button
                  type="submit"
                  disabled={
                    rsvpState?.isSubmitting ||
                    !rsvpName.trim() ||
                    rsvpAttending === null
                  }
                  className="w-full py-3.5 px-6 rounded-[8px] bg-[var(--env-ink)] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[var(--env-accent)]" />
                  {rsvpState?.isSubmitting ? '...' : t.submitRsvp}
                </button>
              </form>
            )}
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 9: GIFT CARD / DONATION (`giftCard`)                            */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('giftCard') && showGiftSection && (
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 rounded-[10px] border border-[var(--env-border)] shadow-xl text-center space-y-4 font-sans"
            style={{ backgroundColor: 'var(--env-card-bg)' }}
          >
            <div className="space-y-1.5">
              <span
                className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-1.5"
                style={{ color: 'var(--env-muted)' }}
              >
                <Gift className="w-4 h-4 text-[var(--env-accent)]" />
                {t.giftSectionTitle}
              </span>
              <h3
                className="text-2xl font-serif font-bold"
                style={{ color: 'var(--env-ink)' }}
              >
                {t.giftCardHeading}
              </h3>
              <p
                className="text-xs font-light max-w-xs mx-auto leading-relaxed"
                style={{ color: 'var(--env-muted)' }}
              >
                {t.giftCardSub}
              </p>
            </div>

            <div className="p-4 rounded-[8px] bg-white border border-[var(--env-border)] flex flex-col items-center gap-2 max-w-xs mx-auto shadow-sm">
              <span
                className="text-base font-mono font-bold tracking-widest"
                style={{ color: 'var(--env-ink)' }}
              >
                {displayCardNumber}
              </span>
              {giftCardOwner && (
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--env-muted)' }}
                >
                  {giftCardOwner}
                </span>
              )}
              {!rawGiftCard && isPreview && (
                <span className="text-[11px] text-amber-700 font-medium">
                  ({t.cardExampleLabel})
                </span>
              )}
              <button
                type="button"
                onClick={() => copyCard(rawGiftCard ? rawGiftCard.replace(/\s+/g, '') : '8600000000000000')}
                className="mt-1 px-4 py-2 rounded-full border border-[var(--env-border)] bg-[var(--env-paper)] text-xs font-semibold hover:border-[var(--env-accent)] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                style={{ color: 'var(--env-ink)' }}
              >
                {cardCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[var(--env-accent)]" />
                    <span>{t.copyCardNumber}</span>
                  </>
                )}
              </button>
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* FOOTER                                                                  */}
        {/* ----------------------------------------------------------------------- */}
        <footer className="text-center pt-8 pb-12 space-y-3 border-t border-[var(--env-border)] font-sans">
          <h4
            className="text-2xl sm:text-3xl font-serif font-bold"
            style={{ color: 'var(--env-ink)' }}
          >
            {groomName} & {brideName}
          </h4>
          <p className="text-xs" style={{ color: 'var(--env-muted)' }}>
            {t.footerText}
          </p>
        </footer>
      </main>

      {/* ========================================================================= */}
      {/* FULLSCREEN LIGHTBOX MODAL (Esc & accessible)                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModalMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalMedia(null)}
            role="dialog"
            aria-modal="true"
            aria-label={t.galleryTitle}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <button
              type="button"
              aria-label={t.closeModal}
              onClick={() => setActiveModalMedia(null)}
              className="absolute top-6 right-6 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="max-w-3xl max-h-[85vh] overflow-hidden rounded-[8px] border border-white/20 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeModalMedia}
                alt="Enlarged photo"
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* LEAVE A WISH MODAL (`showWishModal`)                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showWishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWishModal(false)}
            role="dialog"
            aria-modal="true"
            aria-label={t.wishesTitle}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[10px] p-6 shadow-2xl space-y-4"
              style={{
                backgroundColor: 'white',
                color: 'var(--env-ink)',
                border: '1px solid var(--env-border)',
              }}
            >
              <div className="flex justify-between items-center border-b pb-3 border-[var(--env-border)]">
                <h4
                  className="font-serif font-bold text-lg flex items-center gap-2"
                  style={{ color: 'var(--env-ink)' }}
                >
                  <MessageSquareHeart className="w-5 h-5 text-[var(--env-accent)]" />
                  {t.wishesTitle}
                </h4>
                <button
                  type="button"
                  aria-label={t.closeModal}
                  onClick={() => setShowWishModal(false)}
                  className="text-gray-400 hover:text-[var(--env-ink)] p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {userWishSent ? (
                <div className="py-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p
                    className="font-bold font-serif text-base"
                    style={{ color: 'var(--env-ink)' }}
                  >
                    {t.wishSentSuccess}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label
                    htmlFor="guest-wish-textarea"
                    className="text-xs font-semibold block"
                    style={{ color: 'var(--env-ink)' }}
                  >
                    {t.writeWish}
                  </label>
                  <textarea
                    id="guest-wish-textarea"
                    rows={4}
                    value={userWishText}
                    onChange={(e) => setUserWishText(e.target.value)}
                    placeholder={t.wishPlaceholder}
                    className="w-full p-3 rounded-[8px] border border-[var(--env-border)] text-xs focus:outline-none focus:border-[var(--env-accent)]"
                    style={{ color: 'var(--env-ink)' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (userWishText.trim()) {
                        setUserWishSent(true);
                        setTimeout(() => {
                          setShowWishModal(false);
                          setUserWishSent(false);
                          setUserWishText('');
                        }, 2000);
                      }
                    }}
                    className="w-full py-3 rounded-[8px] bg-[var(--env-ink)] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:opacity-90 transition-all cursor-pointer"
                  >
                    {t.sendWish}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
