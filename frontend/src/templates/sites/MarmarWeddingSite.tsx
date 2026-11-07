import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VolumeX,
  Copy,
  Check,
  Navigation,
  MapPin,
  Calendar,
  X,
  Globe,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Phone,
  Download,
  Loader2,
  Heart,
} from 'lucide-react';
import type { WebsiteTemplateProps, CustomField } from './types';
import { useCountdownTimer, parseEventDateTime } from '../../utils/timer';
import { PrivacyConsentCheckbox } from '../../components/PrivacyConsentCheckbox';
import {
  formatEventDate,
  formatCardNumber,
  maskCardExample,
  downloadIcs,
  getGoogleCalendarUrl,
  getYandexMapsUrl,
  getGoogleMapsUrl,
  getMediaUrl,
  useCopyToClipboard,
  createSectionVisibility,
  getDemoContent,
  useCalmMotion,
} from './shared';

// ==========================================
// 1. MARBLE PROCEDURAL SVG BACKGROUND
// ==========================================
export const MarbleBackground: React.FC<{ isPreview?: boolean }> = ({ isPreview }) => {
  return (
    <div
      className={`${
        isPreview ? 'absolute' : 'fixed'
      } inset-0 pointer-events-none z-0 overflow-hidden select-none`}
      aria-hidden="true"
    >
      {/* Alabaster base */}
      <div className="absolute inset-0 bg-[#FAF8F5]" />

      {/* SVG feTurbulence + feColorMatrix procedural Carrara marble veins */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.24] mix-blend-multiply"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <filter id="marmar-carrara-veins" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.002"
            numOctaves="4"
            seed="23"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 0.46
              0 0 0 0 0.43
              0 0 0 0 0.40
              1 0 0 0 -0.22
            "
            result="coloredNoise"
          />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.34" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#marmar-carrara-veins)" fill="#FAF8F5" />
      </svg>

      {/* Subtle organic Carrara vein sweeps */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.11]"
        viewBox="0 0 1000 2000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-40,120 Q160,260 300,500 T560,960 T800,1430 T1040,1830"
          stroke="#686258"
          strokeWidth="1.2"
          strokeLinecap="round"
          filter="blur(0.8px)"
        />
        <path
          d="M-20,140 Q180,280 320,520 T580,980 T820,1450"
          stroke="#C5A265"
          strokeWidth="0.6"
          opacity="0.7"
        />
        <path
          d="M300,500 Q460,460 630,600 T930,730"
          stroke="#7A7368"
          strokeWidth="0.9"
          filter="blur(0.6px)"
        />
        <path
          d="M560,960 Q400,1080 260,1260 T80,1600"
          stroke="#686258"
          strokeWidth="1"
          filter="blur(0.8px)"
        />
        <path
          d="M800,1430 Q640,1580 500,1800"
          stroke="#C5A265"
          strokeWidth="0.6"
          opacity="0.5"
        />
      </svg>

      {/* Gentle vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#ECE8E1]/35 pointer-events-none" />
    </div>
  );
};

// ==========================================
// 2. REVEAL WRAPPER (Unified Section Entrance)
// ==========================================
export const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const calm = useCalmMotion();
  if (calm) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// 3. COVER PARTICLES (<= 8, scoped to hero)
// ==========================================
const MarmarCoverParticles: React.FC<{ isPreview?: boolean }> = ({ isPreview }) => {
  const calm = useCalmMotion(isPreview);
  if (calm) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`gold-dust-${i}`}
          className="absolute rounded-full"
          style={{
            top: `${12 + ((i * 15) % 70)}%`,
            left: `${12 + ((i * 18) % 76)}%`,
            width: `${3 + (i % 2) * 2}px`,
            height: `${3 + (i % 2) * 2}px`,
            background:
              'radial-gradient(circle, rgba(197,162,101,0.65) 0%, rgba(197,162,101,0) 70%)',
          }}
          animate={{
            y: [0, -22, 0],
            opacity: [0.2, 0.65, 0.2],
          }}
          transition={{
            duration: 4.5 + (i % 3),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.45,
          }}
        />
      ))}
    </div>
  );
};

// ==========================================
// 4. ELEGANT GOLD HAIRLINE DIVIDER
// ==========================================
export const MarmarDivider: React.FC<{ className?: string }> = ({ className = 'my-5' }) => (
  <div className={`flex items-center justify-center gap-3 select-none ${className}`} aria-hidden="true">
    <span className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#C5A265]/70" />
    <span className="w-1.5 h-1.5 rotate-45 border border-[#C5A265] bg-[#FAF8F5]" />
    <span className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#C5A265]/70" />
  </div>
);

// ==========================================
// 5. MARMAR LUXURY MONOGRAM (No hearts)
// ==========================================
export const MarmarMonogram: React.FC<{
  groomInitial: string;
  brideInitial?: string;
  className?: string;
}> = ({ groomInitial, brideInitial, className = 'w-18 h-18 sm:w-20 sm:h-20' }) => {
  return (
    <div className={`relative rounded-full border border-[#C5A265]/60 flex items-center justify-center p-1.5 ${className}`}>
      <div className="w-full h-full rounded-full border border-[#C5A265]/30 flex items-center justify-center bg-[#FAF8F5]/80">
        <span
          className="font-serif text-lg sm:text-xl tracking-wider text-[#2A2724] font-medium select-none"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {groomInitial}
          {brideInitial ? (
            <>
              <span className="font-serif italic font-normal text-[#8C6B28] mx-1">&</span>
              {brideInitial}
            </>
          ) : null}
        </span>
      </div>
    </div>
  );
};

// ==========================================
// 6. BURGUNDY WAX SEAL WITH GOLD MONOGRAM
// ==========================================
const MarmarWaxSeal: React.FC<{
  groomInitial: string;
  brideInitial: string;
  isBroken: boolean;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}> = ({ groomInitial, brideInitial, isBroken, onClick, disabled, ariaLabel }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="relative w-16 h-16 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A265] focus:ring-offset-2 focus:ring-offset-[#181615] select-none touch-manipulation group"
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full overflow-visible filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="marmar-wax-grad-left" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7B1A28" />
            <stop offset="60%" stopColor="#58121D" />
            <stop offset="100%" stopColor="#3F0D15" />
          </linearGradient>
          <linearGradient id="marmar-wax-grad-right" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7B1A28" />
            <stop offset="60%" stopColor="#58121D" />
            <stop offset="100%" stopColor="#3F0D15" />
          </linearGradient>
        </defs>

        {/* Left Half */}
        <motion.g
          animate={
            isBroken
              ? { x: -7, y: -2, rotate: -8 }
              : { x: 0, y: 0, rotate: 0 }
          }
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ transformOrigin: '32px 32px' }}
        >
          <path
            d="M 32 3 A 29 29 0 0 0 32 61 L 29 46 L 34 32 L 30 17 Z"
            fill="url(#marmar-wax-grad-left)"
            stroke="#3F0D15"
            strokeWidth="0.8"
          />
          <path
            d="M 32 9 A 23 23 0 0 0 32 55"
            fill="none"
            stroke="#C5A265"
            strokeWidth="0.9"
            strokeOpacity="0.85"
          />
          <text
            x="22"
            y="38"
            textAnchor="middle"
            fill="#FAF7F2"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="15"
            fontWeight="600"
          >
            {groomInitial}
          </text>
          <text
            x="31"
            y="36"
            textAnchor="end"
            fill="#C5A265"
            fontFamily="'Playfair Display', Georgia, serif"
            fontStyle="italic"
            fontSize="9"
          >
            &
          </text>
        </motion.g>

        {/* Right Half */}
        <motion.g
          animate={
            isBroken
              ? { x: 7, y: 2, rotate: 8 }
              : { x: 0, y: 0, rotate: 0 }
          }
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ transformOrigin: '32px 32px' }}
        >
          <path
            d="M 32 3 A 29 29 0 0 1 32 61 L 29 46 L 34 32 L 30 17 Z"
            fill="url(#marmar-wax-grad-right)"
            stroke="#3F0D15"
            strokeWidth="0.8"
          />
          <path
            d="M 32 9 A 23 23 0 0 1 32 55"
            fill="none"
            stroke="#C5A265"
            strokeWidth="0.9"
            strokeOpacity="0.85"
          />
          <text
            x="42"
            y="38"
            textAnchor="middle"
            fill="#FAF7F2"
            fontFamily="'Playfair Display', Georgia, serif"
            fontSize="15"
            fontWeight="600"
          >
            {brideInitial}
          </text>
        </motion.g>
      </svg>
    </button>
  );
};

// ==========================================
// 7. ENVELOPE ENTRANCE ANIMATION (CSS/SVG <= 1.6s)
// ==========================================
const EnvelopeEntranceAnimation: React.FC<{
  groomName: string;
  brideName: string;
  dateStr: string;
  onOpen?: () => void;
  t: any;
  isPreview?: boolean;
}> = ({ groomName, brideName, dateStr, onOpen, t, isPreview = false }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const [isCardSlid, setIsCardSlid] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const calm = useCalmMotion(isPreview);

  const groomInitial = groomName.trim().charAt(0).toUpperCase() || 'J';
  const brideInitial = brideName.trim().charAt(0).toUpperCase() || 'M';

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    if (calm) {
      setIsFading(true);
      setTimeout(() => {
        if (onOpen) onOpen();
      }, 250);
      return;
    }

    // Sequence <= 1.45s:
    // 0ms: seal cracks
    setIsBroken(true);
    // 220ms: flap rotates open
    setTimeout(() => {
      setIsFlapOpen(true);
    }, 220);
    // 480ms: card slides up out of envelope pocket
    setTimeout(() => {
      setIsCardSlid(true);
    }, 480);
    // 1180ms: smooth fade out to main site
    setTimeout(() => {
      setIsFading(true);
    }, 1180);
    // 1450ms: call onOpen
    setTimeout(() => {
      if (onOpen) onOpen();
    }, 1450);
  };

  return (
    <div
      className={`${
        isPreview ? 'h-full min-h-full' : 'min-h-[100dvh]'
      } w-full bg-[#181615] text-[#FAF7F2] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none transition-opacity duration-300 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Ambient background warmth */}
      <div className="absolute w-96 h-96 rounded-full bg-[#C5A265]/10 blur-3xl pointer-events-none" />

      {/* Top Title */}
      <div className="z-10 text-center max-w-sm flex flex-col items-center gap-1.5 mb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A265] font-semibold">
          {t.invitationTitle}
        </span>
        <h1
          className="text-2xl sm:text-3xl font-serif text-[#FAF7F2] font-medium tracking-wide"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {groomName} <span className="font-serif italic text-xl text-[#C5A265]">&</span> {brideName}
        </h1>
      </div>

      {/* Real CSS/SVG Envelope Container */}
      <div className="relative z-20 w-full max-w-[340px] sm:max-w-[370px] aspect-[1.48/1] flex items-center justify-center">
        {/* Envelope Body / Base Paper (Ivory) */}
        <div className="absolute inset-0 bg-[#F5F2EB] rounded-xl border border-[#C5A265]/35 shadow-[0_20px_45px_rgba(0,0,0,0.6)] overflow-visible">
          {/* Inside Emerging Card (z-10) */}
          <motion.div
            animate={{
              y: isCardSlid ? -100 : 0,
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-3.5 top-3.5 h-[200px] bg-[#FFFFFF] border border-[#C5A265]/40 rounded-lg p-4 flex flex-col items-center text-center justify-center shadow-md z-10"
          >
            <img
              src="/wedding_doves.webp"
              alt=""
              className="h-7 w-auto object-contain opacity-80 mb-1 pointer-events-none"
            />
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold">
              {t.invitationTitle}
            </span>
            <h2
              className="text-lg sm:text-xl font-serif text-[#2A2724] font-medium tracking-wide mt-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {groomName} <span className="font-serif italic text-base text-[#8C6B28]">&</span> {brideName}
            </h2>
            <div className="w-10 h-[1px] bg-[#C5A265]/50 my-1.5" />
            <p className="text-xs text-[#57524A] font-serif italic max-w-xs">{dateStr}</p>
          </motion.div>

          {/* Front Pocket Overlay (z-20) - Hides lower card inside envelope */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 360 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left triangle fold */}
            <polygon
              points="0,0 0,240 180,135"
              fill="#EFEAE0"
              stroke="#C5A265"
              strokeWidth="0.75"
              strokeOpacity="0.3"
            />
            {/* Right triangle fold */}
            <polygon
              points="360,0 360,240 180,135"
              fill="#EFEAE0"
              stroke="#C5A265"
              strokeWidth="0.75"
              strokeOpacity="0.3"
            />
            {/* Bottom triangular pouch */}
            <polygon
              points="0,240 360,240 180,135"
              fill="#FAF7F2"
              stroke="#C5A265"
              strokeWidth="0.9"
              strokeOpacity="0.4"
            />
          </svg>

          {/* Triangular Top Flap (3D rotateX) */}
          <div
            className="absolute inset-x-0 top-0 h-[135px] pointer-events-none"
            style={{
              perspective: 1200,
              zIndex: isFlapOpen ? 5 : 25,
            }}
          >
            <motion.div
              animate={{
                rotateX: isFlapOpen ? -180 : 0,
              }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                width: '100%',
                height: '100%',
              }}
            >
              <svg
                viewBox="0 0 360 135"
                className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  points="0,0 360,0 180,135"
                  fill="#FAF7F2"
                  stroke="#C5A265"
                  strokeWidth="0.9"
                  strokeOpacity="0.4"
                />
              </svg>
            </motion.div>
          </div>

          {/* Wax Seal (Centered at apex of triangle flap) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[103px] z-30 flex items-center justify-center"
            style={{ pointerEvents: isOpening ? 'none' : 'auto' }}
          >
            <MarmarWaxSeal
              groomInitial={groomInitial}
              brideInitial={brideInitial}
              isBroken={isBroken}
              onClick={handleOpen}
              disabled={isOpening}
              ariaLabel={t.openEnvelopeBtn}
            />
          </div>
        </div>
      </div>

      {/* Bottom Action & Hint */}
      <div className="z-20 mt-6 flex flex-col items-center gap-2">
        <p className="text-xs text-[#FAF7F2]/70 font-serif italic text-center">
          {t.sealTapHint}
        </p>

        <button
          type="button"
          onClick={handleOpen}
          disabled={isOpening}
          aria-label={t.openEnvelopeBtn}
          className="min-h-[44px] py-2.5 px-6 rounded-full border border-[#C5A265]/40 bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-[#FAF7F2] text-xs font-medium tracking-widest uppercase transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {isOpening ? t.openingText : t.openEnvelopeBtn}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 8. TRANSLATIONS (ru / uz / en)
// ==========================================
const TRANSLATIONS = {
  ru: {
    invitationTitle: 'Свадебное Приглашение',
    welcomeText:
      'Дорогие родные и близкие! С благословения родителей приглашаем вас разделить радость создания нашей семьи.',
    openEnvelopeBtn: 'Открыть приглашение',
    openingText: 'Открывается...',
    sealTapHint: 'Нажмите на сургучную печать, чтобы открыть',
    ourStoryTitle: 'Наша история любви',
    dateAndPlace: 'Дата и место торжества',
    dateLabel: 'Дата',
    timeLabel: 'Время',
    venueLabel: 'Банкетный зал',
    addressLabel: 'Адрес',
    openYandex: 'Яндекс Карты',
    openGoogle: 'Google Карты',
    copyAddress: 'Скопировать адрес',
    addressCopied: 'Адрес скопирован!',
    addToCalendar: 'Google Календарь',
    downloadIcs: 'Скачать .ics',
    countdownTitle: 'До начала торжества осталось',
    days: 'дней',
    hours: 'часов',
    minutes: 'минут',
    seconds: 'секунд',
    passed: 'Торжество уже началось!',
    programTitle: 'Программа свадебного дня',
    dressCodeTitle: 'Дресс-код и палитра',
    dressCodeSubtitle:
      'Будем признательны, если при выборе нарядов вы поддержите цветовую палитру торжества:',
    galleryTitle: 'Фотогалерея',
    gallerySubtitle: 'Счастливые мгновения нашей истории',
    videoTitle: 'Видео-приглашение',
    rsvpTitle: 'Подтверждение присутствия',
    rsvpSubtitle: 'Пожалуйста, подтвердите ваше участие заранее:',
    yourName: 'Ваше имя и фамилия',
    yourNamePlaceholder: 'Например: Алишер',
    willAttend: 'Сможете ли вы присутствовать?',
    yes: 'Да, с удовольствием!',
    no: 'К сожалению, не смогу',
    wishesPlaceholder: 'Напишите ваши тёплые пожелания молодожёнам...',
    sendRsvp: 'Отправить подтверждение',
    sending: 'Отправка...',
    thankYouRsvp: 'Спасибо! Ваш ответ успешно отправлен.',
    giftTitle: 'Подарки и пожелания',
    giftSubtitle:
      'Ваше присутствие — главный подарок для нас! Но если вы хотите поздравить нас отдельно:',
    copyCard: 'Скопировать номер карты',
    copiedText: 'Номер карты скопирован!',
    cardOwner: 'Получатель',
    giftCardExampleLabel: 'Пример карты',
    loveButton: 'Отправить поздравление',
    likesCount: 'гостей уже выразили свои пожелания',
    phoneLabel: 'Контакты',
    sectionsManager: 'Управление секциями',
    restoreAll: 'Показать все скрытые блоки',
    hideSectionHint: 'Скрыть секцию',
    closeLightbox: 'Закрыть фото',
    sectionNames: {
      hero: 'Обложка',
      photo: 'Главное фото',
      video: 'Видео-ролик',
      loveStory: 'История любви',
      dateVenue: 'Дата и место',
      countdown: 'Таймер отсчета',
      schedule: 'Программа дня',
      gallery: 'Фотогалерея',
      dressCode: 'Дресс-код',
      rsvp: 'Анкета гостей',
      giftCard: 'Подарки и карта',
      phone: 'Контакты',
    },
    scheduleItems: [
      { time: '18:00', title: 'Сбор гостей', desc: 'Живая музыка и welcome drinks' },
      { time: '19:00', title: 'Торжественная церемония', desc: 'Выход молодожёнов и регистрация' },
      { time: '20:00', title: 'Свадебный ужин', desc: 'Праздничный банкет, тосты и шоу' },
      { time: '22:30', title: 'Свадебный торт', desc: 'Сладкий финал вечера' },
    ],
    defaultDressColors: [
      { name: 'Шампань', hex: '#C5A265' },
      { name: 'Слоновая кость', hex: '#F4EEDB' },
      { name: 'Глубокий изумруд', hex: '#2A4736' },
      { name: 'Пыльная роза', hex: '#DDBEBF' },
    ],
  },
  uz: {
    invitationTitle: 'Toʻy taklifnomasi',
    welcomeText:
      'Hurmatli mehmonimiz! Sizni hayotimizdagi eng quvonchli va unutilmas kun — nikoh toʻyimiz tantanasiga lutfan taklif etamiz.',
    openEnvelopeBtn: 'Taklifnomani ochish',
    openingText: 'Ochilmoqda...',
    sealTapHint: 'Taklifnomani ochish uchun muhr ustiga bosing',
    ourStoryTitle: 'Bizning sevgi tariximiz',
    dateAndPlace: 'Sana va manzil',
    dateLabel: 'Sana',
    timeLabel: 'Vaqt',
    venueLabel: 'Tantanalar saroyi',
    addressLabel: 'Manzil',
    openYandex: 'Yandex Maps',
    openGoogle: 'Google Maps',
    copyAddress: 'Manzilni nusxalash',
    addressCopied: 'Manzil nusxalandi!',
    addToCalendar: 'Google Taqvim',
    downloadIcs: 'Taqvimga saqlash (.ics)',
    countdownTitle: 'Tantanagacha qolgan vaqt',
    days: 'kun',
    hours: 'soat',
    minutes: 'daqiqa',
    seconds: 'soniya',
    passed: 'Toʻy tantanasi boshlandi!',
    programTitle: 'Toʻy dasturi',
    dressCodeTitle: 'Dress-kod va ranglar palitrasi',
    dressCodeSubtitle:
      'Agar bayramimiz uchun ushbu ranglardagi liboslarni tanlasangiz, juda mamnun boʻlamiz:',
    galleryTitle: 'Foto galereya',
    gallerySubtitle: 'Eng baxtli va unutilmas lahzalarimiz',
    videoTitle: 'Video taklifnoma',
    rsvpTitle: 'Tashrifingizni tasdiqlang',
    rsvpSubtitle: 'Toʻyga tashrifingizni oldindan tasdiqlashingizni iltimos qilamiz:',
    yourName: 'Ismingiz va familiyangiz',
    yourNamePlaceholder: 'Masalan: Alisher',
    willAttend: 'Toʻyda ishtirok eta olasizmi?',
    yes: 'Ha, albatta boraman',
    no: 'Afsuski, bora olmayman',
    wishesPlaceholder: 'Yoshlarga oʻz samimiy tilaklaringizni yozing...',
    sendRsvp: 'Javobni yuborish',
    sending: 'Yuborilmoqda...',
    thankYouRsvp: 'Katta rahmat! Javobingiz muvaffaqiyatli qabul qilindi.',
    giftTitle: 'Sovgʻalar va tilaklar',
    giftSubtitle:
      'Sizning tashrifingiz — biz uchun eng oliy sovgʻa! Agar ezgu tilaklaringizni karta orqali yoʻllamoqchi boʻlsangiz:',
    copyCard: 'Karta raqamini nusxalash',
    copiedText: 'Karta raqami nusxalandi!',
    cardOwner: 'Karta egasi',
    giftCardExampleLabel: 'Namuna karta',
    loveButton: 'Tilak bildirish',
    likesCount: 'ta samimiy tilak bildirildi',
    phoneLabel: 'Bogʻlanish uchun',
    sectionsManager: 'Boʻlimlar boshqaruvi',
    restoreAll: 'Barcha boʻlimlarni koʻrsatish',
    hideSectionHint: 'Boʻlimni yashirish',
    closeLightbox: 'Yopish',
    sectionNames: {
      hero: 'Bosh sahifa',
      photo: 'Bosh surat',
      video: 'Video taklifnoma',
      loveStory: 'Sevgi tarixi',
      dateVenue: 'Sana va manzil',
      countdown: 'Taymer',
      schedule: 'Toʻy dasturi',
      gallery: 'Foto galereya',
      dressCode: 'Dress-kod',
      rsvp: 'Mehmonlar anketasi',
      giftCard: 'Sovgʻalar va karta',
      phone: 'Aloqa',
    },
    scheduleItems: [
      { time: '18:00', title: 'Mehmonlar tashrifi', desc: 'Jonli musiqa va kutib olish' },
      { time: '19:00', title: 'Nikoh marosimi', desc: 'Kelin-kuyovning tantanali kirishi' },
      { time: '20:00', title: 'Toʻy oqshomi', desc: 'Bayramona dastur va tabriklar' },
      { time: '22:30', title: 'Toʻy torti', desc: 'Kechki shirin xotima' },
    ],
    defaultDressColors: [
      { name: 'Oltinrang', hex: '#C5A265' },
      { name: 'Qaymoqrang', hex: '#F4EEDB' },
      { name: 'Zangori zumrad', hex: '#2A4736' },
      { name: 'Marvarid pushti', hex: '#DDBEBF' },
    ],
  },
  en: {
    invitationTitle: 'Wedding Invitation',
    welcomeText:
      'With the blessings of our parents, we joyfully invite you to celebrate the beginning of our married life.',
    openEnvelopeBtn: 'Open Invitation',
    openingText: 'Opening...',
    sealTapHint: 'Tap the wax seal to open',
    ourStoryTitle: 'Our Love Story',
    dateAndPlace: 'Date & Location',
    dateLabel: 'Date',
    timeLabel: 'Time',
    venueLabel: 'Venue',
    addressLabel: 'Address',
    openYandex: 'Yandex Maps',
    openGoogle: 'Google Maps',
    copyAddress: 'Copy Address',
    addressCopied: 'Address copied!',
    addToCalendar: 'Google Calendar',
    downloadIcs: 'Save .ics',
    countdownTitle: 'Countdown to the Celebration',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    passed: 'The celebration has begun!',
    programTitle: 'Wedding Day Schedule',
    dressCodeTitle: 'Dress Code & Palette',
    dressCodeSubtitle:
      'We would appreciate it if your celebration attire reflects our color palette:',
    galleryTitle: 'Photo Gallery',
    gallerySubtitle: 'Cherished moments of our journey',
    videoTitle: 'Video Invitation',
    rsvpTitle: 'RSVP Confirmation',
    rsvpSubtitle: 'Please kindly confirm your attendance in advance:',
    yourName: 'Your Full Name',
    yourNamePlaceholder: 'e.g. Jasur',
    willAttend: 'Will you be joining us?',
    yes: 'Yes, with pleasure!',
    no: 'Regretfully decline',
    wishesPlaceholder: 'Share your warm wishes for the couple...',
    sendRsvp: 'Confirm Attendance',
    sending: 'Submitting...',
    thankYouRsvp: 'Thank you! Your response has been received.',
    giftTitle: 'Wedding Gifts & Registry',
    giftSubtitle:
      'Your presence is our greatest present! However, if you wish to honor us with a gift:',
    copyCard: 'Copy Card Number',
    copiedText: 'Card number copied!',
    cardOwner: 'Card Holder',
    giftCardExampleLabel: 'Sample Card',
    loveButton: 'Send Wishes',
    likesCount: 'guests sent their warm wishes',
    phoneLabel: 'Contact',
    sectionsManager: 'Manage Sections',
    restoreAll: 'Show All Sections',
    hideSectionHint: 'Hide section',
    closeLightbox: 'Close photo',
    sectionNames: {
      hero: 'Hero Cover',
      photo: 'Main Photo',
      video: 'Video Invitation',
      loveStory: 'Our Love Story',
      dateVenue: 'Date & Location',
      countdown: 'Countdown',
      schedule: 'Schedule',
      gallery: 'Photo Gallery',
      dressCode: 'Dress Code',
      rsvp: 'RSVP Form',
      giftCard: 'Gifts & Registry',
      phone: 'Contacts',
    },
    scheduleItems: [
      { time: '18:00', title: 'Welcome Reception', desc: 'Live music & greeting drinks' },
      { time: '19:00', title: 'Wedding Ceremony', desc: 'Solemn entrance & registration' },
      { time: '20:00', title: 'Gala Dinner', desc: 'Dinner, toasts & celebrations' },
      { time: '22:30', title: 'Cake Cutting', desc: 'Sweet finale of the evening' },
    ],
    defaultDressColors: [
      { name: 'Champagne Gold', hex: '#C5A265' },
      { name: 'Warm Ivory', hex: '#F4EEDB' },
      { name: 'Forest Emerald', hex: '#2A4736' },
      { name: 'Dusty Blush', hex: '#DDBEBF' },
    ],
  },
};

// ==========================================
// 9. MAIN MARMAR WEDDING SITE COMPONENT
// ==========================================
export const MarmarWeddingSite: React.FC<WebsiteTemplateProps> = ({
  data,
  customFields = [],
  lang = 'ru',
  isOpened = false,
  onOpenEnvelope,
  isPlaying = false,
  onToggleAudio,
  timeLeft,
  rsvpState,
  isPreview = false,
  onToggleSection,
  onLanguageChange,
}) => {
  const [currentLang, setCurrentLang] = useState<'ru' | 'uz' | 'en'>(lang || 'ru');
  const [hiddenSections, setHiddenSections] = useState<string[]>(data.hiddenSections || []);
  const [showSectionManager, setShowSectionManager] = useState(false);
  const [activeModalPhoto, setActiveModalPhoto] = useState<string | null>(null);
  const [guestLikes, setGuestLikes] = useState(148);
  const [hasLiked, setHasLiked] = useState(false);

  const { copied: cardCopied, copy: copyCard } = useCopyToClipboard();
  const { copied: addressCopied, copy: copyAddress } = useCopyToClipboard();

  useEffect(() => {
    if (lang) setCurrentLang(lang);
  }, [lang]);

  useEffect(() => {
    if (data.hiddenSections) {
      setHiddenSections(data.hiddenSections);
    }
  }, [data.hiddenSections]);

  const demo = getDemoContent(currentLang);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ru;

  // Resolve values according to 00_COMMON_RULES:
  // No fake data on real guest site. In preview, use localized demo fallbacks.
  const groomName = data.groomName?.trim() || (isPreview ? demo.groomName : '');
  const brideName = data.brideName?.trim() || (isPreview ? demo.brideName : '');
  const dateStr = data.date || '2026-08-15';
  const time = data.time || '18:00';
  const venue = data.venue?.trim() || (isPreview ? demo.venue : '');
  const address = data.address?.trim() || (isPreview ? demo.address : '');
  const loveStory = data.loveStory?.trim() || (isPreview ? demo.loveStory : null);
  const phoneNumber = data.phone?.trim() || (isPreview ? '+998 90 123 45 67' : null);

  // Hero Photo: local fallback only in preview, hidden on real site if not uploaded
  const heroPhoto = data.photoUrl?.trim()
    ? getMediaUrl(data.photoUrl)
    : isPreview
      ? '/olive-editorial-1.webp'
      : null;

  // Gallery: 4 local preview photos in preview, hidden on real site if empty
  const galleryPhotos =
    Array.isArray(data.photos) && data.photos.length > 0
      ? data.photos.map((p) => getMediaUrl(p))
      : isPreview
        ? [
            '/olive-editorial-1.webp',
            '/olive-editorial-2.webp',
            '/olive-editorial-3.webp',
            '/olive-editorial-4.webp',
          ]
        : [];

  // Card: masked example in preview, hidden on real site if empty
  const hasGiftCard = Boolean(data.giftCardNumber && data.giftCardNumber.trim().length > 0);
  const displayCardNumber = hasGiftCard
    ? formatCardNumber(data.giftCardNumber)
    : isPreview
      ? maskCardExample()
      : null;

  // Schedule items
  const scheduleItems =
    Array.isArray(data.schedule) && data.schedule.length > 0
      ? data.schedule
      : Array.isArray(data.scheduleItems) && data.scheduleItems.length > 0
        ? data.scheduleItems
        : t.scheduleItems;

  // Dress Colors
  let dressColors: { name: string; hex: string }[] = t.defaultDressColors;
  if (Array.isArray(data.dressColors) && data.dressColors.length > 0) {
    dressColors = data.dressColors.map((item: any, idx: number) => {
      if (typeof item === 'string') {
        return { name: `Цвет ${idx + 1}`, hex: item };
      }
      return { name: item.name || `Цвет ${idx + 1}`, hex: item.hex || '#C5A265' };
    });
  }

  // Date formatting
  const formattedDateObj = formatEventDate(dateStr, currentLang);
  const eventDateTime = parseEventDateTime(dateStr, time);
  const currentDifference = useCountdownTimer(dateStr, time, timeLeft);

  const calendarEvent = {
    title: `${groomName} & ${brideName} - ${t.invitationTitle}`,
    start: eventDateTime,
    location: [venue, address].filter(Boolean).join(', '),
    description: t.welcomeText,
  };

  // Section visibility predicate with alias mapping
  const isSectionVisible = createSectionVisibility(hiddenSections);

  const toggleHideSection = (sectionKey: string) => {
    setHiddenSections((prev) => {
      const updated = prev.includes(sectionKey)
        ? prev.filter((k) => k !== sectionKey)
        : [...prev, sectionKey];
      return updated;
    });
    if (onToggleSection) onToggleSection(sectionKey);
  };

  const handleLanguageChange = (newLang: 'ru' | 'uz' | 'en') => {
    setCurrentLang(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setGuestLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const groomInitial = groomName.trim().charAt(0).toUpperCase() || 'J';
  const brideInitial = brideName.trim().charAt(0).toUpperCase() || 'M';

  // Lightbox keyboard close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalPhoto(null);
      }
    };
    if (activeModalPhoto) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalPhoto]);

  // If envelope screen is not opened yet, render authentic CSS/SVG envelope entrance
  if (!isOpened) {
    return (
      <EnvelopeEntranceAnimation
        groomName={groomName}
        brideName={brideName}
        dateStr={formattedDateObj.full}
        onOpen={onOpenEnvelope}
        t={t}
        isPreview={isPreview}
      />
    );
  }

  // Masonry 2 columns
  const col1Photos = galleryPhotos.filter((_, idx) => idx % 2 === 0);
  const col2Photos = galleryPhotos.filter((_, idx) => idx % 2 === 1);

  // Love story paragraphs
  const storyParagraphs = loveStory
    ? loveStory
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  const containerClasses = isPreview
    ? 'w-full h-full overflow-y-auto bg-[#FAF8F5] text-[#2A2724] p-4 font-sans select-none scrollbar-thin relative'
    : 'w-full min-h-screen bg-[#FAF8F5] text-[#2A2724] font-sans flex flex-col items-center select-none relative overflow-x-hidden';

  const innerClasses = isPreview
    ? 'w-full flex flex-col items-center max-w-lg mx-auto relative z-10'
    : 'w-full max-w-lg flex flex-col items-center relative z-10 px-4';

  return (
    <div className={containerClasses}>
      {/* Carrara Marble Background (rendered ONCE as page background) */}
      <MarbleBackground isPreview={isPreview} />

      {/* TOP FLOATING CONTROLS (Language Switcher, Section Manager, Audio) */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none max-w-lg mx-auto">
        {/* Language Switcher */}
        <nav
          aria-label="Language selector"
          className="pointer-events-auto flex items-center gap-1 bg-[#FAF8F5]/90 border border-[#C5A265]/40 p-1 rounded-full shadow-sm backdrop-blur-md"
        >
          <Globe className="w-3.5 h-3.5 text-[#8C6B28] ml-1.5" aria-hidden="true" />
          {(['ru', 'uz', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => handleLanguageChange(l)}
              aria-label={`Switch language to ${l.toUpperCase()}`}
              className={`min-h-[28px] px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase transition-all ${
                currentLang === l
                  ? 'bg-[#2A2724] text-[#FAF8F5] shadow-xs'
                  : 'text-[#57524A] hover:text-[#2A2724]'
              }`}
            >
              {l}
            </button>
          ))}
        </nav>

        {/* Section Manager & Audio Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {isPreview && (
            <button
              type="button"
              onClick={() => setShowSectionManager(!showSectionManager)}
              aria-label={t.sectionsManager}
              className="w-10 h-10 rounded-full bg-[#FAF8F5]/90 border border-[#C5A265]/40 text-[#2A2724] flex items-center justify-center shadow-sm backdrop-blur-md hover:bg-white transition-all relative"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#8C6B28]" />
              {hiddenSections.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-amber-700 text-white text-[11px] font-bold flex items-center justify-center">
                  {hiddenSections.length}
                </span>
              )}
            </button>
          )}

          {onToggleAudio && (
            <button
              type="button"
              onClick={onToggleAudio}
              aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
              className="w-10 h-10 rounded-full bg-[#FAF8F5]/90 border border-[#C5A265]/40 text-[#2A2724] flex items-center justify-center shadow-sm backdrop-blur-md hover:bg-white transition-all"
            >
              {isPlaying ? (
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  <span className="w-1 h-3 bg-[#8C6B28] rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-[#C5A265] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-2.5 bg-[#8C6B28] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              ) : (
                <VolumeX className="w-4 h-4 text-[#787268]" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* SECTION MANAGER MODAL (Preview Mode Only) */}
      <AnimatePresence>
        {isPreview && showSectionManager && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 left-4 max-w-sm mx-auto z-50 bg-[#FAF8F5] border border-[#C5A265]/70 rounded-2xl p-4 shadow-xl text-[#2A2724] flex flex-col gap-3"
          >
            <div className="flex items-center justify-between border-b border-[#C5A265]/30 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6B28] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {t.sectionsManager}
              </span>
              <button
                type="button"
                onClick={() => setShowSectionManager(false)}
                aria-label="Close section manager"
                className="w-6 h-6 rounded-full bg-[#EFEAE0] hover:bg-[#E5DFD3] text-[#2A2724] flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {[
                { id: 'hero', name: t.sectionNames.hero },
                { id: 'photo', name: t.sectionNames.photo },
                { id: 'video', name: t.sectionNames.video },
                { id: 'loveStory', name: t.sectionNames.loveStory },
                { id: 'dateVenue', name: t.sectionNames.dateVenue },
                { id: 'countdown', name: t.sectionNames.countdown },
                { id: 'schedule', name: t.sectionNames.schedule },
                { id: 'gallery', name: t.sectionNames.gallery },
                { id: 'dressCode', name: t.sectionNames.dressCode },
                { id: 'rsvp', name: t.sectionNames.rsvp },
                { id: 'giftCard', name: t.sectionNames.giftCard },
                { id: 'phone', name: t.sectionNames.phone },
              ].map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => toggleHideSection(sec.id)}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                    isSectionVisible(sec.id)
                      ? 'bg-white border-[#C5A265]/60 text-[#2A2724] shadow-xs'
                      : 'bg-[#EFEAE0] border-transparent text-[#787268] line-through'
                  }`}
                >
                  <span className="truncate">{sec.name}</span>
                  {isSectionVisible(sec.id) ? (
                    <Eye className="w-3.5 h-3.5 text-[#8C6B28] shrink-0 ml-1" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-[#787268] shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>

            {hiddenSections.length > 0 && (
              <button
                type="button"
                onClick={() => setHiddenSections([])}
                className="mt-1 w-full py-2 bg-[#2A2724] hover:bg-[#3D3833] text-[#FAF8F5] font-semibold rounded-xl text-xs flex items-center justify-center transition-colors shadow-xs"
              >
                {t.restoreAll}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MAIN CONTENT (14 Architectural Sections)
      ======================================================== */}
      <main className={innerClasses}>
        {/* ========================================================
            1. ОБЛОЖКА / HERO COVER
        ======================================================== */}
        {isSectionVisible('hero') && (
          <section className="w-full pt-20 pb-12 sm:pt-24 sm:pb-16 flex flex-col items-center text-center relative">
            <MarmarCoverParticles isPreview={isPreview} />

            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('hero')}
                aria-label={t.hideSectionHint}
                className="absolute top-6 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full flex flex-col items-center">
              {/* Monogram */}
              <MarmarMonogram
                groomInitial={groomInitial}
                brideInitial={brideInitial}
                className="mb-4"
              />

              {/* Title */}
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold select-none">
                {t.invitationTitle}
              </span>

              {/* Couple Names in Two Lines with Italic & */}
              <div className="flex flex-col items-center my-3 gap-0.5">
                <h1
                  className="text-3xl sm:text-4xl text-[#2A2724] font-medium tracking-wide"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {groomName}
                </h1>
                {brideName && (
                  <>
                    <span
                      className="font-serif italic text-2xl text-[#8C6B28] leading-none my-1 select-none"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      &
                    </span>
                    <h1
                      className="text-3xl sm:text-4xl text-[#2A2724] font-medium tracking-wide"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {brideName}
                    </h1>
                  </>
                )}
              </div>

              {/* 1px Gold Line Divider */}
              <MarmarDivider className="my-3" />

              {/* Event Date in Words */}
              <p className="text-sm sm:text-base font-serif italic text-[#57524A] max-w-sm">
                {formattedDateObj.full}
              </p>

              {/* Welcome text */}
              <p className="text-xs sm:text-sm text-[#57524A] leading-relaxed max-w-md mx-auto mt-3 px-4">
                {t.welcomeText}
              </p>
            </Reveal>
          </section>
        )}

        {/* ========================================================
            2. ГЛАВНОЕ ФОТО / MAIN HERO PHOTO (In Arch Frame)
        ======================================================== */}
        {isSectionVisible('photo') && heroPhoto && (
          <section className="w-full py-8 sm:py-12 flex flex-col items-center relative">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('photo')}
                aria-label={t.hideSectionHint}
                className="absolute top-2 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full flex flex-col items-center">
              {/* Classical Dual Hairline Arch Frame */}
              <div className="relative p-2 border border-[#C5A265]/40 rounded-t-[160px] rounded-b-2xl shadow-sm bg-white/60 max-w-[320px] w-full">
                <div className="overflow-hidden rounded-t-[152px] rounded-b-xl aspect-[3/4] relative bg-[#FAF8F5]">
                  <img
                    src={getMediaUrl(heroPhoto)}
                    alt={`${groomName} & ${brideName}`}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Caption Under Photo */}
              <div className="mt-4 text-center">
                <p
                  className="font-serif italic text-base text-[#57524A]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {groomName} & {brideName}
                </p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold mt-0.5">
                  {formattedDateObj.day} {formattedDateObj.month} {formattedDateObj.year}
                </p>
              </div>
            </Reveal>
          </section>
        )}

        {/* ========================================================
            3. ИСТОРИЯ ЛЮБВИ / LOVE STORY (Timeline / Editorial)
        ======================================================== */}
        {isSectionVisible('loveStory') && storyParagraphs.length > 0 && (
          <section className="w-full py-8 sm:py-12 flex flex-col items-center text-center relative">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('loveStory')}
                aria-label={t.hideSectionHint}
                className="absolute top-2 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full flex flex-col items-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold">
                {t.ourStoryTitle}
              </span>
              <MarmarDivider className="my-3" />

              {storyParagraphs.length > 1 ? (
                <div className="w-full max-w-md mx-auto flex flex-col gap-5 relative pl-6 border-l border-[#C5A265]/40 text-left my-3">
                  {storyParagraphs.map((para, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[33px] top-1 w-4.5 h-4.5 rounded-full border border-[#C5A265] bg-[#FAF8F5] flex items-center justify-center text-[11px] font-serif font-bold text-[#8C6B28]">
                        {romanNumerals[i] || i + 1}
                      </span>
                      <p
                        className="text-sm sm:text-base text-[#4A453E] leading-relaxed font-serif italic"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {para}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <blockquote
                  className="max-w-md mx-auto text-center font-serif italic text-sm sm:text-base text-[#4A453E] leading-relaxed my-2 px-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  «{storyParagraphs[0]}»
                </blockquote>
              )}
            </Reveal>
          </section>
        )}

        {/* ========================================================
            4. ДАТА И МЕСТО + КАРТЫ + КАЛЕНДАРЬ
        ======================================================== */}
        {isSectionVisible('dateVenue') && (
          <section className="w-full py-8 sm:py-12 flex flex-col items-center relative">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('dateVenue')}
                aria-label={t.hideSectionHint}
                className="absolute top-2 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full flex flex-col items-center">
              <div className="w-full max-w-lg bg-white/80 border border-[#C5A265]/35 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center gap-5">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold">
                  {t.dateAndPlace}
                </span>

                <div className="flex flex-col items-center gap-1">
                  <h3
                    className="font-serif text-xl sm:text-2xl text-[#2A2724] font-medium"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {venue}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57524A] max-w-xs">{address}</p>
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-2 gap-3 w-full border-y border-[#C5A265]/25 py-3">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[11px] uppercase tracking-wider text-[#787268] font-semibold">
                      {t.dateLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#2A2724] capitalize">
                      {formattedDateObj.full}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 border-l border-[#C5A265]/25">
                    <span className="text-[11px] uppercase tracking-wider text-[#787268] font-semibold">
                      {t.timeLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#2A2724]">
                      {time}
                    </span>
                  </div>
                </div>

                {/* Copy Address Button */}
                {address && (
                  <button
                    type="button"
                    onClick={() => copyAddress(address)}
                    aria-label={addressCopied ? t.addressCopied : t.copyAddress}
                    className="min-h-[44px] py-2 px-4 rounded-full border border-[#C5A265]/40 text-xs text-[#2A2724] font-medium flex items-center gap-2 hover:bg-[#FAF8F5] transition-colors"
                  >
                    {addressCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#8C6B28]" />
                    )}
                    <span>{addressCopied ? t.addressCopied : t.copyAddress}</span>
                  </button>
                )}

                {/* Map Buttons (Both Yandex & Google) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-1">
                  <a
                    href={getYandexMapsUrl(venue, address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] py-2.5 px-4 rounded-xl border border-[#C5A265]/40 bg-[#FAF8F5] text-xs font-semibold text-[#2A2724] hover:border-[#C5A265] flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <MapPin className="w-4 h-4 text-[#8C6B28]" />
                    <span>{t.openYandex}</span>
                  </a>
                  <a
                    href={getGoogleMapsUrl(venue, address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] py-2.5 px-4 rounded-xl border border-[#C5A265]/40 bg-[#FAF8F5] text-xs font-semibold text-[#2A2724] hover:border-[#C5A265] flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <Navigation className="w-4 h-4 text-[#8C6B28]" />
                    <span>{t.openGoogle}</span>
                  </a>
                </div>

                {/* Add to Calendar (Google + .ics download) */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 w-full pt-3 border-t border-[#C5A265]/20">
                  <a
                    href={getGoogleCalendarUrl(calendarEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] py-2 px-3.5 rounded-full border border-[#C5A265]/35 text-xs text-[#57524A] hover:text-[#2A2724] hover:border-[#C5A265] flex items-center gap-1.5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#8C6B28]" />
                    <span>{t.addToCalendar}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadIcs(calendarEvent)}
                    className="min-h-[44px] py-2 px-3.5 rounded-full border border-[#C5A265]/35 text-xs text-[#57524A] hover:text-[#2A2724] hover:border-[#C5A265] flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#8C6B28]" />
                    <span>{t.downloadIcs}</span>
                  </button>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* ========================================================
            5. ТАЙМЕР ОТСЧЕТА / COUNTDOWN
        ======================================================== */}
        {isSectionVisible('countdown') && (
          <section className="w-full py-8 sm:py-12 flex flex-col items-center text-center relative">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('countdown')}
                aria-label={t.hideSectionHint}
                className="absolute top-2 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full flex flex-col items-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold">
                {t.countdownTitle}
              </span>
              <MarmarDivider className="my-3" />

              {currentDifference.isPassed ? (
                <p className="font-serif italic text-base text-[#8C6B28]">{t.passed}</p>
              ) : (
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-md mx-auto">
                  {[
                    { label: t.days, val: currentDifference.days },
                    { label: t.hours, val: currentDifference.hours },
                    { label: t.minutes, val: currentDifference.minutes },
                    { label: t.seconds, val: currentDifference.seconds },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white/80 border border-[#C5A265]/35 rounded-xl p-3 flex flex-col items-center shadow-xs"
                    >
                      <span
                        className="font-serif text-2xl sm:text-3xl text-[#2A2724] font-medium tabular-nums"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {item.val}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-[#787268] font-semibold mt-1">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          </section>
        )}

        {/* ========================================================
            6. ПРОГРАММА ДНЯ / SCHEDULE TIMELINE
        ======================================================== */}
        {isSectionVisible('schedule') && scheduleItems.length > 0 && (
          <section className="w-full py-8 sm:py-12 flex flex-col items-center text-center relative">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('schedule')}
                aria-label={t.hideSectionHint}
                className="absolute top-2 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full flex flex-col items-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold">
                {t.programTitle}
              </span>
              <MarmarDivider className="my-3" />

              <div className="w-full max-w-md mx-auto flex flex-col gap-6 relative pl-7 sm:pl-8 border-l border-[#C5A265]/40 text-left my-3">
                {scheduleItems.map((item: any, i: number) => (
                  <div key={i} className="relative">
                    <span
                      className="absolute -left-[36px] sm:-left-[40px] top-1 px-2 py-0.5 rounded-full border border-[#C5A265] bg-[#FAF8F5] text-[11px] font-serif font-semibold text-[#8C6B28] shadow-xs"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {item.time}
                    </span>
                    <div className="flex flex-col pt-0.5">
                      <h4
                        className="font-serif text-base text-[#2A2724] font-medium"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {item.title || item.label}
                      </h4>
                      {item.desc && (
                        <p className="text-xs sm:text-sm text-[#57524A] mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* ========================================================
            7. ФОТОГАЛЕРЕЯ / MASONRY GALLERY (2 Columns)
        ======================================================== */}
        {isSectionVisible('gallery') && galleryPhotos.length > 0 && (
          <section className="w-full py-8 sm:py-12 flex flex-col items-center text-center relative">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('gallery')}
                aria-label={t.hideSectionHint}
                className="absolute top-2 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full flex flex-col items-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold">
                {t.galleryTitle}
              </span>
              <p className="text-xs text-[#57524A] mt-1">{t.gallerySubtitle}</p>
              <MarmarDivider className="my-3" />

              {/* 2-Column Masonry */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg mx-auto mt-2">
                <div className="flex flex-col gap-3 sm:gap-4">
                  {col1Photos.map((url, idx) => (
                    <button
                      key={`col1-${idx}`}
                      type="button"
                      onClick={() => setActiveModalPhoto(url)}
                      aria-label={`Open gallery photo ${idx * 2 + 1}`}
                      className={`w-full overflow-hidden rounded-2xl border border-[#C5A265]/35 shadow-xs cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#C5A265] bg-[#FAF8F5] ${
                        idx % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'
                      }`}
                    >
                      <img
                        src={getMediaUrl(url)}
                        alt={`Photo ${idx * 2 + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:gap-4">
                  {col2Photos.map((url, idx) => (
                    <button
                      key={`col2-${idx}`}
                      type="button"
                      onClick={() => setActiveModalPhoto(url)}
                      aria-label={`Open gallery photo ${idx * 2 + 2}`}
                      className={`w-full overflow-hidden rounded-2xl border border-[#C5A265]/35 shadow-xs cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#C5A265] bg-[#FAF8F5] ${
                        idx % 2 === 0 ? 'aspect-square' : 'aspect-[3/4]'
                      }`}
                    >
                      <img
                        src={getMediaUrl(url)}
                        alt={`Photo ${idx * 2 + 2}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* Photo Lightbox Modal */}
        <AnimatePresence>
          {activeModalPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalPhoto(null)}
              className="fixed inset-0 z-50 bg-[#181615]/95 flex items-center justify-center p-4 backdrop-blur-md"
              role="dialog"
              aria-modal="true"
              aria-label={t.closeLightbox}
            >
              <div
                className="relative max-w-lg w-full max-h-[85vh] rounded-2xl overflow-hidden border border-[#C5A265]/60 shadow-2xl bg-black"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={getMediaUrl(activeModalPhoto)}
                  alt="Enlarged view"
                  className="w-full h-full object-contain max-h-[85vh]"
                />
                <button
                  type="button"
                  onClick={() => setActiveModalPhoto(null)}
                  aria-label={t.closeLightbox}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 text-[#FAF7F2] hover:text-white flex items-center justify-center border border-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================
            8. ВИДЕО / VIDEO INVITATION
        ======================================================== */}
        {isSectionVisible('video') && data.videoUrl && (
          <section className="w-full py-8 sm:py-12 flex flex-col items-center text-center relative">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('video')}
                aria-label={t.hideSectionHint}
                className="absolute top-2 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full flex flex-col items-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold">
                {t.videoTitle}
              </span>
              <MarmarDivider className="my-3" />

              <div className="w-full max-w-lg aspect-video rounded-2xl overflow-hidden border border-[#C5A265]/35 shadow-sm bg-black relative">
                <video
                  src={getMediaUrl(data.videoUrl)}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          </section>
        )}

        {/* ========================================================
            9. ДРЕСС-КОД И ПАЛИТРА / DRESS CODE
        ======================================================== */}
        {isSectionVisible('dressCode') && dressColors.length > 0 && (
          <section className="w-full py-8 sm:py-12 flex flex-col items-center text-center relative">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('dressCode')}
                aria-label={t.hideSectionHint}
                className="absolute top-2 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full flex flex-col items-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold">
                {t.dressCodeTitle}
              </span>
              <p className="text-xs text-[#57524A] max-w-xs mt-1 leading-relaxed">
                {t.dressCodeSubtitle}
              </p>
              <MarmarDivider className="my-3" />

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-1">
                {dressColors.map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-10 h-10 rounded-full border border-[#C5A265]/50 shadow-xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs text-[#57524A] font-medium max-w-[80px] truncate">
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* ========================================================
            10. КАСТОМНЫЕ ПОЛЯ / CUSTOM FIELDS
        ======================================================== */}
        {customFields.length > 0 && (
          <section className="w-full py-4 flex flex-col items-center text-center">
            <Reveal className="w-full max-w-md flex flex-col gap-3">
              {customFields.map((field: CustomField) => (
                <div
                  key={field.id}
                  className="bg-white/80 border border-[#C5A265]/35 rounded-2xl p-4 flex flex-col items-center gap-1 shadow-xs"
                >
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C6B28]">
                    {field.label}
                  </span>
                  <span className="text-xs sm:text-sm text-[#4A453E]">
                    {data[field.id] || field.placeholder}
                  </span>
                </div>
              ))}
            </Reveal>
          </section>
        )}

        {/* ========================================================
            11. RSVP / АНКЕТА ГОСТЕЙ
        ======================================================== */}
        {isSectionVisible('rsvp') && (
          <section className="w-full py-8 sm:py-12 flex flex-col items-center relative">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('rsvp')}
                aria-label={t.hideSectionHint}
                className="absolute top-2 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full flex flex-col items-center">
              <div className="w-full max-w-md bg-white/85 border border-[#C5A265]/35 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-5 text-left">
                <div className="text-center flex flex-col items-center">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold">
                    {t.rsvpTitle}
                  </span>
                  <p className="text-xs text-[#57524A] mt-1">{t.rsvpSubtitle}</p>
                </div>

                {rsvpState && rsvpState.isSuccess ? (
                  <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-5 text-center flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-950">
                      {t.thankYouRsvp}
                    </span>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      if (rsvpState) {
                        rsvpState.onSubmit(e);
                      } else {
                        e.preventDefault();
                      }
                    }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label
                        htmlFor="marmar-rsvp-name"
                        className="text-[11px] uppercase font-semibold text-[#57524A] block mb-1.5"
                      >
                        {t.yourName}
                      </label>
                      <input
                        id="marmar-rsvp-name"
                        type="text"
                        required
                        value={rsvpState ? rsvpState.name : ''}
                        onChange={(e) => rsvpState && rsvpState.setName(e.target.value)}
                        placeholder={t.yourNamePlaceholder}
                        className="w-full bg-[#FAF8F5] border border-[#C5A265]/40 rounded-xl px-3.5 py-2.5 text-xs text-[#2A2724] focus:outline-none focus:border-[#C5A265] focus:ring-1 focus:ring-[#C5A265]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase font-semibold text-[#57524A] block mb-1.5">
                        {t.willAttend}
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => rsvpState && rsvpState.setAttending(true)}
                          className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                            rsvpState?.attending === true
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-1 ring-emerald-400'
                              : 'bg-[#FAF8F5] border-[#C5A265]/40 text-[#57524A] hover:border-[#C5A265]'
                          }`}
                        >
                          {t.yes}
                        </button>
                        <button
                          type="button"
                          onClick={() => rsvpState && rsvpState.setAttending(false)}
                          className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                            rsvpState?.attending === false
                              ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs ring-1 ring-rose-400'
                              : 'bg-[#FAF8F5] border-[#C5A265]/40 text-[#57524A] hover:border-[#C5A265]'
                          }`}
                        >
                          {t.no}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="marmar-rsvp-wishes"
                        className="text-[11px] uppercase font-semibold text-[#57524A] block mb-1.5"
                      >
                        {t.wishesPlaceholder}
                      </label>
                      <textarea
                        id="marmar-rsvp-wishes"
                        rows={3}
                        value={rsvpState ? rsvpState.wishes : ''}
                        onChange={(e) => rsvpState && rsvpState.setWishes(e.target.value)}
                        placeholder={t.wishesPlaceholder}
                        className="w-full bg-[#FAF8F5] border border-[#C5A265]/40 rounded-xl px-3.5 py-2.5 text-xs text-[#2A2724] focus:outline-none focus:border-[#C5A265] focus:ring-1 focus:ring-[#C5A265]"
                      />
                    </div>

                    <PrivacyConsentCheckbox lang={currentLang} />

                    <button
                      type="submit"
                      disabled={!rsvpState || rsvpState.isSubmitting || rsvpState.attending === null}
                      className="min-h-[44px] w-full py-3 bg-[#2A2724] hover:bg-[#3D3833] text-[#FAF8F5] font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors border border-[#C5A265]/40 disabled:opacity-50 cursor-pointer"
                    >
                      {rsvpState?.isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#C5A265]" />
                          <span>{t.sending}</span>
                        </>
                      ) : (
                        <span>{t.sendRsvp}</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </section>
        )}

        {/* ========================================================
            12. ПОДАРКИ И КАРТА / GIFT CARD
        ======================================================== */}
        {isSectionVisible('giftCard') && displayCardNumber && (
          <section className="w-full py-8 sm:py-12 flex flex-col items-center text-center relative">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('giftCard')}
                aria-label={t.hideSectionHint}
                className="absolute top-2 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full flex flex-col items-center">
              <div className="w-full max-w-md bg-white/85 border border-[#C5A265]/35 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center gap-3">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C6B28] font-semibold">
                  {t.giftTitle}
                </span>
                <p className="text-xs text-[#57524A] max-w-xs leading-relaxed">{t.giftSubtitle}</p>

                <div className="w-full bg-[#FAF8F5] border border-[#C5A265]/40 rounded-xl p-4 flex flex-col items-center gap-2 mt-2">
                  {!hasGiftCard && isPreview && (
                    <span className="text-[11px] uppercase tracking-wider text-[#8C6B28] font-semibold">
                      {t.giftCardExampleLabel}
                    </span>
                  )}

                  <span className="text-base sm:text-lg font-mono font-bold tracking-wider text-[#2A2724]">
                    {displayCardNumber}
                  </span>

                  {data.giftCardOwner && (
                    <span className="text-xs text-[#57524A]">
                      {t.cardOwner}: {data.giftCardOwner}
                    </span>
                  )}

                  {hasGiftCard && (
                    <button
                      type="button"
                      onClick={() => copyCard(data.giftCardNumber || '')}
                      aria-label={cardCopied ? t.copiedText : t.copyCard}
                      className="min-h-[44px] mt-1 py-2 px-4 bg-white border border-[#C5A265]/40 rounded-lg text-xs font-semibold text-[#2A2724] flex items-center gap-2 hover:bg-[#FAF8F5] transition-all shadow-xs"
                    >
                      {cardCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#8C6B28]" />
                      )}
                      <span>{cardCopied ? t.copiedText : t.copyCard}</span>
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* ========================================================
            13. БЛОК «ЛАЙК + ТЕЛЕФОН»
        ======================================================== */}
        {isSectionVisible('phone') && (
          <section className="w-full py-8 sm:py-12 flex flex-col items-center text-center relative">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('phone')}
                aria-label={t.hideSectionHint}
                className="absolute top-2 right-0 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A265]/40 text-[#787268] hover:text-[#2A2724] flex items-center justify-center shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Reveal className="w-full max-w-md bg-white/80 border border-[#C5A265]/35 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3">
              {/* Modest Heart button with counter (no confetti) */}
              <button
                type="button"
                onClick={handleLike}
                aria-label={t.loveButton}
                className={`min-h-[44px] flex items-center gap-2.5 px-6 py-2.5 rounded-full border shadow-xs transition-all ${
                  hasLiked
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-[#C5A265]/40 text-[#57524A] hover:border-[#C5A265] hover:text-rose-500'
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    hasLiked ? 'fill-rose-500 text-rose-500' : 'text-[#8C6B28]'
                  }`}
                />
                <span className="font-serif text-sm font-semibold text-[#2A2724]">
                  {guestLikes}
                </span>
              </button>

              <span className="text-xs text-[#787268] italic">{t.likesCount}</span>

              {/* Clickable Phone Number */}
              {phoneNumber && (
                <div className="w-full pt-4 border-t border-[#C5A265]/25 flex items-center justify-center gap-2 text-xs text-[#57524A] mt-1">
                  <Phone className="w-3.5 h-3.5 text-[#8C6B28]" />
                  <span>{t.phoneLabel}:</span>
                  <a
                    href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                    className="font-semibold text-[#2A2724] hover:text-[#8C6B28] underline underline-offset-4"
                  >
                    {phoneNumber}
                  </a>
                </div>
              )}
            </Reveal>
          </section>
        )}

        {/* ========================================================
            14. ПОДВАЛ-ПОДПИСЬ / FOOTER SIGNATURE
        ======================================================== */}
        <footer className="w-full pt-6 pb-12 flex flex-col items-center gap-1 select-none text-center">
          <p
            className="text-base sm:text-lg font-serif text-[#2A2724]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {brideName ? `${groomName} & ${brideName}` : groomName}
          </p>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#787268]">
            {formattedDateObj.year}
          </p>
        </footer>
      </main>
    </div>
  );
};
