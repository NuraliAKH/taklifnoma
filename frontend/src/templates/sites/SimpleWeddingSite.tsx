import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Plus,
  Minus,
} from 'lucide-react';
import type { WebsiteTemplateProps } from './types';
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

/**
 * Uzbek Ikat / Adras ornament band (~24px height).
 * Authentic Central Asian geometric motif: stepped diamond lozenges & radiating silk threads.
 */
export const AtlasOrnament: React.FC<{ className?: string }> = ({
  className = 'w-56 h-6 text-[#C9A55A]',
}) => (
  <svg
    viewBox="0 0 260 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Central adras stepped diamond */}
    <path
      d="M130 2 L140 12 L130 22 L120 12 Z"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="currentColor"
      fillOpacity="0.14"
    />
    <path
      d="M130 6 L136 12 L130 18 L124 12 Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeOpacity="0.65"
    />
    <circle cx="130" cy="12" r="1.5" fill="currentColor" />

    {/* Stepped adras diamonds left & right */}
    <path
      d="M112 12 L107 7 L102 12 L107 17 Z M148 12 L153 7 L158 12 L153 17 Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="currentColor"
      fillOpacity="0.08"
    />
    <path
      d="M94 12 L90 8 L86 12 L90 16 Z M166 12 L170 8 L174 12 L170 16 Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeOpacity="0.7"
    />

    {/* Micro serrations / ikat needle threads */}
    <path
      d="M123 9 L119 5 M137 9 L141 5 M123 15 L119 19 M137 15 L141 19"
      stroke="currentColor"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />

    {/* Flanking thread lines */}
    <path
      d="M80 12 H20 M180 12 H240"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeDasharray="4 3 12 3"
      strokeOpacity="0.6"
    />
    <circle cx="20" cy="12" r="1.2" fill="currentColor" fillOpacity="0.7" />
    <circle cx="240" cy="12" r="1.2" fill="currentColor" fillOpacity="0.7" />
  </svg>
);

/**
 * Geometric Rhombus Monogram for Zar Atlas.
 * No hearts or generic symbols — pure typography in Cormorant Garamond within fine gold diamond lines.
 */
export const AtlasMonogram: React.FC<{
  groomInitial: string;
  brideInitial?: string;
  isBirthday?: boolean;
  className?: string;
}> = ({ groomInitial, brideInitial, isBirthday, className = 'w-20 h-20' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full text-current overflow-visible"
        aria-hidden="true"
      >
        <polygon
          points="50,4 96,50 50,96 4,50"
          fill="currentColor"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <polygon
          points="50,11 89,50 50,89 11,50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="3 2"
          strokeOpacity="0.6"
        />
        <circle cx="50" cy="4" r="2" fill="currentColor" />
        <circle cx="96" cy="50" r="2" fill="currentColor" />
        <circle cx="50" cy="96" r="2" fill="currentColor" />
        <circle cx="4" cy="50" r="2" fill="currentColor" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
        {isBirthday || !brideInitial ? (
          <span
            className="text-2xl sm:text-3xl font-serif font-light tracking-widest text-current uppercase"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {groomInitial}
          </span>
        ) : (
          <div
            className="flex items-center gap-1.5 text-lg sm:text-xl font-serif font-light tracking-widest text-current uppercase"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            <span>{groomInitial}</span>
            <span className="text-xs opacity-60 font-sans">·</span>
            <span>{brideInitial}</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface TranslationStrings {
  invitationTitle: string;
  openEnvelopeBtn: string;
  scrollDown: string;
  welcomeTextFallback: string;
  ourStoryTitle: string;
  dateAndPlace: string;
  dateLabel: string;
  timeLabel: string;
  venueLabel: string;
  addressLabel: string;
  yandexMaps: string;
  googleMaps: string;
  copyAddress: string;
  addressCopied: string;
  addToCalendar: string;
  googleCalendar: string;
  downloadIcs: string;
  scheduleTitle: string;
  countdownTitle: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  passed: string;
  galleryTitle: string;
  videoTitle: string;
  rsvpTitle: string;
  rsvpSubtitle: string;
  yourName: string;
  willAttend: string;
  yes: string;
  no: string;
  guestCountLabel: string;
  decreaseGuests: string;
  increaseGuests: string;
  wishesPlaceholder: string;
  sendRsvp: string;
  sending: string;
  thankYouRsvp: string;
  thankYouRsvpDesc: string;
  giftTitle: string;
  giftSubtitle: string;
  copyCard: string;
  copiedText: string;
  cardOwner: string;
  giftCardExampleLabel: string;
  sectionsManager: string;
  restoreAll: string;
  hideSectionHint: string;
  close: string;
  prevPhoto: string;
  nextPhoto: string;
  sections: {
    hero: string;
    photo: string;
    video: string;
    loveStory: string;
    dateVenue: string;
    schedule: string;
    countdown: string;
    gallery: string;
    rsvp: string;
    giftCard: string;
  };
}

const TRANSLATIONS: Record<'wedding' | 'birthday', Record<'ru' | 'uz' | 'en', TranslationStrings>> = {
  wedding: {
    ru: {
      invitationTitle: 'Приглашение на свадьбу',
      openEnvelopeBtn: 'Открыть приглашение',
      scrollDown: 'Листайте вниз',
      welcomeTextFallback:
        'Дорогие и близкие! Приглашаем вас разделить с нами радость рождения нашей новой семьи.',
      ourStoryTitle: 'Наша история',
      dateAndPlace: 'Дата и место',
      dateLabel: 'Дата',
      timeLabel: 'Время',
      venueLabel: 'Ресторан',
      addressLabel: 'Адрес',
      yandexMaps: 'Яндекс Карты',
      googleMaps: 'Google Карты',
      copyAddress: 'Скопировать адрес',
      addressCopied: 'Адрес скопирован!',
      addToCalendar: 'Добавить в календарь',
      googleCalendar: 'Google Календарь',
      downloadIcs: 'Файл календаря (.ics)',
      scheduleTitle: 'Программа вечера',
      countdownTitle: 'До торжества осталось',
      days: 'дней',
      hours: 'часов',
      minutes: 'минут',
      seconds: 'секунд',
      passed: 'Торжество началось!',
      galleryTitle: 'Фотогалерея',
      videoTitle: 'Видео-приглашение',
      rsvpTitle: 'Подтверждение присутствия',
      rsvpSubtitle: 'Пожалуйста, подтвердите ваше участие',
      yourName: 'Ваше имя и фамилия',
      willAttend: 'Сможете ли вы присутствовать?',
      yes: 'С удовольствием приду',
      no: 'К сожалению, не смогу',
      guestCountLabel: 'Количество гостей',
      decreaseGuests: 'Уменьшить число гостей',
      increaseGuests: 'Увеличить число гостей',
      wishesPlaceholder: 'Ваши пожелания и теплые слова...',
      sendRsvp: 'Подтвердить',
      sending: 'Отправка...',
      thankYouRsvp: 'Спасибо за ваш ответ!',
      thankYouRsvpDesc: 'Мы очень ждем встречи с вами!',
      giftTitle: 'Подарки и пожелания',
      giftSubtitle: 'Ваше присутствие — наш главный подарок!',
      copyCard: 'Скопировать номер карты',
      copiedText: 'Скопировано!',
      cardOwner: 'Получатель',
      giftCardExampleLabel: 'Пример карты',
      sectionsManager: 'Управление разделами',
      restoreAll: 'Показать все скрытые блоки',
      hideSectionHint: 'Скрыть этот раздел',
      close: 'Закрыть',
      prevPhoto: 'Предыдущее фото',
      nextPhoto: 'Следующее фото',
      sections: {
        hero: 'Главный блок (Обложка)',
        photo: 'Главное фото',
        video: 'Видео-приглашение',
        loveStory: 'История любви',
        dateVenue: 'Дата и место',
        schedule: 'Программа вечера',
        countdown: 'Таймер отсчета',
        gallery: 'Фотогалерея',
        rsvp: 'Анкета гостей',
        giftCard: 'Подарки и карта',
      },
    },
    uz: {
      invitationTitle: 'Toʻy taklifnomasi',
      openEnvelopeBtn: 'Taklifnomani ochish',
      scrollDown: 'Pastga suring',
      welcomeTextFallback:
        'Hurmatli mehmonimiz! Sizni quvonchli kunimiz — nikoh toʻyimiz munosabati bilan yoziladigan dasturxonga taklif etamiz.',
      ourStoryTitle: 'Bizning tariximiz',
      dateAndPlace: 'Sana va manzil',
      dateLabel: 'Sana',
      timeLabel: 'Vaqt',
      venueLabel: 'Tantana saroyi',
      addressLabel: 'Manzil',
      yandexMaps: 'Yandex xarita',
      googleMaps: 'Google xarita',
      copyAddress: 'Manzilni nusxalash',
      addressCopied: 'Manzil nusxalandi!',
      addToCalendar: 'Taqvimga qoʻshish',
      googleCalendar: 'Google Taqvim',
      downloadIcs: 'Taqvim fayli (.ics)',
      scheduleTitle: 'Toʻy dasturi',
      countdownTitle: 'Toʻygacha qoldi',
      days: 'kun',
      hours: 'soat',
      minutes: 'daqiqa',
      seconds: 'soniya',
      passed: 'Toʻy tantanasi boshlandi!',
      galleryTitle: 'Fotogalereya',
      videoTitle: 'Video taklifnoma',
      rsvpTitle: 'Tashrifingizni tasdiqlang',
      rsvpSubtitle: 'Toʻyimizda sizni kutib qolamiz',
      yourName: 'Ism va familiyangiz',
      willAttend: 'Tashrifingizni tasdiqlaysizmi?',
      yes: 'Albatta, boraman',
      no: 'Afsuski, kela olmayman',
      guestCountLabel: 'Mehmonlar soni',
      decreaseGuests: 'Mehmonlar sonini kamaytirish',
      increaseGuests: 'Mehmonlar sonini oshirish',
      wishesPlaceholder: 'Yurakdan chiqqan tilaklaringiz...',
      sendRsvp: 'Javobni yuborish',
      sending: 'Yuborilmoqda...',
      thankYouRsvp: 'Rahmat! Javobingiz qabul qilindi',
      thankYouRsvpDesc: 'Sizni toʻyimizda koʻrishdan mamnun boʻlamiz!',
      giftTitle: 'Toʻyona va sovgʻalar',
      giftSubtitle: 'Sizning tashrifingiz — biz uchun eng oliy sovgʻadir!',
      copyCard: 'Karta raqamini nusxalash',
      copiedText: 'Nusxalandi!',
      cardOwner: 'Karta egasi',
      giftCardExampleLabel: 'Namuna karta',
      sectionsManager: 'Sayt boʻlimlari',
      restoreAll: 'Barcha yashirilgan boʻlimlarni koʻrsatish',
      hideSectionHint: 'Boʻlimni yashirish',
      close: 'Yopish',
      prevPhoto: 'Oldingi rasm',
      nextPhoto: 'Keyingi rasm',
      sections: {
        hero: 'Bosh sahifa (Muqova)',
        photo: 'Asosiy rasm',
        video: 'Video taklifnoma',
        loveStory: 'Murojaat va sevgi qissasi',
        dateVenue: 'Sana va manzil',
        schedule: 'Toʻy dasturi',
        countdown: 'Ortga hisoblash',
        gallery: 'Fotogalereya',
        rsvp: 'Mehmonlar anketasi',
        giftCard: 'Sovgʻa va karta',
      },
    },
    en: {
      invitationTitle: 'Wedding Invitation',
      openEnvelopeBtn: 'Open Invitation',
      scrollDown: 'Scroll down',
      welcomeTextFallback:
        'Dear family and friends! We warmly invite you to celebrate the beginning of our new journey together.',
      ourStoryTitle: 'Our Story',
      dateAndPlace: 'Date & Location',
      dateLabel: 'Date',
      timeLabel: 'Time',
      venueLabel: 'Venue',
      addressLabel: 'Address',
      yandexMaps: 'Yandex Maps',
      googleMaps: 'Google Maps',
      copyAddress: 'Copy Address',
      addressCopied: 'Address copied!',
      addToCalendar: 'Add to Calendar',
      googleCalendar: 'Google Calendar',
      downloadIcs: 'Calendar file (.ics)',
      scheduleTitle: 'Wedding Schedule',
      countdownTitle: 'Countdown',
      days: 'days',
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
      passed: 'The celebration has begun!',
      galleryTitle: 'Gallery',
      videoTitle: 'Video Invitation',
      rsvpTitle: 'RSVP Confirmation',
      rsvpSubtitle: 'Kindly confirm your attendance',
      yourName: 'Your Full Name',
      willAttend: 'Will you be attending?',
      yes: 'Delighted to attend',
      no: 'Regretfully decline',
      guestCountLabel: 'Number of guests',
      decreaseGuests: 'Decrease guest count',
      increaseGuests: 'Increase guest count',
      wishesPlaceholder: 'Your warm wishes...',
      sendRsvp: 'Submit Response',
      sending: 'Submitting...',
      thankYouRsvp: 'Thank you for your response!',
      thankYouRsvpDesc: 'We look forward to celebrating with you!',
      giftTitle: 'Gifts & Blessings',
      giftSubtitle: 'Your presence is the greatest gift of all!',
      copyCard: 'Copy Card Number',
      copiedText: 'Copied!',
      cardOwner: 'Card Holder',
      giftCardExampleLabel: 'Card example',
      sectionsManager: 'Manage Sections',
      restoreAll: 'Show All Hidden Sections',
      hideSectionHint: 'Hide this section',
      close: 'Close',
      prevPhoto: 'Previous photo',
      nextPhoto: 'Next photo',
      sections: {
        hero: 'Hero Cover',
        photo: 'Main Photo',
        video: 'Video Invitation',
        loveStory: 'Our Story',
        dateVenue: 'Date & Venue',
        schedule: 'Schedule',
        countdown: 'Countdown Timer',
        gallery: 'Photo Gallery',
        rsvp: 'RSVP Form',
        giftCard: 'Gifts & Card',
      },
    },
  },
  birthday: {
    ru: {
      invitationTitle: 'Приглашение на День Рождения',
      openEnvelopeBtn: 'Открыть праздник',
      scrollDown: 'Листайте вниз',
      welcomeTextFallback:
        'Дорогие друзья и близкие! Приглашаю вас разделить со мной радость этого особенного праздничного дня.',
      ourStoryTitle: 'О празднике',
      dateAndPlace: 'Дата и место',
      dateLabel: 'Дата',
      timeLabel: 'Время',
      venueLabel: 'Ресторан',
      addressLabel: 'Адрес',
      yandexMaps: 'Яндекс Карты',
      googleMaps: 'Google Карты',
      copyAddress: 'Скопировать адрес',
      addressCopied: 'Адрес скопирован!',
      addToCalendar: 'Добавить в календарь',
      googleCalendar: 'Google Календарь',
      downloadIcs: 'Файл календаря (.ics)',
      scheduleTitle: 'Программа праздника',
      countdownTitle: 'До праздника осталось',
      days: 'дней',
      hours: 'часов',
      minutes: 'минут',
      seconds: 'секунд',
      passed: 'Праздник начался!',
      galleryTitle: 'Фотогалерея',
      videoTitle: 'Праздничное видео',
      rsvpTitle: 'Подтверждение присутствия',
      rsvpSubtitle: 'Пожалуйста, дайте знать, будете ли вы со мной',
      yourName: 'Ваше имя и фамилия',
      willAttend: 'Сможете ли вы прийти?',
      yes: 'С радостью приду',
      no: 'К сожалению, не смогу',
      guestCountLabel: 'Количество гостей',
      decreaseGuests: 'Уменьшить число гостей',
      increaseGuests: 'Увеличить число гостей',
      wishesPlaceholder: 'Ваши праздничные пожелания...',
      sendRsvp: 'Подтвердить',
      sending: 'Отправка...',
      thankYouRsvp: 'Спасибо за ваш ответ!',
      thankYouRsvpDesc: 'Буду очень рад видеть вас на моем празднике!',
      giftTitle: 'Подарки и внимание',
      giftSubtitle: 'Ваше присутствие и улыбки — лучший подарок!',
      copyCard: 'Скопировать номер карты',
      copiedText: 'Скопировано!',
      cardOwner: 'Получатель',
      giftCardExampleLabel: 'Пример карты',
      sectionsManager: 'Управление разделами',
      restoreAll: 'Показать все скрытые блоки',
      hideSectionHint: 'Скрыть этот раздел',
      close: 'Закрыть',
      prevPhoto: 'Предыдущее фото',
      nextPhoto: 'Следующее фото',
      sections: {
        hero: 'Главный блок (Обложка)',
        photo: 'Главное фото',
        video: 'Праздничное видео',
        loveStory: 'О празднике',
        dateVenue: 'Дата и место',
        schedule: 'Программа дня',
        countdown: 'Таймер отсчета',
        gallery: 'Фотогалерея',
        rsvp: 'Анкета гостей',
        giftCard: 'Подарки и карта',
      },
    },
    uz: {
      invitationTitle: 'Tugʻilgan kun taklifnomasi',
      openEnvelopeBtn: 'Bayramni ochish',
      scrollDown: 'Pastga suring',
      welcomeTextFallback:
        'Hurmatli qadrdonlarim! Sizni tavallud ayyomim munosabati bilan yoziladigan bayramona dasturxonga taklif qilaman.',
      ourStoryTitle: 'Bayram haqida',
      dateAndPlace: 'Sana va manzil',
      dateLabel: 'Sana',
      timeLabel: 'Vaqt',
      venueLabel: 'Restoran / Ziyofatxona',
      addressLabel: 'Manzil',
      yandexMaps: 'Yandex xarita',
      googleMaps: 'Google xarita',
      copyAddress: 'Manzilni nusxalash',
      addressCopied: 'Manzil nusxalandi!',
      addToCalendar: 'Taqvimga qoʻshish',
      googleCalendar: 'Google Taqvim',
      downloadIcs: 'Taqvim fayli (.ics)',
      scheduleTitle: 'Bayram dasturi',
      countdownTitle: 'Bayramgacha qoldi',
      days: 'kun',
      hours: 'soat',
      minutes: 'daqiqa',
      seconds: 'soniya',
      passed: 'Bayram tantanasi boshlandi!',
      galleryTitle: 'Fotogalereya',
      videoTitle: 'Bayram videosi',
      rsvpTitle: 'Tashrifingizni tasdiqlang',
      rsvpSubtitle: 'Bayramimizda sizni kutib qolamiz',
      yourName: 'Ism va familiyangiz',
      willAttend: 'Bayramga kelasizmi?',
      yes: 'Albatta, boraman',
      no: 'Afsuski, kela olmayman',
      guestCountLabel: 'Mehmonlar soni',
      decreaseGuests: 'Mehmonlar sonini kamaytirish',
      increaseGuests: 'Mehmonlar sonini oshirish',
      wishesPlaceholder: 'Ezgʻu tilaklaringiz...',
      sendRsvp: 'Javobni yuborish',
      sending: 'Yuborilmoqda...',
      thankYouRsvp: 'Rahmat! Javobingiz qabul qilindi',
      thankYouRsvpDesc: 'Siz bilan birga nishonlashdan behad mamnunmiz!',
      giftTitle: 'Sovgʻalar va ehtirom',
      giftSubtitle: 'Sizning tashrifingiz — eng katta bayramona sovgʻadir!',
      copyCard: 'Karta raqamini nusxalash',
      copiedText: 'Nusxalandi!',
      cardOwner: 'Karta egasi',
      giftCardExampleLabel: 'Namuna karta',
      sectionsManager: 'Sayt boʻlimlari',
      restoreAll: 'Barcha yashirilgan boʻlimlarni koʻrsatish',
      hideSectionHint: 'Boʻlimni yashirish',
      close: 'Yopish',
      prevPhoto: 'Oldingi rasm',
      nextPhoto: 'Keyingi rasm',
      sections: {
        hero: 'Bosh sahifa (Muqova)',
        photo: 'Asosiy rasm',
        video: 'Bayram videosi',
        loveStory: 'Bayram haqida',
        dateVenue: 'Sana va manzil',
        schedule: 'Bayram dasturi',
        countdown: 'Ortga hisoblash',
        gallery: 'Fotogalereya',
        rsvp: 'Mehmonlar anketasi',
        giftCard: 'Sovgʻa va karta',
      },
    },
    en: {
      invitationTitle: 'Birthday Invitation',
      openEnvelopeBtn: 'Open Celebration',
      scrollDown: 'Scroll down',
      welcomeTextFallback:
        'Dear friends and family! You are warmly invited to join me in celebrating my birthday.',
      ourStoryTitle: 'About the Celebration',
      dateAndPlace: 'Date & Location',
      dateLabel: 'Date',
      timeLabel: 'Time',
      venueLabel: 'Venue',
      addressLabel: 'Address',
      yandexMaps: 'Yandex Maps',
      googleMaps: 'Google Maps',
      copyAddress: 'Copy Address',
      addressCopied: 'Address copied!',
      addToCalendar: 'Add to Calendar',
      googleCalendar: 'Google Calendar',
      downloadIcs: 'Calendar file (.ics)',
      scheduleTitle: 'Celebration Schedule',
      countdownTitle: 'Countdown',
      days: 'days',
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
      passed: 'The celebration has started!',
      galleryTitle: 'Photo Gallery',
      videoTitle: 'Celebration Video',
      rsvpTitle: 'RSVP Confirmation',
      rsvpSubtitle: 'Please let me know if you can make it',
      yourName: 'Your Full Name',
      willAttend: 'Will you attend?',
      yes: 'Yes, absolutely',
      no: 'Cannot attend',
      guestCountLabel: 'Number of guests',
      decreaseGuests: 'Decrease guest count',
      increaseGuests: 'Increase guest count',
      wishesPlaceholder: 'Your birthday wishes...',
      sendRsvp: 'Submit Response',
      sending: 'Submitting...',
      thankYouRsvp: 'Thank you for your response!',
      thankYouRsvpDesc: 'Looking forward to celebrating together!',
      giftTitle: 'Gifts & Wishes',
      giftSubtitle: 'Your presence and smiles are the best gifts of all!',
      copyCard: 'Copy Card Number',
      copiedText: 'Copied!',
      cardOwner: 'Card Holder',
      giftCardExampleLabel: 'Card example',
      sectionsManager: 'Manage Sections',
      restoreAll: 'Show All Hidden Sections',
      hideSectionHint: 'Hide this section',
      close: 'Close',
      prevPhoto: 'Previous photo',
      nextPhoto: 'Next photo',
      sections: {
        hero: 'Hero Cover',
        photo: 'Main Photo',
        video: 'Celebration Video',
        loveStory: 'About Celebration',
        dateVenue: 'Date & Venue',
        schedule: 'Schedule',
        countdown: 'Countdown Timer',
        gallery: 'Photo Gallery',
        rsvp: 'RSVP Form',
        giftCard: 'Gifts & Card',
      },
    },
  },
};

export const SimpleWeddingSite: React.FC<WebsiteTemplateProps> = ({
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
  onToggleSection,
  onLanguageChange,
}) => {
  const isBirthday = visualVariant === 'birthday';
  const categoryKey: 'wedding' | 'birthday' = isBirthday ? 'birthday' : 'wedding';
  const currentLang: 'ru' | 'uz' | 'en' = lang || 'ru';
  const t = TRANSLATIONS[categoryKey][currentLang] || TRANSLATIONS[categoryKey].ru;
  const demo = getDemoContent(currentLang);
  const calmMotion = useCalmMotion(isPreview);

  // Envelope / opened state
  const [internalOpened, setInternalOpened] = useState(isOpened);
  useEffect(() => {
    setInternalOpened(isOpened);
  }, [isOpened]);
  const opened = isOpened || internalOpened;

  const handleOpenEnvelopeClick = () => {
    setInternalOpened(true);
    onOpenEnvelope?.();
  };

  // Hidden sections management
  const [hiddenSections, setHiddenSections] = useState<string[]>(data.hiddenSections || []);
  useEffect(() => {
    if (data.hiddenSections) {
      setHiddenSections(data.hiddenSections);
    }
  }, [data.hiddenSections]);

  const [showSectionManager, setShowSectionManager] = useState<boolean>(false);
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

  const changeLanguage = (newLang: 'ru' | 'uz' | 'en') => {
    if (onLanguageChange) onLanguageChange(newLang);
  };

  // Resolved content values (NO fake Unsplash photos, NO fake card numbers on live site)
  const groomName = data.groomName?.trim() || (isBirthday ? (data.name?.trim() || demo.groomName) : demo.groomName);
  const brideName = data.brideName?.trim() || demo.brideName;
  const date = data.date || '2026-10-10';
  const time = data.time || '18:00';
  const venue = data.venue?.trim() || (isPreview ? demo.venue : '');
  const address = data.address?.trim() || (isPreview ? demo.address : '');

  const formattedDateObj = formatEventDate(date, currentLang);
  const currentDifference = useCountdownTimer(date, time, timeLeft);

  // Address copy & Card copy
  const { copied: addressCopied, copy: copyAddress } = useCopyToClipboard(2000);
  const { copied: cardCopied, copy: copyCard } = useCopyToClipboard(2000);

  // Photos
  const rawPhotos = Array.isArray(data.photos) ? data.photos.filter(Boolean) : [];
  const previewFallbackPhotos = ['/olive-editorial-1.webp', '/olive-editorial-2.webp', '/olive-editorial-3.webp'];
  const galleryPhotos = rawPhotos.length > 0
    ? rawPhotos.map((p) => getMediaUrl(p))
    : (isPreview ? previewFallbackPhotos : []);

  const heroPhotoUrl = data.photoUrl
    ? getMediaUrl(data.photoUrl)
    : (isPreview ? '/olive-editorial-1.webp' : '');

  // Lightbox
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (activePhotoIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePhotoIdx(null);
      if (e.key === 'ArrowLeft') {
        setActivePhotoIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryPhotos.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setActivePhotoIdx((prev) => (prev !== null && prev < galleryPhotos.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIdx, galleryPhotos.length]);

  // Schedule resolution
  const userSchedule = (Array.isArray(data.schedule) && data.schedule.length > 0)
    ? data.schedule
    : (Array.isArray(data.scheduleItems) && data.scheduleItems.length > 0)
      ? data.scheduleItems
      : [];

  const birthdayDemoSchedule = [
    { time: '18:00', title: currentLang === 'uz' ? 'Mehmonlar tashrifi' : currentLang === 'en' ? 'Welcome & Drinks' : 'Сбор гостей', desc: '' },
    { time: '19:00', title: currentLang === 'uz' ? 'Bayramona tabriklar' : currentLang === 'en' ? 'Birthday Toasts' : 'Праздничный тост', desc: '' },
    { time: '20:00', title: currentLang === 'uz' ? 'Ziyofat va jonli musiqa' : currentLang === 'en' ? 'Gala Dinner & Music' : 'Праздничный банкет', desc: '' },
    { time: '22:30', title: currentLang === 'uz' ? 'Bayram torti' : currentLang === 'en' ? 'Birthday Cake' : 'Праздничный торт', desc: '' },
  ];

  const resolvedSchedule = userSchedule.length > 0
    ? userSchedule
    : (isPreview ? (isBirthday ? birthdayDemoSchedule : demo.schedule) : []);

  // Welcome / Story resolution
  const welcomeText = data.welcomeText?.trim() || (isPreview ? t.welcomeTextFallback : '');
  const loveStory = data.loveStory?.trim() || (isPreview && !isBirthday ? demo.loveStory : '');

  // Gift card resolution
  const hasGiftCard = Boolean(data.giftCardNumber?.trim());
  const displayCardNumber = hasGiftCard
    ? formatCardNumber(data.giftCardNumber)
    : (isPreview ? maskCardExample() : '');

  // Initials for monogram
  const groomInitial = (groomName || 'J').trim().charAt(0).toUpperCase();
  const brideInitial = isBirthday ? undefined : (brideName || 'M').trim().charAt(0).toUpperCase();

  // Local fallback state for RSVP in preview if rsvpState is not provided
  const [localAttending, setLocalAttending] = useState<boolean | null>(null);
  const [localName, setLocalName] = useState('');
  const [localGuestCount, setLocalGuestCount] = useState(1);
  const [localWishes, setLocalWishes] = useState('');

  const rsvpName = rsvpState ? rsvpState.name : localName;
  const setRsvpName = rsvpState ? rsvpState.setName : setLocalName;
  const rsvpAttending = rsvpState ? rsvpState.attending : localAttending;
  const setRsvpAttending = rsvpState ? rsvpState.setAttending : setLocalAttending;
  const rsvpGuestCount = rsvpState ? rsvpState.guestCount : localGuestCount;
  const setRsvpGuestCount = rsvpState ? rsvpState.setGuestCount : setLocalGuestCount;
  const rsvpWishes = rsvpState ? rsvpState.wishes : localWishes;
  const setRsvpWishes = rsvpState ? rsvpState.setWishes : setLocalWishes;
  const rsvpIsSubmitting = rsvpState ? rsvpState.isSubmitting : false;
  const rsvpIsSuccess = rsvpState ? rsvpState.isSuccess : false;

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpState) {
      rsvpState.onSubmit(e);
    }
  };

  // Calendar event helper
  const handleDownloadIcs = () => {
    const eventDate = parseEventDateTime(date, time);
    const eventTitle = isBirthday
      ? `${groomName} — ${t.invitationTitle}`
      : `${groomName} & ${brideName} — ${t.invitationTitle}`;
    downloadIcs({
      title: eventTitle,
      start: eventDate,
      location: [venue, address].filter(Boolean).join(', '),
      description: welcomeText || t.invitationTitle,
    });
  };

  const googleCalUrl = (() => {
    const eventDate = parseEventDateTime(date, time);
    const eventTitle = isBirthday
      ? `${groomName} — ${t.invitationTitle}`
      : `${groomName} & ${brideName} — ${t.invitationTitle}`;
    return getGoogleCalendarUrl({
      title: eventTitle,
      start: eventDate,
      location: [venue, address].filter(Boolean).join(', '),
      description: welcomeText || t.invitationTitle,
    });
  })();

  // Background style & color tokens
  const themeStyles = isBirthday
    ? {
        bgColor: '#060B18',
        bgGradient:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30, 58, 110, 0.32), transparent 70%), radial-gradient(ellipse 70% 50% at 50% 110%, rgba(15, 23, 42, 0.45), transparent 80%), repeating-linear-gradient(135deg, rgba(224, 192, 120, 0.018) 0px, rgba(224, 192, 120, 0.018) 2px, transparent 2px, transparent 14px)',
        gold: '#E0C078',
        goldLight: '#F3DC9B',
        goldDark: '#947838',
        goldBorder: 'rgba(224, 192, 120, 0.28)',
        panelBg: 'rgba(10, 17, 40, 0.65)',
        textMain: '#F8FAFC',
        textMuted: '#94A3B8',
        ornamentClass: 'w-56 h-6 text-[#E0C078]',
      }
    : {
        bgColor: '#0B0711',
        bgGradient:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(95, 24, 52, 0.28), transparent 70%), radial-gradient(ellipse 70% 50% at 50% 110%, rgba(28, 16, 42, 0.4), transparent 80%), repeating-linear-gradient(135deg, rgba(201, 165, 90, 0.018) 0px, rgba(201, 165, 90, 0.018) 2px, transparent 2px, transparent 14px)',
        gold: '#C9A55A',
        goldLight: '#E5CB8C',
        goldDark: '#8A6D30',
        goldBorder: 'rgba(201, 165, 90, 0.28)',
        panelBg: 'rgba(18, 12, 29, 0.65)',
        textMain: '#F5F2EB',
        textMuted: '#B8B2A7',
        ornamentClass: 'w-56 h-6 text-[#C9A55A]',
      };

  // Floating controls rendered in both closed and opened states
  const renderFloatingControls = () => (
    <header className="fixed top-3 left-3 right-3 z-50 flex items-center justify-between pointer-events-none max-w-md mx-auto">
      {/* Language Switcher */}
      <nav aria-label="Language selection" className="pointer-events-auto flex items-center gap-1 bg-[#0b0711]/90 border border-white/10 p-1 rounded-full shadow-2xl backdrop-blur-md">
        <Globe className="w-3.5 h-3.5 ml-1.5" style={{ color: themeStyles.gold }} aria-hidden="true" />
        {(['ru', 'uz', 'en'] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => changeLanguage(l)}
            aria-label={`Switch language to ${l.toUpperCase()}`}
            className={`min-h-[32px] px-2.5 py-1 rounded-full text-xs font-semibold uppercase transition-all ${
              currentLang === l
                ? 'text-[#0b0711] font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
            style={{
              backgroundColor: currentLang === l ? themeStyles.gold : 'transparent',
            }}
          >
            {l}
          </button>
        ))}
      </nav>

      {/* Action buttons (Section manager + Audio) */}
      <div className="pointer-events-auto flex items-center gap-2">
        {isPreview && (
          <button
            type="button"
            onClick={() => setShowSectionManager(!showSectionManager)}
            title={t.sectionsManager}
            aria-label={t.sectionsManager}
            className="w-11 h-11 rounded-full bg-[#0b0711]/90 border border-white/10 flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-white/10 transition-all relative"
            style={{ color: themeStyles.gold }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {hiddenSections.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
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
            className="w-11 h-11 rounded-full bg-[#0b0711]/90 border border-white/10 flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-white/10 transition-all"
            style={{ color: themeStyles.gold }}
          >
            {isPlaying ? (
              <div className="flex items-center gap-0.5" aria-hidden="true">
                <span className="w-0.5 h-3 rounded-full animate-bounce" style={{ backgroundColor: themeStyles.gold }} />
                <span className="w-0.5 h-4 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: themeStyles.goldLight }} />
                <span className="w-0.5 h-2.5 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: themeStyles.gold }} />
              </div>
            ) : (
              <VolumeX className="w-4 h-4 opacity-70" />
            )}
          </button>
        )}
      </div>
    </header>
  );

  // Section manager modal in preview
  const renderSectionManagerModal = () => (
    <AnimatePresence>
      {isPreview && showSectionManager && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-16 right-3 left-3 max-w-sm mx-auto z-50 bg-[#0c0915]/95 border rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-stone-100 flex flex-col gap-3"
          style={{ borderColor: themeStyles.goldBorder }}
        >
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: themeStyles.goldBorder }}>
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: themeStyles.gold }}>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {t.sectionsManager}
            </span>
            <button
              type="button"
              onClick={() => setShowSectionManager(false)}
              aria-label={t.close}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-rose-900 text-stone-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {([
              { id: 'hero', name: t.sections.hero },
              { id: 'photo', name: t.sections.photo },
              { id: 'video', name: t.sections.video },
              { id: 'loveStory', name: t.sections.loveStory },
              { id: 'dateVenue', name: t.sections.dateVenue },
              { id: 'schedule', name: t.sections.schedule },
              { id: 'countdown', name: t.sections.countdown },
              { id: 'gallery', name: t.sections.gallery },
              { id: 'rsvp', name: t.sections.rsvp },
              { id: 'giftCard', name: t.sections.giftCard },
            ] as const).map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => toggleHideSection(sec.id)}
                className={`min-h-[36px] py-2 px-2.5 rounded-xl text-xs font-medium border flex items-center justify-between gap-1 transition-all ${
                  isSectionVisible(sec.id)
                    ? 'bg-white/5 text-stone-100'
                    : 'bg-stone-900/60 border-stone-800 text-stone-500 line-through'
                }`}
                style={{
                  borderColor: isSectionVisible(sec.id) ? themeStyles.goldBorder : undefined,
                }}
              >
                <span className="truncate text-left">{sec.name}</span>
                {isSectionVisible(sec.id) ? (
                  <Eye className="w-3.5 h-3.5 shrink-0" style={{ color: themeStyles.gold }} />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                )}
              </button>
            ))}
          </div>

          {hiddenSections.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setHiddenSections([]);
                if (onToggleSection) {
                  hiddenSections.forEach((id) => onToggleSection(id));
                }
              }}
              className="mt-1 w-full min-h-[40px] py-2 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md text-[#0b0711]"
              style={{ backgroundColor: themeStyles.gold }}
            >
              {t.restoreAll}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Quick toggle hide button on each section in isPreview
  const renderQuickHideBtn = (sectionId: string) => {
    if (!isPreview) return null;
    return (
      <button
        type="button"
        onClick={() => toggleHideSection(sectionId)}
        title={t.hideSectionHint}
        aria-label={`${t.hideSectionHint} (${sectionId})`}
        className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-rose-900/90 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
      >
        <EyeOff className="w-4 h-4" />
      </button>
    );
  };

  // -------------------------------------------------------------
  // SCREEN 1: CLOSED ENVELOPE / COVER SCREEN (when !opened)
  // -------------------------------------------------------------
  if (!opened) {
    return (
      <div
        className={`w-full ${
          isPreview ? 'h-full min-h-full p-4' : 'min-h-[100dvh] p-6'
        } flex flex-col items-center justify-center relative overflow-hidden select-none text-center`}
        style={{
          backgroundColor: themeStyles.bgColor,
          backgroundImage: themeStyles.bgGradient,
          color: themeStyles.textMain,
          fontFamily: "'Montserrat', -apple-system, sans-serif",
        }}
      >
        {renderFloatingControls()}
        {renderSectionManagerModal()}

        <main className="w-full max-w-sm relative z-10 flex flex-col items-center gap-5 p-6 sm:p-8 rounded-2xl border backdrop-blur-md shadow-2xl"
          style={{
            backgroundColor: themeStyles.panelBg,
            borderColor: themeStyles.goldBorder,
          }}
        >
          {/* Monogram rhombus */}
          <AtlasMonogram
            groomInitial={groomInitial}
            brideInitial={brideInitial}
            isBirthday={isBirthday}
            className="w-20 h-20"
          />

          {/* Invitation title */}
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-xs uppercase tracking-[0.35em] font-semibold"
              style={{ color: themeStyles.gold }}
            >
              {t.invitationTitle}
            </span>
            <div className="h-[1px] w-12 my-1" style={{ backgroundColor: themeStyles.gold }} />
          </div>

          {/* Names */}
          <h1
            className="text-3xl sm:text-4xl font-serif font-normal leading-tight tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {isBirthday ? (
              <span>{groomName}</span>
            ) : (
              <>
                <span className="block">{groomName}</span>
                <span className="block text-2xl font-light my-0.5" style={{ color: themeStyles.gold }}>
                  &
                </span>
                <span className="block">{brideName}</span>
              </>
            )}
          </h1>

          {/* Date words */}
          <p className="text-xs sm:text-sm tracking-wide" style={{ color: themeStyles.textMuted }}>
            {formattedDateObj.full}
          </p>

          <AtlasOrnament className={themeStyles.ornamentClass} />

          {/* Open envelope button */}
          <button
            type="button"
            onClick={handleOpenEnvelopeClick}
            className="w-full min-h-[48px] py-3.5 px-6 font-semibold text-xs sm:text-sm uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer text-[#0b0711] flex items-center justify-center gap-2"
            style={{
              backgroundColor: themeStyles.gold,
            }}
          >
            <span>{t.openEnvelopeBtn}</span>
          </button>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULL SITE (when opened === true)
  // -------------------------------------------------------------
  const containerClasses = isPreview
    ? 'w-full h-full overflow-y-auto p-4 select-none scrollbar-thin relative'
    : 'min-h-[100dvh] py-6 px-4 flex flex-col items-center select-none relative overflow-x-hidden';

  const innerClasses = 'w-full max-w-md mx-auto flex flex-col items-center text-center relative z-20';

  return (
    <div
      className={containerClasses}
      style={{
        backgroundColor: themeStyles.bgColor,
        backgroundImage: themeStyles.bgGradient,
        color: themeStyles.textMain,
        fontFamily: "'Montserrat', -apple-system, sans-serif",
      }}
    >
      {renderFloatingControls()}
      {renderSectionManagerModal()}

      <div className={innerClasses}>
        {/* ========================================================
            1. HERO / ОБЛОЖКА (The ONLY full-screen block)
        ======================================================== */}
        {isSectionVisible('hero') && (
          <section
            aria-label={t.sections.hero}
            className={`w-full ${
              isPreview ? 'min-h-[500px]' : 'min-h-[100dvh]'
            } flex flex-col items-center justify-center py-12 px-2 relative`}
          >
            {renderQuickHideBtn('hero')}

            <motion.div
              initial={calmMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full flex flex-col items-center gap-5 my-auto"
            >
              {/* Monogram in gold rhombus */}
              <AtlasMonogram
                groomInitial={groomInitial}
                brideInitial={brideInitial}
                isBirthday={isBirthday}
                className="w-24 h-24 sm:w-28 sm:h-28"
              />

              {/* Title */}
              <span
                className="text-xs uppercase tracking-[0.35em] font-semibold"
                style={{ color: themeStyles.gold }}
              >
                {t.invitationTitle}
              </span>

              {/* Names large in Cormorant Garamond */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal leading-tight tracking-wide"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: themeStyles.textMain,
                }}
              >
                {isBirthday ? (
                  <span>{groomName}</span>
                ) : (
                  <>
                    <span className="block">{groomName}</span>
                    <span
                      className="block text-2xl sm:text-3xl font-light my-1"
                      style={{ color: themeStyles.gold }}
                    >
                      &
                    </span>
                    <span className="block">{brideName}</span>
                  </>
                )}
              </h1>

              {/* Animated gold thread (SVG pathLength draws once) */}
              <svg
                viewBox="0 0 220 30"
                className="w-56 h-7 mx-auto my-1 overflow-visible"
                style={{ color: themeStyles.gold }}
                aria-hidden="true"
              >
                <motion.path
                  d="M 10 15 Q 60 5 110 15 T 210 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  initial={calmMotion ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                />
                <circle cx="110" cy="15" r="2.5" fill="currentColor" />
              </svg>

              {/* Date in words */}
              <p
                className="text-sm sm:text-base font-medium tracking-wide max-w-xs"
                style={{ color: themeStyles.textMuted }}
              >
                {formattedDateObj.full}
              </p>
            </motion.div>

            {/* Scroll down hint */}
            <div
              className="mt-auto pt-8 flex flex-col items-center gap-1.5 text-xs uppercase tracking-[0.25em] select-none"
              style={{ color: themeStyles.gold }}
            >
              <span>{t.scrollDown}</span>
              <ChevronDown className="w-4 h-4 animate-bounce" aria-hidden="true" />
            </div>
          </section>
        )}

        {/* Divider */}
        {isSectionVisible('hero') && (
          <div className="w-full flex items-center justify-center py-4" aria-hidden="true">
            <AtlasOrnament className={themeStyles.ornamentClass} />
          </div>
        )}

        {/* ========================================================
            2. ГЛАВНОЕ ФОТО (Full screen width, no card, no border)
        ======================================================== */}
        {isSectionVisible('photo') && heroPhotoUrl && (
          <section
            aria-label={t.sections.photo}
            className="w-full relative my-4 overflow-hidden"
          >
            {renderQuickHideBtn('photo')}

            <div className="w-full aspect-[4/5] sm:aspect-[16/10] relative overflow-hidden">
              <img
                src={heroPhotoUrl}
                alt={isBirthday ? groomName : `${groomName} & ${brideName}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              {/* Soft gradient bottom overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#0b0711] via-transparent to-transparent flex flex-col justify-end p-6 text-left"
              >
                <span
                  className="text-xs uppercase tracking-[0.3em] font-semibold"
                  style={{ color: themeStyles.gold }}
                >
                  {isBirthday ? groomName : `${groomName} & ${brideName}`}
                </span>
                <p
                  className="text-base font-serif italic text-stone-200 mt-1"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {formattedDateObj.full}
                </p>
              </div>
            </div>

            <div className="w-full flex items-center justify-center py-6" aria-hidden="true">
              <AtlasOrnament className={themeStyles.ornamentClass} />
            </div>
          </section>
        )}

        {/* ========================================================
            3. ОБРАЩЕНИЕ (welcomeText + loveStory, no card, gold drop-cap)
        ======================================================== */}
        {isSectionVisible('loveStory') && (welcomeText || loveStory) && (
          <section
            aria-label={t.sections.loveStory}
            className="w-full py-6 px-4 relative flex flex-col items-center gap-4 text-left sm:text-center"
          >
            {renderQuickHideBtn('loveStory')}

            <span
              className="text-xs uppercase tracking-[0.35em] font-semibold text-center"
              style={{ color: themeStyles.gold }}
            >
              {isBirthday ? t.ourStoryTitle : t.ourStoryTitle}
            </span>

            {/* Paragraph with gold drop cap */}
            {(() => {
              const mainText = welcomeText || loveStory;
              const firstLetter = mainText.charAt(0);
              const restText = mainText.slice(1);
              return (
                <div className="w-full text-[17px] sm:text-[18px] leading-relaxed font-light text-[#E8E4DC]">
                  <p className="text-justify sm:text-center">
                    <span
                      className="float-left text-5xl sm:text-6xl font-serif font-bold mr-3 leading-none select-none"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        color: themeStyles.gold,
                      }}
                    >
                      {firstLetter}
                    </span>
                    {restText}
                  </p>
                  {welcomeText && loveStory && (
                    <p className="mt-4 text-[16px] sm:text-[17px] italic text-[#C7C2B6] text-justify sm:text-center">
                      {loveStory}
                    </p>
                  )}
                </div>
              );
            })()}

            <div className="w-full flex items-center justify-center pt-6" aria-hidden="true">
              <AtlasOrnament className={themeStyles.ornamentClass} />
            </div>
          </section>
        )}

        {/* ========================================================
            4. ДАТА И МЕСТО (Translucent panel 1 of 2)
        ======================================================== */}
        {isSectionVisible('dateVenue') && (
          <section
            aria-label={t.sections.dateVenue}
            className="w-full my-4 relative"
          >
            {renderQuickHideBtn('dateVenue')}

            <div
              className="w-full rounded-2xl border p-6 sm:p-8 backdrop-blur-sm shadow-xl flex flex-col items-center gap-6"
              style={{
                backgroundColor: themeStyles.panelBg,
                borderColor: themeStyles.goldBorder,
              }}
            >
              <span
                className="text-xs uppercase tracking-[0.35em] font-semibold"
                style={{ color: themeStyles.gold }}
              >
                {t.dateAndPlace}
              </span>

              {/* Large Day Number */}
              <div className="flex flex-col items-center">
                <span
                  className="text-6xl sm:text-7xl font-serif font-normal leading-none"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: themeStyles.gold,
                  }}
                >
                  {formattedDateObj.day}
                </span>
                <span className="text-base sm:text-lg uppercase tracking-widest font-serif mt-2">
                  {formattedDateObj.month} {formattedDateObj.year}
                </span>
                <span
                  className="text-xs uppercase tracking-[0.2em] mt-1"
                  style={{ color: themeStyles.textMuted }}
                >
                  {formattedDateObj.weekday}
                </span>
                <span
                  className="text-sm font-semibold tracking-wide mt-2"
                  style={{ color: themeStyles.gold }}
                >
                  {t.timeLabel}: {time}
                </span>
              </div>

              {/* Venue & Address */}
              {(venue || address) && (
                <div className="w-full border-t pt-4 flex flex-col items-center gap-1.5" style={{ borderColor: themeStyles.goldBorder }}>
                  {venue && (
                    <h3
                      className="text-xl sm:text-2xl font-serif font-normal"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {venue}
                    </h3>
                  )}
                  {address && (
                    <p className="text-xs sm:text-sm max-w-xs" style={{ color: themeStyles.textMuted }}>
                      {address}
                    </p>
                  )}
                </div>
              )}

              {/* Navigation & Address Action Buttons */}
              <div className="w-full flex flex-col gap-2.5 pt-2">
                {address && (
                  <button
                    type="button"
                    onClick={() => copyAddress(address)}
                    aria-label={addressCopied ? t.addressCopied : t.copyAddress}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10"
                    style={{ borderColor: themeStyles.goldBorder, color: themeStyles.textMain }}
                  >
                    {addressCopied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" style={{ color: themeStyles.gold }} />
                    )}
                    <span>{addressCopied ? t.addressCopied : t.copyAddress}</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={getYandexMapsUrl(venue, address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.yandexMaps}
                    className="min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 transition-colors"
                    style={{ borderColor: themeStyles.goldBorder, color: themeStyles.textMain }}
                  >
                    <Navigation className="w-3.5 h-3.5" style={{ color: themeStyles.gold }} />
                    <span>{t.yandexMaps}</span>
                  </a>

                  <a
                    href={getGoogleMapsUrl(venue, address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.googleMaps}
                    className="min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 transition-colors"
                    style={{ borderColor: themeStyles.goldBorder, color: themeStyles.textMain }}
                  >
                    <MapPin className="w-3.5 h-3.5" style={{ color: themeStyles.gold }} />
                    <span>{t.googleMaps}</span>
                  </a>
                </div>

                {/* Add to Calendar */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    aria-label={t.downloadIcs}
                    className="min-h-[44px] py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 transition-colors"
                    style={{ borderColor: themeStyles.goldBorder, color: themeStyles.textMain }}
                  >
                    <Calendar className="w-3.5 h-3.5" style={{ color: themeStyles.gold }} />
                    <span>{t.downloadIcs}</span>
                  </button>

                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.googleCalendar}
                    className="min-h-[44px] py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 transition-colors"
                    style={{ borderColor: themeStyles.goldBorder, color: themeStyles.textMain }}
                  >
                    <Calendar className="w-3.5 h-3.5" style={{ color: themeStyles.gold }} />
                    <span>{t.googleCalendar}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-center py-6" aria-hidden="true">
              <AtlasOrnament className={themeStyles.ornamentClass} />
            </div>
          </section>
        )}

        {/* ========================================================
            5. ПРОГРАММА ВЕЧЕРА (Timeline on silk with gold thread)
        ======================================================== */}
        {isSectionVisible('schedule') && resolvedSchedule.length > 0 && (
          <section
            aria-label={t.sections.schedule}
            className="w-full py-4 px-2 relative flex flex-col items-center"
          >
            {renderQuickHideBtn('schedule')}

            <span
              className="text-xs uppercase tracking-[0.35em] font-semibold mb-6"
              style={{ color: themeStyles.gold }}
            >
              {t.scheduleTitle}
            </span>

            {/* Timeline container */}
            <div className="w-full max-w-sm flex flex-col gap-6 text-left relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gradient-to-b before:from-[#C9A55A] before:to-transparent">
              {resolvedSchedule.map((item: any, i: number) => {
                const itemTime = item.time || '';
                const itemTitle = item.title || item.label || '';
                const itemDesc = item.desc || '';
                return (
                  <div key={i} className="relative flex flex-col">
                    {/* Glowing gold dot marker */}
                    <div
                      className="absolute -left-8 top-1 w-6 h-6 rounded-full border flex items-center justify-center shadow-md"
                      style={{
                        backgroundColor: themeStyles.bgColor,
                        borderColor: themeStyles.gold,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: themeStyles.gold }}
                      />
                    </div>

                    {/* Time large digits tabular-nums */}
                    <span
                      className="font-mono text-base sm:text-lg font-bold tabular-nums"
                      style={{ color: themeStyles.gold }}
                    >
                      {itemTime}
                    </span>

                    {/* Title */}
                    <h4
                      className="text-base sm:text-lg font-serif font-normal text-stone-100 mt-0.5"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {itemTitle}
                    </h4>

                    {/* Description */}
                    {itemDesc && (
                      <p className="text-xs sm:text-sm mt-0.5" style={{ color: themeStyles.textMuted }}>
                        {itemDesc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="w-full flex items-center justify-center pt-8 pb-4" aria-hidden="true">
              <AtlasOrnament className={themeStyles.ornamentClass} />
            </div>
          </section>
        )}

        {/* ========================================================
            6. ТАЙМЕР ОТСЧЕТА (4 numbers in 1 row, thin dividers)
        ======================================================== */}
        {isSectionVisible('countdown') && (
          <section
            aria-label={t.sections.countdown}
            className="w-full py-4 relative flex flex-col items-center"
          >
            {renderQuickHideBtn('countdown')}

            <span
              className="text-xs uppercase tracking-[0.35em] font-semibold mb-4"
              style={{ color: themeStyles.gold }}
            >
              {t.countdownTitle}
            </span>

            {currentDifference.isPassed ? (
              <p
                className="text-base font-serif italic py-3"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: themeStyles.gold,
                }}
              >
                {t.passed}
              </p>
            ) : (
              <div
                className="w-full max-w-sm mx-auto py-4 px-3 rounded-xl border flex items-center justify-between"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderColor: themeStyles.goldBorder,
                }}
              >
                {[
                  { label: t.days, val: currentDifference.days },
                  { label: t.hours, val: currentDifference.hours },
                  { label: t.minutes, val: currentDifference.minutes },
                  { label: t.seconds, val: currentDifference.seconds },
                ].map((item, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div className="flex-1 flex flex-col items-center">
                      <span
                        className="font-mono text-2xl sm:text-3xl font-light tabular-nums leading-none"
                        style={{ color: themeStyles.gold }}
                      >
                        {String(item.val).padStart(2, '0')}
                      </span>
                      <span
                        className="text-[11px] sm:text-xs uppercase tracking-wider mt-1.5"
                        style={{ color: themeStyles.textMuted }}
                      >
                        {item.label}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div
                        className="w-[1px] h-8 shrink-0"
                        style={{ backgroundColor: themeStyles.goldBorder }}
                        aria-hidden="true"
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="w-full flex items-center justify-center pt-6 pb-2" aria-hidden="true">
              <AtlasOrnament className={themeStyles.ornamentClass} />
            </div>
          </section>
        )}

        {/* ========================================================
            7. ГАЛЕРЕЯ (Asymmetric grid: 1 large + 2 small, repeat)
        ======================================================== */}
        {isSectionVisible('gallery') && galleryPhotos.length > 0 && (
          <section
            aria-label={t.sections.gallery}
            className="w-full py-4 relative flex flex-col items-center"
          >
            {renderQuickHideBtn('gallery')}

            <span
              className="text-xs uppercase tracking-[0.35em] font-semibold mb-5"
              style={{ color: themeStyles.gold }}
            >
              {t.galleryTitle}
            </span>

            {/* Asymmetric layout: 1 big + 2 small */}
            <div className="w-full grid grid-cols-2 gap-2.5">
              {galleryPhotos.map((url, idx) => {
                const isLarge = idx % 3 === 0;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    aria-label={`Open photo ${idx + 1}`}
                    className={`relative overflow-hidden rounded-xl border border-white/10 group cursor-pointer ${
                      isLarge ? 'col-span-2 aspect-[16/10]' : 'col-span-1 aspect-square'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Gallery item ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </button>
                );
              })}
            </div>

            <div className="w-full flex items-center justify-center pt-6 pb-2" aria-hidden="true">
              <AtlasOrnament className={themeStyles.ornamentClass} />
            </div>
          </section>
        )}

        {/* LIGHTBOX MODAL with swipe and Esc */}
        <AnimatePresence>
          {activePhotoIdx !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 select-none"
              onClick={() => setActivePhotoIdx(null)}
              onTouchStart={(e) => {
                touchStartXRef.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (touchStartXRef.current === null || activePhotoIdx === null) return;
                const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
                if (deltaX > 50) {
                  // Swipe right -> prev
                  setActivePhotoIdx((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : galleryPhotos.length - 1
                  );
                } else if (deltaX < -50) {
                  // Swipe left -> next
                  setActivePhotoIdx((prev) =>
                    prev !== null && prev < galleryPhotos.length - 1 ? prev + 1 : 0
                  );
                }
                touchStartXRef.current = null;
              }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setActivePhotoIdx(null)}
                aria-label={t.close}
                className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-rose-900 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : galleryPhotos.length - 1
                  );
                }}
                aria-label={t.prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Image container */}
              <div
                className="relative max-w-lg w-full max-h-[85vh] rounded-xl overflow-hidden border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={galleryPhotos[activePhotoIdx]}
                  alt={`Photo view ${activePhotoIdx + 1}`}
                  loading="eager"
                  className="w-full h-full max-h-[85vh] object-contain bg-black"
                />
              </div>

              {/* Next button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx((prev) =>
                    prev !== null && prev < galleryPhotos.length - 1 ? prev + 1 : 0
                  );
                }}
                aria-label={t.nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================
            8. ВИДЕО (Rendered only if data.videoUrl exists)
        ======================================================== */}
        {isSectionVisible('video') && data.videoUrl && (
          <section
            aria-label={t.sections.video}
            className="w-full py-4 relative flex flex-col items-center"
          >
            {renderQuickHideBtn('video')}

            <span
              className="text-xs uppercase tracking-[0.35em] font-semibold mb-4"
              style={{ color: themeStyles.gold }}
            >
              {t.videoTitle}
            </span>

            <div
              className="w-full aspect-video rounded-2xl overflow-hidden border bg-black shadow-xl"
              style={{ borderColor: themeStyles.goldBorder }}
            >
              <video
                src={getMediaUrl(data.videoUrl)}
                controls
                preload="metadata"
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full flex items-center justify-center pt-6 pb-2" aria-hidden="true">
              <AtlasOrnament className={themeStyles.ornamentClass} />
            </div>
          </section>
        )}

        {/* ========================================================
            9. RSVP (Translucent panel 2 of 2)
        ======================================================== */}
        {isSectionVisible('rsvp') && (
          <section
            aria-label={t.sections.rsvp}
            className="w-full my-4 relative"
          >
            {renderQuickHideBtn('rsvp')}

            <div
              className="w-full rounded-2xl border p-6 sm:p-8 backdrop-blur-sm shadow-xl flex flex-col gap-5 text-left"
              style={{
                backgroundColor: themeStyles.panelBg,
                borderColor: themeStyles.goldBorder,
              }}
            >
              <div className="flex flex-col items-center text-center gap-1">
                <span
                  className="text-xs uppercase tracking-[0.35em] font-semibold"
                  style={{ color: themeStyles.gold }}
                >
                  {t.rsvpTitle}
                </span>
                <p className="text-xs sm:text-sm" style={{ color: themeStyles.textMuted }}>
                  {t.rsvpSubtitle}
                </p>
              </div>

              {rsvpIsSuccess ? (
                <div
                  className="rounded-xl border p-6 text-center flex flex-col items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    borderColor: 'rgba(16, 185, 129, 0.35)',
                    color: '#6EE7B7',
                  }}
                >
                  <span className="text-base font-semibold">{t.thankYouRsvp}</span>
                  <p className="text-xs opacity-90">{t.thankYouRsvpDesc}</p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4">
                  {/* Name field (min 48px height) */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="rsvp-name-input" className="text-xs font-medium" style={{ color: themeStyles.textMuted }}>
                      {t.yourName}
                    </label>
                    <input
                      id="rsvp-name-input"
                      type="text"
                      required
                      placeholder={t.yourName}
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full min-h-[48px] px-4 rounded-xl border bg-black/40 text-sm sm:text-base text-stone-100 outline-none transition-colors"
                      style={{
                        borderColor: themeStyles.goldBorder,
                      }}
                    />
                  </div>

                  {/* Attendance 2 large segments */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium" style={{ color: themeStyles.textMuted }}>
                      {t.willAttend}
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending(true)}
                        className={`min-h-[48px] px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          rsvpAttending === true
                            ? 'text-stone-900 shadow-md font-bold'
                            : 'bg-black/30 border-white/10 text-stone-400 hover:border-white/20'
                        }`}
                        style={{
                          backgroundColor: rsvpAttending === true ? themeStyles.gold : undefined,
                          borderColor: rsvpAttending === true ? themeStyles.gold : undefined,
                        }}
                      >
                        <Check className="w-4 h-4 shrink-0" />
                        <span>{t.yes}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRsvpAttending(false)}
                        className={`min-h-[48px] px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          rsvpAttending === false
                            ? 'bg-rose-900/60 border-rose-500 text-rose-200 shadow-md font-bold'
                            : 'bg-black/30 border-white/10 text-stone-400 hover:border-white/20'
                        }`}
                      >
                        <X className="w-4 h-4 shrink-0" />
                        <span>{t.no}</span>
                      </button>
                    </div>
                  </div>

                  {/* Guest count counter (− / + buttons) */}
                  {rsvpAttending !== false && (
                    <div className="flex items-center justify-between py-2 border-y border-white/10">
                      <span className="text-xs sm:text-sm font-medium" style={{ color: themeStyles.textMain }}>
                        {t.guestCountLabel}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setRsvpGuestCount(Math.max(1, (rsvpGuestCount || 1) - 1))}
                          aria-label={t.decreaseGuests}
                          className="w-11 h-11 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center active:scale-95 transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span
                          className="w-8 text-center font-mono text-base font-bold tabular-nums"
                          style={{ color: themeStyles.gold }}
                        >
                          {rsvpGuestCount || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => setRsvpGuestCount(Math.min(10, (rsvpGuestCount || 1) + 1))}
                          aria-label={t.increaseGuests}
                          className="w-11 h-11 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center active:scale-95 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Wishes field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="rsvp-wishes-input" className="text-xs font-medium" style={{ color: themeStyles.textMuted }}>
                      {t.wishesPlaceholder}
                    </label>
                    <textarea
                      id="rsvp-wishes-input"
                      rows={3}
                      placeholder={t.wishesPlaceholder}
                      value={rsvpWishes}
                      onChange={(e) => setRsvpWishes(e.target.value)}
                      className="w-full p-3 rounded-xl border bg-black/40 text-sm sm:text-base text-stone-100 outline-none transition-colors"
                      style={{
                        borderColor: themeStyles.goldBorder,
                      }}
                    />
                  </div>

                  <PrivacyConsentCheckbox lang={currentLang} />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={rsvpIsSubmitting || rsvpAttending === null}
                    className="w-full min-h-[48px] py-3 px-6 font-semibold rounded-xl text-xs sm:text-sm uppercase tracking-wider text-[#0b0711] shadow-lg disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: themeStyles.gold,
                    }}
                  >
                    {rsvpIsSubmitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-[#0b0711] border-t-transparent animate-spin" />
                        <span>{t.sending}</span>
                      </>
                    ) : (
                      <span>{t.sendRsvp}</span>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="w-full flex items-center justify-center py-6" aria-hidden="true">
              <AtlasOrnament className={themeStyles.ornamentClass} />
            </div>
          </section>
        )}

        {/* ========================================================
            10. ПОДАРКИ (Only if giftCardNumber exists or masked in preview)
        ======================================================== */}
        {isSectionVisible('giftCard') && displayCardNumber && (
          <section
            aria-label={t.sections.giftCard}
            className="w-full py-4 relative flex flex-col items-center gap-3"
          >
            {renderQuickHideBtn('giftCard')}

            <span
              className="text-xs uppercase tracking-[0.35em] font-semibold"
              style={{ color: themeStyles.gold }}
            >
              {t.giftTitle}
            </span>

            <p className="text-xs sm:text-sm max-w-xs" style={{ color: themeStyles.textMuted }}>
              {t.giftSubtitle}
            </p>

            <div
              className="w-full max-w-sm rounded-xl border p-4 flex flex-col items-center gap-2.5 mt-1"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderColor: themeStyles.goldBorder,
              }}
            >
              {!hasGiftCard && isPreview && (
                <span className="text-[11px] uppercase tracking-wider text-amber-400/80 font-medium">
                  {t.giftCardExampleLabel}
                </span>
              )}

              <span
                className="text-base sm:text-lg font-mono font-bold tracking-wider"
                style={{ color: themeStyles.gold }}
              >
                {displayCardNumber}
              </span>

              {data.giftCardOwner && (
                <span className="text-xs" style={{ color: themeStyles.textMuted }}>
                  {t.cardOwner}: {data.giftCardOwner}
                </span>
              )}

              {hasGiftCard && (
                <button
                  type="button"
                  onClick={() => copyCard(data.giftCardNumber || '')}
                  aria-label={cardCopied ? t.copiedText : t.copyCard}
                  className="min-h-[44px] py-2 px-4 rounded-lg border text-xs font-semibold flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors"
                  style={{
                    borderColor: themeStyles.goldBorder,
                    color: themeStyles.textMain,
                  }}
                >
                  {cardCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" style={{ color: themeStyles.gold }} />
                  )}
                  <span>{cardCopied ? t.copiedText : t.copyCard}</span>
                </button>
              )}
            </div>

            <div className="w-full flex items-center justify-center pt-6 pb-2" aria-hidden="true">
              <AtlasOrnament className={themeStyles.ornamentClass} />
            </div>
          </section>
        )}

        {/* ========================================================
            11. ПОДВАЛ / FOOTER
        ======================================================== */}
        <footer className="w-full pt-4 pb-12 flex flex-col items-center gap-2 select-none">
          <p
            className="text-base sm:text-lg font-serif tracking-wider"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: themeStyles.textMain,
            }}
          >
            {isBirthday ? groomName : `${groomName} & ${brideName}`}
          </p>

          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: themeStyles.textMuted }}>
            {formattedDateObj.full}
          </p>

          {data.phone && (
            <a
              href={`tel:${data.phone}`}
              aria-label={`Call ${data.phone}`}
              className="mt-2 min-h-[44px] px-3 py-2 rounded-full border text-xs font-medium flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors"
              style={{
                borderColor: themeStyles.goldBorder,
                color: themeStyles.gold,
              }}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{data.phone}</span>
            </a>
          )}
        </footer>
      </div>
    </div>
  );
};
