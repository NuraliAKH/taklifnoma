import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VolumeX,
  Copy,
  Check,
  Navigation,
  MapPin,
  Calendar,
  Clock,
  X,
  Globe,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Download,
  Loader2,
  Maximize2,
  CalendarPlus,
} from 'lucide-react';
import type { WebsiteTemplateProps } from './types';
import { useCountdownTimer } from '../../utils/timer';
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
// TYPOGRAPHY HELPERS
// ==========================================
const SERIF_FONT = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const SANS_FONT = "'Montserrat', system-ui, -apple-system, sans-serif";

// ==========================================
// 1. SVG: POMEGRANATE MARK (Vector, 1.5px Gold Stroke)
// ==========================================
export const PomegranateMark: React.FC<{
  className?: string;
  strokeWidth?: number;
  animated?: boolean;
}> = ({ className = 'w-16 h-16 text-[#D4AF37]', strokeWidth = 1.5, animated = true }) => {
  const calm = useCalmMotion();
  const shouldAnimate = animated && !calm;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Crown / Calyx (chaqaloq) at top: flared pointed sepals */}
      <motion.path
        d="M 34 29 C 32 23 28 17 25 15 C 31 18 36 22 39 23 C 41 18 43 12 45 8 C 47 14 49 19 50 21 C 51 19 53 14 55 8 C 57 12 59 18 61 23 C 64 22 69 18 75 15 C 72 17 68 23 66 29"
        initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : false}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Fruit Body Outline */}
      <motion.path
        d="M 34 29 C 18 36 10 52 11 67 C 12 82 25 93 50 93 C 75 93 88 82 89 67 C 90 52 82 36 66 29"
        initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : false}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />
      {/* Calyx neck accent arc */}
      <motion.path
        d="M 37 30 Q 50 34 63 30"
        initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : false}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      />
      {/* Inner Seed Chamber Contour */}
      <motion.path
        d="M 38 38 C 24 48 23 66 32 77 C 39 84 61 84 68 77 C 77 66 76 48 62 38 Q 50 42 38 38 Z"
        strokeDasharray="3 3"
        initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : false}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.4 }}
      />
      {/* Central Rosette / Seed Core */}
      <motion.circle
        cx="50"
        cy="60"
        r="5"
        initial={shouldAnimate ? { scale: 0, opacity: 0 } : false}
        animate={shouldAnimate ? { scale: 1, opacity: 1 } : false}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      {/* Internal ruby seeds (geometric drop / diamond seed motifs) */}
      <motion.path
        d="M 50 52 C 48 48 48 43 50 40 C 52 43 52 48 50 52 Z"
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 1 } : false}
        transition={{ duration: 0.6, delay: 0.8 }}
      />
      <motion.path
        d="M 50 68 C 48 72 48 77 50 80 C 52 77 52 72 50 68 Z"
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 1 } : false}
        transition={{ duration: 0.6, delay: 0.85 }}
      />
      <motion.path
        d="M 44 56 C 39 53 35 51 32 52 C 34 56 38 58 43 57 Z"
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 1 } : false}
        transition={{ duration: 0.6, delay: 0.9 }}
      />
      <motion.path
        d="M 56 56 C 61 53 65 51 68 52 C 66 56 62 58 57 57 Z"
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 1 } : false}
        transition={{ duration: 0.6, delay: 0.95 }}
      />
      <motion.path
        d="M 44 64 C 40 67 36 70 33 70 C 34 66 38 63 43 63 Z"
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 1 } : false}
        transition={{ duration: 0.6, delay: 1.0 }}
      />
      <motion.path
        d="M 56 64 C 60 67 64 70 67 70 C 66 66 62 63 57 63 Z"
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 1 } : false}
        transition={{ duration: 0.6, delay: 1.05 }}
      />
    </svg>
  );
};

// ==========================================
// 2. SVG: SUZANI CORNER (Vector, 1.5px Gold Stroke)
// ==========================================
export const SuzaniCorner: React.FC<{
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  strokeWidth?: number;
}> = ({ className = 'w-16 h-16 text-[#D4AF37]', position = 'top-left', strokeWidth = 1.5 }) => {
  const rotationClass = {
    'top-left': '',
    'top-right': 'scale-x-[-1]',
    'bottom-left': 'scale-y-[-1]',
    'bottom-right': 'rotate-180',
  }[position];

  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${rotationClass}`}
      aria-hidden="true"
    >
      {/* Outer corner framing lines with scrolling finials */}
      <path d="M 6 56 L 6 16 C 6 10 10 6 16 6 L 56 6" />
      <path d="M 6 56 C 6 60 2 62 1 60 C 0 58 4 56 6 56" />
      <path d="M 56 6 C 60 6 62 2 60 1 C 58 0 56 4 56 6" />

      {/* Inner corner floral scroll */}
      <path d="M 14 42 L 14 20 C 14 16 16 14 20 14 L 42 14" opacity="0.6" strokeDasharray="2 2" />

      {/* Central Suzani flower medallion (blossom + radiant almond petals) */}
      <circle cx="28" cy="28" r="4.5" />
      {/* Petals radiating */}
      <path d="M 28 23 C 27 18 29 14 28 12 C 27 14 29 18 28 23 Z" />
      <path d="M 23 28 C 18 27 14 29 12 28 C 14 27 18 29 23 28 Z" />
      <path d="M 24 24 C 19 19 16 17 14 14 C 17 16 19 19 24 24 Z" />
      <path d="M 32 32 C 37 37 40 39 42 42 C 39 40 37 37 32 32 Z" />

      {/* Curling Suzani tendril branching toward horizontal edge */}
      <path d="M 33 26 C 44 24 53 18 60 10 C 65 16 58 22 48 24" />
      {/* Small leaf on horizontal vine */}
      <path d="M 47 18 C 50 14 54 13 56 14 C 54 17 50 18 47 18 Z" />

      {/* Curling Suzani tendril branching toward vertical edge */}
      <path d="M 26 33 C 24 44 18 53 10 60 C 16 65 22 58 24 48" />
      {/* Small leaf on vertical vine */}
      <path d="M 18 47 C 14 50 13 54 14 56 C 17 54 18 50 18 47 Z" />
    </svg>
  );
};

// ==========================================
// 3. SVG: SUZANI DIVIDER (Horizontal Separator)
// ==========================================
export const SuzaniDivider: React.FC<{
  className?: string;
  strokeWidth?: number;
}> = ({ className = 'w-48 h-6 text-[#D4AF37]', strokeWidth = 1.5 }) => {
  return (
    <svg
      viewBox="0 0 200 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Center Pomegranate blossom */}
      <circle cx="100" cy="12" r="3" />
      {/* Calyx top */}
      <path d="M 97 9 C 96 6 94 4 93 4 C 95 6 97 8 98 9" />
      <path d="M 100 9 L 100 3" />
      <path d="M 103 9 C 104 6 106 4 107 4 C 105 6 103 8 102 9" />
      {/* Left branch */}
      <path d="M 95 12 C 78 12 65 6 48 12 C 38 16 28 12 10 12" />
      <path d="M 68 10 C 66 6 62 5 60 6 C 62 9 66 10 68 10 Z" />
      <path d="M 36 14 C 38 18 42 19 44 18 C 42 15 38 14 36 14 Z" />
      <circle cx="10" cy="12" r="2" />
      {/* Right branch */}
      <path d="M 105 12 C 122 12 135 6 152 12 C 162 16 172 12 190 12" />
      <path d="M 132 10 C 134 6 138 5 140 6 C 138 9 134 10 132 10 Z" />
      <path d="M 164 14 C 162 18 158 19 156 18 C 158 15 162 14 164 14 Z" />
      <circle cx="190" cy="12" r="2" />
    </svg>
  );
};

// ==========================================
// 4. SVG: POMEGRANATE SEED DOT (Separator / Bullet)
// ==========================================
export const PomegranateSeedDot: React.FC<{
  className?: string;
}> = ({ className = 'w-3 h-3 text-[#9E1B32]' }) => (
  <svg
    viewBox="0 0 16 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    {/* Seed silhouette: organic droplet with soft facets */}
    <path d="M 8 1 C 5 2 2 7 2 12 C 2 16 4.5 19 8 19 C 11.5 19 14 16 14 12 C 14 7 11 2 8 1 Z" />
    {/* Facet highlight */}
    <path
      d="M 8 3 C 6 4 4 8 4 12 C 4 14 5 16 7 17 C 6 15 5.5 12 6.5 7 C 7 5 7.5 3.5 8 3 Z"
      fill="#F4A6B3"
      opacity="0.45"
    />
  </svg>
);

// ==========================================
// 5. SVG: SCALLOPED EDGE TRANSITION
// ==========================================
export const ScallopDivider: React.FC<{
  direction?: 'dark-to-cream' | 'cream-to-dark';
  className?: string;
}> = ({ direction = 'dark-to-cream', className = '' }) => {
  const isDarkToCream = direction === 'dark-to-cream';
  const fillColor = isDarkToCream ? '#FAF6F0' : '#2B0711';
  const bgColor = isDarkToCream ? '#2B0711' : '#FAF6F0';

  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none relative z-10 ${className}`}
      style={{ backgroundColor: bgColor }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 32"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-6 sm:h-8 block"
      >
        {/* Scalloped festoon arches: 12 arches across 1200 width */}
        <path
          d="
            M 0 0
            C 25 22 75 22 100 0
            C 125 22 175 22 200 0
            C 225 22 275 22 300 0
            C 325 22 375 22 400 0
            C 425 22 475 22 500 0
            C 525 22 575 22 600 0
            C 625 22 675 22 700 0
            C 725 22 775 22 800 0
            C 825 22 875 22 900 0
            C 925 22 975 22 1000 0
            C 1025 22 1075 22 1100 0
            C 1125 22 1175 22 1200 0
            L 1200 32
            L 0 32
            Z
          "
          fill={fillColor}
        />
        {/* Fine gold accent line tracing the scallop edge */}
        <path
          d="
            M 0 0
            C 25 22 75 22 100 0
            C 125 22 175 22 200 0
            C 225 22 275 22 300 0
            C 325 22 375 22 400 0
            C 425 22 475 22 500 0
            C 525 22 575 22 600 0
            C 625 22 675 22 700 0
            C 725 22 775 22 800 0
            C 825 22 875 22 900 0
            C 925 22 975 22 1000 0
            C 1025 22 1075 22 1100 0
            C 1125 22 1175 22 1200 0
          "
          stroke="#D4AF37"
          strokeWidth="1.2"
          opacity="0.75"
        />
      </svg>
    </div>
  );
};

// ==========================================
// 6. WOW DETAIL: POMEGRANATE SEEDS SCATTERING
// ==========================================
export const PomegranateSeedsWow: React.FC<{
  isPreview?: boolean;
}> = ({ isPreview }) => {
  const calm = useCalmMotion(isPreview);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (calm) return;
    const timer = window.setTimeout(() => {
      setDone(true);
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [calm]);

  if (calm || done) return null;

  // 12 ruby pomegranate seeds with organic offsets and rotations
  const seeds = [
    { id: 1, x: -70, y: 140, r: -45, scale: 1.1, delay: 0.1, duration: 2.3 },
    { id: 2, x: 80, y: 160, r: 60, scale: 0.9, delay: 0.15, duration: 2.4 },
    { id: 3, x: -120, y: 190, r: -80, scale: 1.2, delay: 0.2, duration: 2.6 },
    { id: 4, x: 130, y: 210, r: 75, scale: 1.0, delay: 0.25, duration: 2.5 },
    { id: 5, x: -30, y: 240, r: -25, scale: 0.85, delay: 0.3, duration: 2.7 },
    { id: 6, x: 40, y: 250, r: 35, scale: 1.15, delay: 0.2, duration: 2.6 },
    { id: 7, x: -90, y: 280, r: -110, scale: 1.0, delay: 0.35, duration: 2.8 },
    { id: 8, x: 100, y: 290, r: 95, scale: 0.95, delay: 0.4, duration: 2.8 },
    { id: 9, x: -150, y: 220, r: -65, scale: 1.05, delay: 0.18, duration: 2.5 },
    { id: 10, x: 160, y: 230, r: 50, scale: 0.8, delay: 0.28, duration: 2.6 },
    { id: 11, x: -10, y: 310, r: 15, scale: 1.2, delay: 0.45, duration: 2.9 },
    { id: 12, x: 20, y: 320, r: -30, scale: 0.9, delay: 0.5, duration: 3.0 },
  ];

  return (
    <div
      className="absolute top-32 left-1/2 -translate-x-1/2 pointer-events-none z-40 overflow-visible"
      aria-hidden="true"
    >
      {seeds.map((s) => (
        <motion.div
          key={s.id}
          initial={{ x: 0, y: 0, rotate: 0, scale: 0.4, opacity: 0.95 }}
          animate={{
            x: s.x,
            y: s.y,
            rotate: s.r,
            scale: s.scale,
            opacity: 0,
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="absolute -top-3 -left-3"
        >
          <svg viewBox="0 0 16 20" fill="none" className="w-5 h-6 drop-shadow-md">
            <path
              d="M 8 1 C 5 2 2 7 2 12 C 2 16 4.5 19 8 19 C 11.5 19 14 16 14 12 C 14 7 11 2 8 1 Z"
              fill="#9E1B32"
            />
            {/* Inner jewel facets */}
            <path
              d="M 8 3 C 6 4 4 8 4 12 C 4 14 5 16 7 17 C 6 15 5.5 12 6.5 7 C 7 5 7.5 3.5 8 3 Z"
              fill="#E5395A"
              opacity="0.6"
            />
            {/* Golden glint */}
            <circle cx="9" cy="6" r="1" fill="#FFD580" opacity="0.8" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

// ==========================================
// 7. TRANSLATIONS (All UI Text via object)
// ==========================================
const TRANSLATIONS = {
  uz: {
    invitationTitle: 'Nikoh toʻyi taklifnomasi',
    welcomeText:
      'Muhtaram mehmonimiz! Sizni aziz farzandlarimizning baxt toʻyiga, quvonchli oqshomimizga lutfan taklif etamiz!',
    openEnvelopeBtn: 'Taklifnomani ochish',
    ourStoryTitle: 'Muhabbat tarixi',
    dateAndPlace: 'Sana va manzil',
    dateLabel: 'Sana',
    timeLabel: 'Vaqt',
    venueLabel: 'Toʻyxona',
    addressLabel: 'Manzil',
    openYandex: 'Yandex Xarita',
    openGoogle: 'Google Maps',
    copyAddress: 'Manzilni nusxalash',
    copiedText: 'Nusxalandi!',
    addToCalendar: 'Taqvimga qoʻshish',
    googleCalendar: 'Google Calendar',
    downloadIcs: 'iCal (.ics) yuklab olish',
    countdownTitle: 'Toʻygacha qolgan vaqt',
    days: 'kun',
    hours: 'soat',
    minutes: 'daqiqa',
    seconds: 'soniya',
    passed: 'Toʻy tantanasi boshlandi!',
    programTitle: 'Toʻy dasturi',
    programSubtitle: 'Ushbu unutilmas oqshom rejasi',
    dressCodeTitle: 'Dress-kod va ranglar',
    dressCodeSubtitle: 'Kechamiz goʻzalligi uchun quyidagi ranglarda libos tanlasangiz, minnatdor boʻlamiz:',
    dressCodeTip: 'Rang ustiga bosib, tavsifini oʻqing',
    galleryTitle: 'Suratlar galereyasi',
    gallerySubtitle: 'Hayotimizning eng goʻzal va samimiy lahzalari',
    rsvpTitle: 'Tashrifni tasdiqlash',
    rsvpSubtitle: 'Iltimos, quvonchimizga sherik boʻlishingizni oldindan tasdiqlang',
    yourName: 'Ismingiz va familiyangiz',
    namePlaceholder: 'Ismingizni kiriting...',
    willAttend: 'Toʻyga tashrif buyurasizmi?',
    yes: 'Ha, albatta boraman',
    no: 'Afsuski, bora olmayman',
    wishesPlaceholder: 'Yoshlarga eng ezgu tilaklaringiz...',
    sendRsvp: 'Javobni yuborish',
    sending: 'Yuborilmoqda...',
    thankYouRsvp: 'Javobingiz qabul qilindi, tashakkur!',
    giftTitle: 'Toʻyona va sovgʻalar',
    giftSubtitle: 'Sizning tashrifingiz va duolaringiz — biz uchun eng oliy mukofot!',
    giftCardHint: 'Yosh oilamizga toʻyona yoʻllamoqchi boʻlganlar uchun:',
    copyCard: 'Karta raqamini nusxalash',
    cardOwner: 'Karta egasi',
    cardExampleBadge: 'Namuna karta',
    sectionsManager: 'Sayt boʻlimlari',
    restoreAll: 'Barcha boʻlimlarni koʻrsatish',
    hideSectionHint: 'Boʻlimni yashirish',
    close: 'Yopish',
    audioPlay: 'Musiqani yoqish',
    audioPause: 'Musiqani oʻchirish',
    videoTitle: 'Video taklifnoma',
    footerBlessing: 'Baxt, totuvlik va toʻkinlik hamrohingiz boʻlsin!',
    sections: {
      hero: 'Bosh sahifa',
      photo: 'Bosh surat',
      video: 'Video taklifnoma',
      loveStory: 'Muhabbat tarixi',
      dateVenue: 'Sana va manzil',
      countdown: 'Ortga hisoblash',
      schedule: 'Toʻy dasturi',
      gallery: 'Suratlar galereyasi',
      dressCode: 'Dress-kod',
      rsvp: 'Tashrif anketasi',
      giftCard: 'Sovgʻalar va karta',
    },
    colors: [
      { name: 'Anor qizili', hex: '#7A1B2E', desc: 'Chuqur yoqut tusidagi anor rangi — fayz va toʻkinlik ramzi' },
      { name: 'Shohona oltin', hex: '#C5A059', desc: 'Sharqona nozik zarhal jilo — yorqin kelajak va baxt' },
      { name: 'Toʻq bordo', hex: '#420D1A', desc: 'Hashamatli baxmal sharob rangi — ehtirom va ulugʻvorlik' },
      { name: 'Qaymoqrang', hex: '#F8F3EA', desc: 'Mayin ipak va fil suyagi tusi — poklik va samimiyat' },
      { name: 'Zumrad', hex: '#1E4231', desc: 'Baxmal zumrad tusi — uygʻunlik va oilaviy osoyishtalik' },
    ],
  },
  ru: {
    invitationTitle: 'Свадебное приглашение',
    welcomeText:
      'Дорогие и близкие! С огромной радостью приглашаем вас разделить с нами счастье создания новой семьи!',
    openEnvelopeBtn: 'Открыть приглашение',
    ourStoryTitle: 'История любви',
    dateAndPlace: 'Дата и место торжества',
    dateLabel: 'Дата',
    timeLabel: 'Время',
    venueLabel: 'Банкетный зал',
    addressLabel: 'Адрес',
    openYandex: 'Яндекс Карты',
    openGoogle: 'Google Карты',
    copyAddress: 'Скопировать адрес',
    copiedText: 'Скопировано!',
    addToCalendar: 'Добавить в календарь',
    googleCalendar: 'Google Календарь',
    downloadIcs: 'Скачать iCal (.ics)',
    countdownTitle: 'До торжества осталось',
    days: 'дней',
    hours: 'часов',
    minutes: 'минут',
    seconds: 'секунд',
    passed: 'Свадебное торжество началось!',
    programTitle: 'Программа дня',
    programSubtitle: 'Тайминг нашего праздничного вечера',
    dressCodeTitle: 'Дресс-код и палитра',
    dressCodeSubtitle: 'Будем искренне признательны, если вы поддержите цветовую гамму торжества:',
    dressCodeTip: 'Нажмите на цвет, чтобы увидеть описание',
    galleryTitle: 'Фотогалерея',
    gallerySubtitle: 'Самые тёплые и памятные моменты нашей истории',
    rsvpTitle: 'Подтверждение присутствия',
    rsvpSubtitle: 'Пожалуйста, подтвердите ваше участие, чтобы мы могли позаботиться о вашем комфорте',
    yourName: 'Ваше имя и фамилия',
    namePlaceholder: 'Введите ваше имя...',
    willAttend: 'Сможете ли вы прийти?',
    yes: 'Да, обязательно буду',
    no: 'К сожалению, не смогу',
    wishesPlaceholder: 'Ваши тёплые пожелания молодожёнам...',
    sendRsvp: 'Отправить ответ',
    sending: 'Отправка...',
    thankYouRsvp: 'Спасибо! Ваш ответ успешно отправлен',
    giftTitle: 'Подарки и пожелания',
    giftSubtitle: 'Главный подарок для нас — ваше присутствие и тёплые улыбки!',
    giftCardHint: 'Для тех, кто хочет поздравить молодую семью безналично:',
    copyCard: 'Скопировать номер карты',
    cardOwner: 'Получатель',
    cardExampleBadge: 'Пример карты',
    sectionsManager: 'Разделы сайта',
    restoreAll: 'Показать все разделы',
    hideSectionHint: 'Скрыть раздел',
    close: 'Закрыть',
    audioPlay: 'Включить музыку',
    audioPause: 'Выключить музыку',
    videoTitle: 'Видео-приглашение',
    footerBlessing: 'Пусть в каждом доме царят любовь, мир и изобилие!',
    sections: {
      hero: 'Главная карточка',
      photo: 'Главное фото',
      video: 'Видео-приглашение',
      loveStory: 'История любви',
      dateVenue: 'Дата и место',
      countdown: 'Таймер отсчета',
      schedule: 'Программа дня',
      gallery: 'Фотогалерея',
      dressCode: 'Дресс-код',
      rsvp: 'Анкета гостей',
      giftCard: 'Подарки и карта',
    },
    colors: [
      { name: 'Рубиновый гранат', hex: '#7A1B2E', desc: 'Глубокий оттенок спелого граната — символ изобилия и крепкой семьи' },
      { name: 'Восточное золото', hex: '#C5A059', desc: 'Благородное сияние золота — знак тепла, радости и процветания' },
      { name: 'Тёмный бордо', hex: '#420D1A', desc: 'Насыщенный бархатный винный тон — глубина чувств и благородство' },
      { name: 'Сливочный крем', hex: '#F8F3EA', desc: 'Нежный шёлк и айвори — лёгкость, чистота и утончённость' },
      { name: 'Бархатный изумруд', hex: '#1E4231', desc: 'Глубокий изумрудный тон — гармония, свежесть и вечная любовь' },
    ],
  },
  en: {
    invitationTitle: 'Wedding Invitation',
    welcomeText:
      'Dear family and friends! We joyfully invite you to celebrate the beginning of our married life together!',
    openEnvelopeBtn: 'Open Invitation',
    ourStoryTitle: 'Our Love Story',
    dateAndPlace: 'Date & Location',
    dateLabel: 'Date',
    timeLabel: 'Time',
    venueLabel: 'Grand Ballroom',
    addressLabel: 'Address',
    openYandex: 'Yandex Maps',
    openGoogle: 'Google Maps',
    copyAddress: 'Copy Address',
    copiedText: 'Copied!',
    addToCalendar: 'Add to Calendar',
    googleCalendar: 'Google Calendar',
    downloadIcs: 'Download iCal (.ics)',
    countdownTitle: 'Countdown to Ceremony',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    passed: 'The wedding has begun!',
    programTitle: 'Wedding Program',
    programSubtitle: 'Schedule of our special day',
    dressCodeTitle: 'Dress Code & Palette',
    dressCodeSubtitle: 'We would appreciate if you join our festive color palette:',
    dressCodeTip: 'Tap on a color to see its meaning',
    galleryTitle: 'Photo Gallery',
    gallerySubtitle: 'Memorable moments on our journey together',
    rsvpTitle: 'RSVP Confirmation',
    rsvpSubtitle: 'Please let us know if you can join our celebration',
    yourName: 'Your Full Name',
    namePlaceholder: 'Enter your name...',
    willAttend: 'Will you attend?',
    yes: 'Yes, I will be there',
    no: 'Regretfully decline',
    wishesPlaceholder: 'Your warm wishes for the couple...',
    sendRsvp: 'Submit RSVP',
    sending: 'Sending...',
    thankYouRsvp: 'Thank you! Your response has been received',
    giftTitle: 'Wedding Gifts',
    giftSubtitle: 'Your warm presence and smiles are the greatest gift of all!',
    giftCardHint: 'For guests wishing to send a monetary gift:',
    copyCard: 'Copy Card Number',
    cardOwner: 'Cardholder',
    cardExampleBadge: 'Sample Card',
    sectionsManager: 'Manage Sections',
    restoreAll: 'Show All Sections',
    hideSectionHint: 'Hide Section',
    close: 'Close',
    audioPlay: 'Play Music',
    audioPause: 'Pause Music',
    videoTitle: 'Video Invitation',
    footerBlessing: 'Wishing you abundant love, joy, and peace!',
    sections: {
      hero: 'Cover Card',
      photo: 'Main Photo',
      video: 'Video Invitation',
      loveStory: 'Love Story',
      dateVenue: 'Date & Venue',
      countdown: 'Countdown Timer',
      schedule: 'Program Schedule',
      gallery: 'Photo Gallery',
      dressCode: 'Dress Code',
      rsvp: 'RSVP Form',
      giftCard: 'Gifts & Card',
    },
    colors: [
      { name: 'Ruby Pomegranate', hex: '#7A1B2E', desc: 'Deep garnet ruby — symbol of abundance and family blessing' },
      { name: 'Oriental Gold', hex: '#C5A059', desc: 'Refined warm gold — warmth, happiness and prosperity' },
      { name: 'Deep Burgundy', hex: '#420D1A', desc: 'Velvety dark wine — elegance and deep affection' },
      { name: 'Cream Ivory', hex: '#F8F3EA', desc: 'Delicate silk and ivory — purity, lightness and grace' },
      { name: 'Velvet Emerald', hex: '#1E4231', desc: 'Rich emerald green — harmony, renewal and serenity' },
    ],
  },
};

// ==========================================
// 8. MAIN TEMPLATE COMPONENT
// ==========================================
export const AnorWeddingSite: React.FC<WebsiteTemplateProps> = ({
  data,
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
  const [showSectionManager, setShowSectionManager] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<number | null>(0);
  const [activeModalPhoto, setActiveModalPhoto] = useState<string | null>(null);

  const { copied: cardCopied, copy: copyCard } = useCopyToClipboard();
  const { copied: addressCopied, copy: copyAddress } = useCopyToClipboard();

  const rsvpNameId = useId();
  const rsvpWishesId = useId();

  // Sync language with incoming prop
  useEffect(() => {
    if (lang) {
      setCurrentLang(lang);
    }
  }, [lang]);

  // Sync hidden sections with incoming data
  useEffect(() => {
    if (data.hiddenSections) {
      setHiddenSections(data.hiddenSections);
    }
  }, [data.hiddenSections]);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ru;
  const demo = getDemoContent(currentLang);

  // Resolved Content values with clean fallbacks
  const groomName = data.groomName?.trim() || demo.groomName;
  const brideName = data.brideName?.trim() || demo.brideName;
  const dateStr = data.date?.trim() || '2026-09-20';
  const timeStr = data.time?.trim() || '18:00';
  const venue = data.venue?.trim() || demo.venue;
  const address = data.address?.trim() || demo.address;
  const loveStory = data.loveStory?.trim() || (isPreview ? demo.loveStory : '');

  // Formatted date
  const dateFormatted = formatEventDate(dateStr, currentLang);

  // Countdown timer hook
  const currentDifference = useCountdownTimer(dateStr, timeStr, timeLeft);

  // Section visibility predicate
  const isSectionVisibleBase = createSectionVisibility(hiddenSections);
  const isSectionVisible = (id: string): boolean => {
    if (!isSectionVisibleBase(id)) return false;
    // Data presence rules for live guest mode
    if (id === 'video') return Boolean(data.videoUrl) || Boolean(isPreview);
    if (id === 'loveStory') return Boolean(data.loveStory?.trim()) || Boolean(isPreview);
    if (id === 'giftCard') return Boolean(data.giftCardNumber?.trim()) || Boolean(isPreview);
    if (id === 'gallery') {
      const hasPhotos = Array.isArray(data.photos) && data.photos.length > 0;
      return hasPhotos || Boolean(isPreview);
    }
    return true;
  };

  const toggleHideSection = (sectionKey: string) => {
    setHiddenSections((prev) => {
      const updated = prev.includes(sectionKey)
        ? prev.filter((k) => k !== sectionKey)
        : [...prev, sectionKey];
      return updated;
    });
    if (onToggleSection) onToggleSection(sectionKey);
  };

  const changeLanguage = (newLang: 'ru' | 'uz' | 'en') => {
    setCurrentLang(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
  };

  // Keyboard listener for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalPhoto(null);
    };
    if (activeModalPhoto) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalPhoto]);

  // Gallery photos
  const galleryPhotos: string[] =
    Array.isArray(data.photos) && data.photos.length > 0
      ? data.photos.map((p) => getMediaUrl(p))
      : isPreview
      ? [
          getMediaUrl('/olive-editorial-hero.webp'),
          getMediaUrl('/olive-editorial-details.webp'),
          getMediaUrl('/olive-editorial-venue.webp'),
          getMediaUrl('/wedding_doves.webp'),
        ]
      : [];

  // Hero photo
  const heroPhotoUrl = data.photoUrl
    ? getMediaUrl(data.photoUrl)
    : isPreview
    ? getMediaUrl('/olive-editorial-hero.webp')
    : '';

  // Calendar Event construction
  const calendarEventDate = (() => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const [h, min] = timeStr.split(':').map(Number);
      return new Date(y, (m || 1) - 1, d || 1, h || 18, min || 0);
    } catch {
      return new Date();
    }
  })();

  const calendarPayload = {
    title: `${groomName} & ${brideName} — ${t.invitationTitle}`,
    start: calendarEventDate,
    durationMinutes: 240,
    location: `${venue}, ${address}`,
    description: t.welcomeText,
  };

  // Schedule items
  const scheduleList =
    Array.isArray(data.schedule) && data.schedule.length > 0
      ? data.schedule
      : Array.isArray(data.scheduleItems) && data.scheduleItems.length > 0
      ? data.scheduleItems
      : isPreview
      ? demo.schedule
      : [];

  // Section manager list: Exactly the 11 IDs for 'anor'
  const ANOR_SECTIONS: Array<{ id: keyof typeof t.sections; key: string }> = [
    { id: 'hero', key: 'hero' },
    { id: 'photo', key: 'photo' },
    { id: 'video', key: 'video' },
    { id: 'loveStory', key: 'loveStory' },
    { id: 'dateVenue', key: 'dateVenue' },
    { id: 'countdown', key: 'countdown' },
    { id: 'schedule', key: 'schedule' },
    { id: 'gallery', key: 'gallery' },
    { id: 'dressCode', key: 'dressCode' },
    { id: 'rsvp', key: 'rsvp' },
    { id: 'giftCard', key: 'giftCard' },
  ];

  // ==========================================
  // ENVELOPE / COVER SCREEN (Unopened State)
  // ==========================================
  if (!isOpened) {
    return (
      <div
        className={`${
          isPreview ? 'h-full min-h-full p-4' : 'min-h-[100dvh] p-4 sm:p-6'
        } w-full bg-[#2B0711] text-[#FDF8F0] flex flex-col items-center justify-center relative overflow-hidden select-none`}
        style={{ fontFamily: SANS_FONT }}
      >
        {/* Subtle velvet texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#350A16] via-[#2B0711] to-[#1E040B] opacity-90 pointer-events-none" />

        {/* Floating Language Switcher in Envelope screen */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-1 bg-[#1E040B]/90 border border-[#D4AF37]/40 p-1 rounded-full shadow-lg backdrop-blur-md">
          <Globe className="w-3.5 h-3.5 text-[#D4AF37] ml-1.5" aria-hidden="true" />
          {(['ru', 'uz', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => changeLanguage(l)}
              aria-label={`Tilni tanlash: ${l.toUpperCase()}`}
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                currentLang === l
                  ? 'bg-[#7A1B2E] text-[#FDF8F0] shadow-sm'
                  : 'text-[#E6C29E] hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Card Frame */}
        <div className="w-full max-w-sm bg-[#320814] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-5 relative text-center z-10">
          {/* Suzani corners in card */}
          <SuzaniCorner
            position="top-left"
            className="absolute top-2 left-2 w-12 h-12 text-[#D4AF37]/60 pointer-events-none"
          />
          <SuzaniCorner
            position="top-right"
            className="absolute top-2 right-2 w-12 h-12 text-[#D4AF37]/60 pointer-events-none"
          />
          <SuzaniCorner
            position="bottom-left"
            className="absolute bottom-2 left-2 w-12 h-12 text-[#D4AF37]/60 pointer-events-none"
          />
          <SuzaniCorner
            position="bottom-right"
            className="absolute bottom-2 right-2 w-12 h-12 text-[#D4AF37]/60 pointer-events-none"
          />

          {/* Golden Pomegranate Wax Seal / Emblem */}
          <div className="w-20 h-20 rounded-full bg-[#1E040B] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-xl relative mt-2">
            <PomegranateMark className="w-12 h-12 text-[#D4AF37]" animated={false} />
          </div>

          <span
            className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold"
            style={{ fontFamily: SANS_FONT }}
          >
            {t.invitationTitle}
          </span>

          <div className="flex flex-col items-center gap-1">
            <h1
              className="text-3xl sm:text-4xl text-[#FDF8F0] tracking-wide font-normal leading-tight"
              style={{ fontFamily: SERIF_FONT, fontWeight: 600 }}
            >
              {groomName}
            </h1>
            <span
              className="text-[#D4AF37] text-2xl italic leading-none my-0.5"
              style={{ fontFamily: SERIF_FONT }}
            >
              &
            </span>
            <h1
              className="text-3xl sm:text-4xl text-[#FDF8F0] tracking-wide font-normal leading-tight"
              style={{ fontFamily: SERIF_FONT, fontWeight: 600 }}
            >
              {brideName}
            </h1>
          </div>

          <p
            className="text-xs sm:text-[13px] text-[#F3E5D8]/85 italic leading-relaxed px-2"
            style={{ fontFamily: SERIF_FONT }}
          >
            «{t.welcomeText}»
          </p>

          <button
            type="button"
            onClick={onOpenEnvelope}
            className="w-full min-h-[48px] py-3 px-6 bg-gradient-to-r from-[#5E1224] via-[#7A1B2E] to-[#5E1224] hover:from-[#7A1B2E] hover:to-[#5E1224] text-[#FDF8F0] font-semibold rounded-2xl text-xs uppercase tracking-widest border border-[#D4AF37]/50 shadow-lg active:scale-95 transition-all mt-2 cursor-pointer"
          >
            {t.openEnvelopeBtn}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN INVITATION SITE (Opened State)
  // ==========================================
  const containerClasses = isPreview
    ? 'w-full h-full overflow-y-auto bg-[#2B0711] text-[#2E0711] select-none scrollbar-thin relative'
    : 'min-h-[100dvh] w-full bg-[#2B0711] text-[#2E0711] flex flex-col items-center select-none relative overflow-x-hidden';

  const innerClasses = 'w-full max-w-lg mx-auto flex flex-col relative z-20';

  return (
    <div className={containerClasses} style={{ fontFamily: SANS_FONT }}>
      {/* Detail "Wow": Softly scattering pomegranate seeds once on open */}
      <PomegranateSeedsWow isPreview={isPreview} />

      {/* FLOATING CONTROLS (Top Bar) */}
      <div className="fixed top-3 left-3 right-3 z-50 flex items-center justify-between pointer-events-none max-w-lg mx-auto">
        {/* Language switcher */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#1E040B]/90 border border-[#D4AF37]/50 p-1 rounded-full shadow-xl backdrop-blur-md">
          <Globe className="w-3.5 h-3.5 text-[#D4AF37] ml-1.5" aria-hidden="true" />
          {(['ru', 'uz', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => changeLanguage(l)}
              aria-label={`Tilni tanlash: ${l.toUpperCase()}`}
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                currentLang === l
                  ? 'bg-[#7A1B2E] text-[#FDF8F0] shadow-sm'
                  : 'text-[#E6C29E] hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {isPreview && (
            <button
              type="button"
              onClick={() => setShowSectionManager(!showSectionManager)}
              aria-label={t.sectionsManager}
              title={t.sectionsManager}
              className="w-11 h-11 rounded-full bg-[#1E040B]/90 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-[#320814] transition-all relative cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
              {hiddenSections.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#7A1B2E] text-white text-[11px] font-bold flex items-center justify-center border border-white/40">
                  {hiddenSections.length}
                </span>
              )}
            </button>
          )}

          {onToggleAudio && (
            <button
              type="button"
              onClick={onToggleAudio}
              aria-label={isPlaying ? t.audioPause : t.audioPlay}
              className="w-11 h-11 rounded-full bg-[#1E040B]/90 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-[#320814] transition-all cursor-pointer"
            >
              {isPlaying ? (
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  <span className="w-1 h-3 bg-[#D4AF37] rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-[#F2D89A] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-2.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              ) : (
                <VolumeX className="w-4 h-4 text-[#D4AF37]/75" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* SECTION MANAGER MODAL (Preview Mode Only) */}
      <AnimatePresence>
        {isPreview && showSectionManager && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="dialog"
            aria-modal="true"
            aria-label={t.sectionsManager}
            className="fixed top-16 right-3 left-3 max-w-sm mx-auto z-50 bg-[#1E040B]/95 border border-[#D4AF37]/70 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-[#FDF8F0] flex flex-col gap-3"
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                {t.sectionsManager}
              </span>
              <button
                type="button"
                onClick={() => setShowSectionManager(false)}
                aria-label={t.close}
                className="w-8 h-8 rounded-full bg-[#320814] hover:bg-[#7A1B2E] text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {ANOR_SECTIONS.map((sec) => (
                <button
                  type="button"
                  key={sec.key}
                  onClick={() => toggleHideSection(sec.key)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between gap-1.5 transition-all text-left ${
                    isSectionVisible(sec.key)
                      ? 'bg-[#3A0C18] border-[#D4AF37]/60 text-[#F5DFB8]'
                      : 'bg-[#180308] border-stone-800 text-stone-500 line-through'
                  }`}
                >
                  <span className="truncate">{t.sections[sec.id]}</span>
                  {isSectionVisible(sec.key) ? (
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-stone-500 shrink-0" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>

            {hiddenSections.length > 0 && (
              <button
                type="button"
                onClick={() => setHiddenSections([])}
                className="mt-1 w-full py-2.5 bg-[#7A1B2E] hover:bg-[#5E1224] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md border border-[#D4AF37]/40 cursor-pointer"
              >
                {t.restoreAll}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={innerClasses}>
        {/* ==================================================== */}
        {/* 1. COVER / HERO (Dark Wine Velvet Section) */}
        {/* ==================================================== */}
        {isSectionVisible('hero') && (
          <section
            aria-label={t.invitationTitle}
            className="w-full min-h-[90vh] flex flex-col justify-between items-center text-center px-4 pt-16 pb-8 bg-[#2B0711] text-[#FDF8F0] relative overflow-hidden"
          >
            {/* Corner Suzani Ornaments */}
            <SuzaniCorner
              position="top-left"
              className="absolute top-3 left-3 w-16 h-16 sm:w-20 sm:h-20 text-[#D4AF37]/65 pointer-events-none"
            />
            <SuzaniCorner
              position="top-right"
              className="absolute top-3 right-3 w-16 h-16 sm:w-20 sm:h-20 text-[#D4AF37]/65 pointer-events-none"
            />
            <SuzaniCorner
              position="bottom-left"
              className="absolute bottom-6 left-3 w-16 h-16 sm:w-20 sm:h-20 text-[#D4AF37]/65 pointer-events-none"
            />
            <SuzaniCorner
              position="bottom-right"
              className="absolute bottom-6 right-3 w-16 h-16 sm:w-20 sm:h-20 text-[#D4AF37]/65 pointer-events-none"
            />

            {/* In-preview hide button */}
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('hero')}
                title={t.hideSectionHint}
                aria-label={t.hideSectionHint}
                className="absolute top-4 right-14 z-20 w-8 h-8 rounded-full bg-[#1E040B]/80 text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}

            {/* Top Subtitle */}
            <div className="flex flex-col items-center gap-2 pt-4">
              <span
                className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold"
                style={{ fontFamily: SANS_FONT }}
              >
                {t.invitationTitle}
              </span>
              <SuzaniDivider className="w-36 h-4 text-[#D4AF37]/50" />
            </div>

            {/* Central Pomegranate Mark with slow single-run path drawing */}
            <div className="flex flex-col items-center gap-4 my-auto py-6">
              <div className="w-24 h-24 rounded-full bg-[#1E040B] border border-[#D4AF37]/80 flex items-center justify-center text-[#D4AF37] shadow-2xl relative">
                <PomegranateMark className="w-16 h-16 text-[#D4AF37]" animated={true} />
              </div>

              {/* Couple Names */}
              <div className="flex flex-col items-center gap-1 mt-2">
                <h1
                  className="text-4xl sm:text-5xl text-[#FDF8F0] tracking-wide font-normal leading-tight"
                  style={{ fontFamily: SERIF_FONT, fontWeight: 600 }}
                >
                  {groomName}
                </h1>
                <span
                  className="text-[#D4AF37] text-2xl sm:text-3xl italic leading-none my-1"
                  style={{ fontFamily: SERIF_FONT }}
                >
                  &
                </span>
                <h1
                  className="text-4xl sm:text-5xl text-[#FDF8F0] tracking-wide font-normal leading-tight"
                  style={{ fontFamily: SERIF_FONT, fontWeight: 600 }}
                >
                  {brideName}
                </h1>
              </div>

              {/* Welcome text */}
              <p
                className="text-sm sm:text-base text-[#F5DFB8]/90 italic max-w-sm px-4 leading-relaxed mt-2"
                style={{ fontFamily: SERIF_FONT }}
              >
                «{t.welcomeText}»
              </p>
            </div>

            {/* Hero Bottom: Date & Time strip */}
            <div className="w-full max-w-xs border-t border-[#D4AF37]/30 pt-4 flex items-center justify-around text-xs text-[#F5DFB8]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                <span className="capitalize">{dateFormatted.full}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                <span>{timeStr}</span>
              </div>
            </div>
          </section>
        )}

        {/* Transition: Dark Wine to Cream Paper */}
        <ScallopDivider direction="dark-to-cream" />

        {/* ==================================================== */}
        {/* CREAM PAPER CONTENT SECTIONS */}
        {/* ==================================================== */}
        <div className="w-full bg-[#FAF6F0] text-[#2E0711] flex flex-col items-center">
          {/* ==================================================== */}
          {/* 2. PHOTO SECTION (Arched Oriental Frame) */}
          {/* ==================================================== */}
          {isSectionVisible('photo') && (
            <section className="w-full py-12 px-4 sm:px-6 flex flex-col items-center text-center relative">
              {isPreview && (
                <button
                  type="button"
                  onClick={() => toggleHideSection('photo')}
                  title={t.hideSectionHint}
                  aria-label={t.hideSectionHint}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7A1B2E] border border-[#D4AF37]/50 flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              {/* Arch Frame */}
              <div className="w-full max-w-sm rounded-t-[140px] sm:rounded-t-[180px] rounded-b-3xl p-3 bg-[#FAF6F0] border-2 border-[#D4AF37]/60 shadow-xl relative overflow-hidden">
                {/* Outer hairline ornament */}
                <div className="absolute inset-1.5 rounded-t-[132px] sm:rounded-t-[172px] rounded-b-2xl border border-[#D4AF37]/30 pointer-events-none" />

                {heroPhotoUrl ? (
                  <div className="w-full h-80 sm:h-96 rounded-t-[128px] sm:rounded-t-[168px] rounded-b-xl overflow-hidden relative bg-[#FAF6F0]">
                    <img
                      src={heroPhotoUrl}
                      alt={`${groomName} & ${brideName}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle warm vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B0711]/60 via-transparent to-transparent flex flex-col justify-end p-4 text-left">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F5DFB8]">
                        {groomName} & {brideName}
                      </span>
                      <span
                        className="text-xs text-white/90 italic capitalize"
                        style={{ fontFamily: SERIF_FONT }}
                      >
                        {dateFormatted.full}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-72 sm:h-80 rounded-t-[128px] sm:rounded-t-[168px] rounded-b-xl bg-[#F5EFEB] flex flex-col items-center justify-center p-6 text-center border border-[#D4AF37]/25">
                    <PomegranateMark className="w-16 h-16 text-[#C5A059] mb-3" animated={false} />
                    <h3
                      className="text-2xl text-[#5E1224] font-normal"
                      style={{ fontFamily: SERIF_FONT, fontWeight: 600 }}
                    >
                      {groomName} & {brideName}
                    </h3>
                    <SuzaniDivider className="w-28 h-4 text-[#C5A059]/60 my-2" />
                    <p className="text-xs text-[#6B4C55] capitalize">{dateFormatted.full}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ==================================================== */}
          {/* 3. VIDEO SECTION */}
          {/* ==================================================== */}
          {isSectionVisible('video') && data.videoUrl && (
            <section className="w-full py-10 px-4 sm:px-6 flex flex-col items-center text-center relative border-t border-[#EFE6D8]">
              {isPreview && (
                <button
                  type="button"
                  onClick={() => toggleHideSection('video')}
                  title={t.hideSectionHint}
                  aria-label={t.hideSectionHint}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7A1B2E] border border-[#D4AF37]/50 flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <span
                className="text-[11px] uppercase tracking-[0.25em] text-[#7A1B2E] font-semibold mb-1"
                style={{ fontFamily: SANS_FONT }}
              >
                {t.videoTitle}
              </span>
              <SuzaniDivider className="w-32 h-4 text-[#C5A059]/70 mb-4" />

              <div className="w-full max-w-sm aspect-video rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 bg-black shadow-lg">
                <video
                  src={getMediaUrl(data.videoUrl)}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </section>
          )}

          {/* ==================================================== */}
          {/* 4. LOVE STORY SECTION */}
          {/* ==================================================== */}
          {isSectionVisible('loveStory') && loveStory && (
            <section className="w-full py-12 px-4 sm:px-6 flex flex-col items-center text-center relative border-t border-[#EFE6D8]">
              {isPreview && (
                <button
                  type="button"
                  onClick={() => toggleHideSection('loveStory')}
                  title={t.hideSectionHint}
                  aria-label={t.hideSectionHint}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7A1B2E] border border-[#D4AF37]/50 flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <div className="w-12 h-12 rounded-full bg-[#F5EFEB] border border-[#D4AF37]/60 flex items-center justify-center text-[#7A1B2E] mb-3 shadow-inner">
                <PomegranateMark className="w-7 h-7 text-[#7A1B2E]" animated={false} />
              </div>

              <span
                className="text-[11px] uppercase tracking-[0.25em] text-[#7A1B2E] font-semibold mb-1"
                style={{ fontFamily: SANS_FONT }}
              >
                {t.ourStoryTitle}
              </span>
              <SuzaniDivider className="w-36 h-4 text-[#C5A059] mb-4" />

              <p
                className="text-base sm:text-lg text-[#2E0711] italic max-w-md px-3 leading-relaxed"
                style={{ fontFamily: SERIF_FONT }}
              >
                «{loveStory}»
              </p>
            </section>
          )}

          {/* ==================================================== */}
          {/* 5. DATE & VENUE + MAPS + CALENDAR */}
          {/* ==================================================== */}
          {isSectionVisible('dateVenue') && (
            <section className="w-full py-12 px-4 sm:px-6 flex flex-col items-center text-center relative border-t border-[#EFE6D8]">
              {isPreview && (
                <button
                  type="button"
                  onClick={() => toggleHideSection('dateVenue')}
                  title={t.hideSectionHint}
                  aria-label={t.hideSectionHint}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7A1B2E] border border-[#D4AF37]/50 flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <span
                className="text-[11px] uppercase tracking-[0.25em] text-[#7A1B2E] font-semibold mb-1"
                style={{ fontFamily: SANS_FONT }}
              >
                {t.dateAndPlace}
              </span>
              <SuzaniDivider className="w-36 h-4 text-[#C5A059] mb-4" />

              <div className="w-full max-w-sm bg-[#F5EFEB] border border-[#D4AF37]/50 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
                {/* Venue name & Address */}
                <div className="flex flex-col items-center gap-1">
                  <h3
                    className="text-2xl sm:text-3xl text-[#5E1224] font-normal"
                    style={{ fontFamily: SERIF_FONT, fontWeight: 600 }}
                  >
                    {venue}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-[#55333C] mt-1 max-w-xs">
                    <MapPin className="w-4 h-4 text-[#7A1B2E] shrink-0" aria-hidden="true" />
                    <span>{address}</span>
                  </div>
                </div>

                {/* Date & Time badges */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#D4AF37]/30 text-xs">
                  <div className="flex flex-col items-center gap-1 p-2.5 bg-white/70 rounded-xl border border-[#D4AF37]/30">
                    <Calendar className="w-4 h-4 text-[#7A1B2E]" aria-hidden="true" />
                    <span className="font-semibold text-[#5E1224] capitalize text-center leading-tight">
                      {dateFormatted.full}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2.5 bg-white/70 rounded-xl border border-[#D4AF37]/30">
                    <Clock className="w-4 h-4 text-[#7A1B2E]" aria-hidden="true" />
                    <span className="font-semibold text-[#5E1224] text-center leading-tight">
                      {timeStr}
                    </span>
                  </div>
                </div>

                {/* Map & Copy Actions */}
                <div className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={getYandexMapsUrl(venue, address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] py-2.5 px-3 bg-white hover:bg-stone-50 border border-[#D4AF37]/50 rounded-xl text-xs font-semibold text-[#5E1224] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#7A1B2E]" aria-hidden="true" />
                      <span>{t.openYandex}</span>
                    </a>
                    <a
                      href={getGoogleMapsUrl(venue, address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] py-2.5 px-3 bg-white hover:bg-stone-50 border border-[#D4AF37]/50 rounded-xl text-xs font-semibold text-[#5E1224] flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#7A1B2E]" aria-hidden="true" />
                      <span>{t.openGoogle}</span>
                    </a>
                  </div>

                  {/* Copy Address Button */}
                  <button
                    type="button"
                    onClick={() => copyAddress(`${venue}, ${address}`)}
                    className="min-h-[44px] py-2 px-3 bg-white/90 hover:bg-white border border-[#D4AF37]/40 rounded-xl text-xs font-medium text-[#5E1224] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {addressCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#7A1B2E]" aria-hidden="true" />
                    )}
                    <span>{addressCopied ? t.copiedText : t.copyAddress}</span>
                  </button>

                  {/* Add to Calendar: Dual Option */}
                  <div className="pt-2 border-t border-[#D4AF37]/20 flex flex-col gap-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#7A1B2E] font-medium text-center">
                      {t.addToCalendar}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={getGoogleCalendarUrl(calendarPayload)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] py-2.5 px-2 bg-gradient-to-r from-[#5E1224] to-[#7A1B2E] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.googleCalendar}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => downloadIcs(calendarPayload)}
                        className="min-h-[44px] py-2.5 px-2 bg-gradient-to-r from-[#5E1224] to-[#7A1B2E] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.downloadIcs}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Transition: Cream Paper to Dark Wine */}
        <ScallopDivider direction="cream-to-dark" />

        {/* ==================================================== */}
        {/* 6. COUNTDOWN (Dark Wine Velvet Section) */}
        {/* ==================================================== */}
        {isSectionVisible('countdown') && (
          <section className="w-full py-12 px-4 sm:px-6 bg-[#2B0711] text-[#FDF8F0] flex flex-col items-center text-center relative overflow-hidden">
            {isPreview && (
              <button
                type="button"
                onClick={() => toggleHideSection('countdown')}
                title={t.hideSectionHint}
                aria-label={t.hideSectionHint}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#1E040B] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center cursor-pointer shadow-sm"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}

            <span
              className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1"
              style={{ fontFamily: SANS_FONT }}
            >
              {t.countdownTitle}
            </span>
            <SuzaniDivider className="w-36 h-4 text-[#D4AF37]/70 mb-6" />

            {currentDifference.isPassed ? (
              <p
                className="text-xl sm:text-2xl text-[#F5DFB8] font-normal"
                style={{ fontFamily: SERIF_FONT, fontWeight: 600 }}
              >
                {t.passed}
              </p>
            ) : (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full max-w-sm">
                {[
                  { label: t.days, val: currentDifference.days },
                  { label: t.hours, val: currentDifference.hours },
                  { label: t.minutes, val: currentDifference.minutes },
                  { label: t.seconds, val: currentDifference.seconds },
                ].map((item, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div className="flex-1 bg-[#3A0D1A] border border-[#D4AF37]/40 rounded-2xl py-3 px-1.5 flex flex-col items-center justify-center shadow-lg">
                      <span
                        className="text-3xl sm:text-4xl text-[#F5DFB8] font-semibold tabular-nums leading-none"
                        style={{ fontFamily: SERIF_FONT }}
                      >
                        {String(item.val).padStart(2, '0')}
                      </span>
                      <span
                        className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold mt-1"
                        style={{ fontFamily: SANS_FONT }}
                      >
                        {item.label}
                      </span>
                    </div>
                    {/* Colon separator: Pomegranate Seed Dots */}
                    {idx < arr.length - 1 && (
                      <div className="flex flex-col gap-1 items-center justify-center px-0.5">
                        <PomegranateSeedDot className="w-2.5 h-3.5 text-[#D4AF37]" />
                        <PomegranateSeedDot className="w-2.5 h-3.5 text-[#D4AF37]" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Transition: Dark Wine to Cream Paper */}
        <ScallopDivider direction="dark-to-cream" />

        {/* ==================================================== */}
        {/* CREAM PAPER CONTENT SECTIONS (Part 2) */}
        {/* ==================================================== */}
        <div className="w-full bg-[#FAF6F0] text-[#2E0711] flex flex-col items-center">
          {/* ==================================================== */}
          {/* 7. SCHEDULE / PROGRAM */}
          {/* ==================================================== */}
          {isSectionVisible('schedule') && scheduleList.length > 0 && (
            <section className="w-full py-12 px-4 sm:px-6 flex flex-col items-center text-center relative">
              {isPreview && (
                <button
                  type="button"
                  onClick={() => toggleHideSection('schedule')}
                  title={t.hideSectionHint}
                  aria-label={t.hideSectionHint}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7A1B2E] border border-[#D4AF37]/50 flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <span
                className="text-[11px] uppercase tracking-[0.25em] text-[#7A1B2E] font-semibold mb-1"
                style={{ fontFamily: SANS_FONT }}
              >
                {t.programTitle}
              </span>
              <p className="text-xs text-[#6B4C55] mb-2">{t.programSubtitle}</p>
              <SuzaniDivider className="w-36 h-4 text-[#C5A059] mb-6" />

              <div className="w-full max-w-sm flex flex-col gap-4 text-left relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-[#D4AF37]/60 before:via-[#7A1B2E]/40 before:to-[#D4AF37]/60">
                {scheduleList.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 relative z-10">
                    {/* Timeline Node with Pomegranate Seed emblem */}
                    <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border-2 border-[#D4AF37] flex items-center justify-center text-[#7A1B2E] shrink-0 shadow-md">
                      <PomegranateSeedDot className="w-4 h-5 text-[#7A1B2E]" />
                    </div>
                    <div className="flex flex-col pt-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-[#7A1B2E] font-mono">
                          {item.time}
                        </span>
                        <h4
                          className="text-base text-[#2E0711] font-semibold"
                          style={{ fontFamily: SERIF_FONT }}
                        >
                          {item.title || item.label}
                        </h4>
                      </div>
                      {item.desc && (
                        <p className="text-xs text-[#6B4C55] mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================== */}
          {/* 8. GALLERY + ACCESSIBLE LIGHTBOX */}
          {/* ==================================================== */}
          {isSectionVisible('gallery') && galleryPhotos.length > 0 && (
            <section className="w-full py-12 px-4 sm:px-6 flex flex-col items-center text-center relative border-t border-[#EFE6D8]">
              {isPreview && (
                <button
                  type="button"
                  onClick={() => toggleHideSection('gallery')}
                  title={t.hideSectionHint}
                  aria-label={t.hideSectionHint}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7A1B2E] border border-[#D4AF37]/50 flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <span
                className="text-[11px] uppercase tracking-[0.25em] text-[#7A1B2E] font-semibold mb-1"
                style={{ fontFamily: SANS_FONT }}
              >
                {t.galleryTitle}
              </span>
              <p className="text-xs text-[#6B4C55] mb-2">{t.gallerySubtitle}</p>
              <SuzaniDivider className="w-36 h-4 text-[#C5A059] mb-6" />

              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                {galleryPhotos.map((url, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setActiveModalPhoto(url)}
                    aria-label={`Rasmni kattalashtirish ${idx + 1}`}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-[#D4AF37]/40 group cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <img
                      src={url}
                      alt={`Foto ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#2B0711]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#F5DFB8]">
                      <Maximize2 className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Lightbox Modal */}
          <AnimatePresence>
            {activeModalPhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-label="Modal preview"
                onClick={() => setActiveModalPhoto(null)}
                className="fixed inset-0 z-50 bg-[#1E040B]/95 flex items-center justify-center p-4 backdrop-blur-md"
              >
                <div
                  className="relative max-w-lg w-full max-h-[85vh] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/80 bg-black shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={activeModalPhoto}
                    alt="Lightbox preview"
                    className="w-full h-full object-contain max-h-[80vh] mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveModalPhoto(null)}
                    aria-label={t.close}
                    className="absolute top-3 right-3 w-11 h-11 rounded-full bg-[#1E040B] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center hover:bg-[#320814] cursor-pointer"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================================================== */}
          {/* 9. DRESS CODE */}
          {/* ==================================================== */}
          {isSectionVisible('dressCode') && (
            <section className="w-full py-12 px-4 sm:px-6 flex flex-col items-center text-center relative border-t border-[#EFE6D8]">
              {isPreview && (
                <button
                  type="button"
                  onClick={() => toggleHideSection('dressCode')}
                  title={t.hideSectionHint}
                  aria-label={t.hideSectionHint}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7A1B2E] border border-[#D4AF37]/50 flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <span
                className="text-[11px] uppercase tracking-[0.25em] text-[#7A1B2E] font-semibold mb-1"
                style={{ fontFamily: SANS_FONT }}
              >
                {t.dressCodeTitle}
              </span>
              <p className="text-xs text-[#6B4C55] max-w-xs mb-2">{t.dressCodeSubtitle}</p>
              <SuzaniDivider className="w-36 h-4 text-[#C5A059] mb-6" />

              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full max-w-sm">
                {t.colors.map((c, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    aria-label={c.name}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${
                      selectedColor === i
                        ? 'border-[#7A1B2E] bg-white shadow-md scale-105'
                        : 'border-[#D4AF37]/30 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs font-medium text-[#2E0711] leading-tight text-center max-w-[64px] truncate">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Color Description */}
              {selectedColor !== null && t.colors[selectedColor] && (
                <div className="mt-4 p-3 bg-white border border-[#D4AF37]/40 rounded-xl max-w-xs text-xs text-[#55333C] leading-relaxed shadow-sm">
                  <span className="font-bold text-[#7A1B2E] block mb-0.5">
                    {t.colors[selectedColor].name}
                  </span>
                  <p>{t.colors[selectedColor].desc}</p>
                </div>
              )}
            </section>
          )}

          {/* ==================================================== */}
          {/* 10. RSVP (Confirmation Form) */}
          {/* ==================================================== */}
          {isSectionVisible('rsvp') && (
            <section className="w-full py-12 px-4 sm:px-6 flex flex-col items-center text-center relative border-t border-[#EFE6D8]">
              {isPreview && (
                <button
                  type="button"
                  onClick={() => toggleHideSection('rsvp')}
                  title={t.hideSectionHint}
                  aria-label={t.hideSectionHint}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7A1B2E] border border-[#D4AF37]/50 flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <span
                className="text-[11px] uppercase tracking-[0.25em] text-[#7A1B2E] font-semibold mb-1"
                style={{ fontFamily: SANS_FONT }}
              >
                {t.rsvpTitle}
              </span>
              <p className="text-xs text-[#6B4C55] max-w-xs mb-2">{t.rsvpSubtitle}</p>
              <SuzaniDivider className="w-36 h-4 text-[#C5A059] mb-6" />

              <div className="w-full max-w-sm bg-white border border-[#D4AF37]/50 rounded-2xl p-5 sm:p-6 shadow-sm text-left">
                {rsvpState && rsvpState.isSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-400 rounded-xl p-4 text-center text-xs font-semibold text-emerald-800 flex flex-col items-center gap-1.5">
                    <Check className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                    <span>{t.thankYouRsvp}</span>
                  </div>
                ) : (
                  <form
                    onSubmit={
                      rsvpState
                        ? rsvpState.onSubmit
                        : (e) => {
                            e.preventDefault();
                          }
                    }
                    className="flex flex-col gap-3.5"
                  >
                    <div>
                      <label
                        htmlFor={rsvpNameId}
                        className="text-xs uppercase tracking-wider text-[#7A1B2E] font-semibold block mb-1"
                      >
                        {t.yourName}
                      </label>
                      <input
                        id={rsvpNameId}
                        type="text"
                        required
                        placeholder={t.namePlaceholder}
                        value={rsvpState ? rsvpState.name : ''}
                        onChange={(e) => rsvpState && rsvpState.setName(e.target.value)}
                        className="w-full bg-[#FAF6F0] border border-[#D4AF37]/50 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#2E0711] outline-none focus:border-[#7A1B2E] focus:ring-1 focus:ring-[#7A1B2E]"
                      />
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#7A1B2E] font-semibold block mb-1">
                        {t.willAttend}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => rsvpState && rsvpState.setAttending(true)}
                          className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            rsvpState && rsvpState.attending === true
                              ? 'bg-emerald-900 text-white border-emerald-700 shadow-sm'
                              : 'bg-[#FAF6F0] border-[#D4AF37]/40 text-[#55333C] hover:bg-white'
                          }`}
                        >
                          {t.yes}
                        </button>
                        <button
                          type="button"
                          onClick={() => rsvpState && rsvpState.setAttending(false)}
                          className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            rsvpState && rsvpState.attending === false
                              ? 'bg-[#7A1B2E] text-white border-[#5E1224] shadow-sm'
                              : 'bg-[#FAF6F0] border-[#D4AF37]/40 text-[#55333C] hover:bg-white'
                          }`}
                        >
                          {t.no}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={rsvpWishesId}
                        className="text-xs uppercase tracking-wider text-[#7A1B2E] font-semibold block mb-1"
                      >
                        {t.wishesPlaceholder}
                      </label>
                      <textarea
                        id={rsvpWishesId}
                        rows={3}
                        value={rsvpState ? rsvpState.wishes : ''}
                        onChange={(e) => rsvpState && rsvpState.setWishes(e.target.value)}
                        className="w-full bg-[#FAF6F0] border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2E0711] outline-none focus:border-[#7A1B2E] focus:ring-1 focus:ring-[#7A1B2E]"
                      />
                    </div>

                    <PrivacyConsentCheckbox lang={currentLang} />

                    <button
                      type="submit"
                      disabled={
                        !rsvpState || rsvpState.isSubmitting || rsvpState.attending === null
                      }
                      className="w-full min-h-[48px] py-3 bg-gradient-to-r from-[#5E1224] to-[#7A1B2E] hover:from-[#7A1B2E] hover:to-[#5E1224] text-white font-semibold rounded-xl text-xs uppercase tracking-widest border border-[#D4AF37]/50 shadow-md disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {rsvpState && rsvpState.isSubmitting && (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      )}
                      <span>
                        {rsvpState && rsvpState.isSubmitting ? t.sending : t.sendRsvp}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </section>
          )}

          {/* ==================================================== */}
          {/* 11. GIFTS & CARD */}
          {/* ==================================================== */}
          {isSectionVisible('giftCard') && (
            <section className="w-full py-12 px-4 sm:px-6 flex flex-col items-center text-center relative border-t border-[#EFE6D8]">
              {isPreview && (
                <button
                  type="button"
                  onClick={() => toggleHideSection('giftCard')}
                  title={t.hideSectionHint}
                  aria-label={t.hideSectionHint}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7A1B2E] border border-[#D4AF37]/50 flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <span
                className="text-[11px] uppercase tracking-[0.25em] text-[#7A1B2E] font-semibold mb-1"
                style={{ fontFamily: SANS_FONT }}
              >
                {t.giftTitle}
              </span>
              <p className="text-xs text-[#6B4C55] max-w-xs mb-2">{t.giftSubtitle}</p>
              <SuzaniDivider className="w-36 h-4 text-[#C5A059] mb-6" />

              <div className="w-full max-w-sm bg-white border border-[#D4AF37]/50 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col items-center gap-3">
                <p className="text-xs text-[#55333C] max-w-xs leading-relaxed">
                  {t.giftCardHint}
                </p>

                {/* Card Number display */}
                <div className="w-full bg-[#F5EFEB] border border-[#D4AF37]/40 rounded-xl p-3.5 flex flex-col items-center gap-1.5">
                  {/* Masked example badge if in preview and no user card */}
                  {!data.giftCardNumber && isPreview && (
                    <span className="text-[11px] uppercase tracking-wider text-[#7A1B2E] font-bold bg-[#FAF6F0] border border-[#D4AF37]/40 rounded-full px-2.5 py-0.5">
                      {t.cardExampleBadge}
                    </span>
                  )}
                  <span className="text-base sm:text-lg font-mono font-bold text-[#5E1224] tracking-wider">
                    {data.giftCardNumber
                      ? formatCardNumber(data.giftCardNumber)
                      : maskCardExample()}
                  </span>

                  {(data.giftCardOwner || isPreview) && (
                    <span className="text-xs text-[#6B4C55]">
                      {t.cardOwner}: {data.giftCardOwner || `${groomName} S.`}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      copyCard(data.giftCardNumber || maskCardExample())
                    }
                    className="mt-1 min-h-[44px] py-2 px-4 bg-white hover:bg-stone-50 border border-[#D4AF37]/50 rounded-xl text-xs font-semibold text-[#5E1224] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    {cardCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#7A1B2E]" aria-hidden="true" />
                    )}
                    <span>{cardCopied ? t.copiedText : t.copyCard}</span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Transition: Cream Paper to Dark Wine */}
        <ScallopDivider direction="cream-to-dark" />

        {/* ==================================================== */}
        {/* 12. FOOTER (Dark Wine Velvet Section) */}
        {/* ==================================================== */}
        <footer className="w-full py-12 px-4 sm:px-6 bg-[#2B0711] text-[#FDF8F0] flex flex-col items-center text-center gap-3">
          <PomegranateMark className="w-10 h-10 text-[#D4AF37]/80" animated={false} />

          <h2
            className="text-2xl sm:text-3xl text-[#FDF8F0] font-normal"
            style={{ fontFamily: SERIF_FONT, fontWeight: 600 }}
          >
            {groomName} & {brideName}
          </h2>

          <p
            className="text-xs sm:text-sm text-[#F5DFB8]/90 italic max-w-xs"
            style={{ fontFamily: SERIF_FONT }}
          >
            {t.footerBlessing}
          </p>

          <SuzaniDivider className="w-32 h-4 text-[#D4AF37]/50 my-1" />

          <div
            className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]/60 pt-2"
            style={{ fontFamily: SANS_FONT }}
          >
            {dateFormatted.year}
          </div>
        </footer>
      </div>
    </div>
  );
};
