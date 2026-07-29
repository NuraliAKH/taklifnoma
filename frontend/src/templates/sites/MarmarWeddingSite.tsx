import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, Clock, VolumeX,
  Send, Copy, Check, Gift, Phone, Navigation,
  Crown, Shirt, X, Plus, Image as ImageIcon,
  Globe, Maximize2, Upload, SlidersHorizontal, Eye
} from 'lucide-react';
import type { WebsiteTemplateProps } from './types';
import { useCountdownTimer } from '../../utils/timer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getMediaUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

// ==========================================
// Marmar Gold & Marble Ambient Particles
// ==========================================
const MarmarParticleSystem = ({ isPreview }: { isPreview?: boolean }) => {
  if (isPreview) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {[...Array(14)].map((_, i) => (
        <motion.div
          key={`gold-dust-${i}`}
          className="absolute rounded-full"
          style={{
            top: `${(i * 15) % 100}%`,
            left: `${(i * 27) % 100}%`,
            width: `${4 + (i % 3) * 3}px`,
            height: `${4 + (i % 3) * 3}px`,
            background: i % 2 === 0
              ? 'radial-gradient(circle, rgba(212,175,55,0.7) 0%, rgba(212,175,55,0) 70%)'
              : 'radial-gradient(circle, rgba(255,235,175,0.6) 0%, rgba(245,158,11,0) 70%)',
            boxShadow: '0 0 8px rgba(212, 175, 55, 0.3)',
          }}
          animate={{
            y: [0, -65, 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            opacity: [0.15, 0.7, 0.15],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 6 + (i % 4),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
};

// ==========================================
// Golden Particle Ripple Burst
// ==========================================
const GoldBurst = ({ active }: { active: boolean }) => {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {[...Array(24)].map((_, i) => {
        const angle = (i / 24) * 360;
        const radius = 60 + Math.random() * 80;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={`gold-burst-${i}`}
            className="absolute rounded-full bg-amber-400"
            style={{
              width: `${4 + Math.random() * 4}px`,
              height: `${4 + Math.random() * 4}px`,
              boxShadow: '0 0 6px rgba(212, 175, 55, 0.8)',
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ 
              x, 
              y, 
              scale: [1, 1.3, 0], 
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
};

// ==========================================
// Luxury Wedding Envelope & Wax Seal Entrance Screen
// ==========================================
const EnvelopeEntranceAnimation = ({ 
  groomName, 
  brideName, 
  onOpen, 
  t 
}: { 
  groomName: string; 
  brideName: string; 
  onOpen?: () => void; 
  t: any;
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [burstActive, setBurstActive] = useState(false);

  const handleOpenClick = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setBurstActive(true);

    setTimeout(() => {
      if (onOpen) onOpen();
    }, 850);
  };

  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black text-amber-100 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <GoldBurst active={burstActive} />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-20 text-center max-w-sm flex flex-col items-center gap-2 mb-4"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-amber-400 font-semibold">
          {t.invitationTitle}
        </span>
        <h1 className="text-3xl font-serif font-bold text-amber-50 tracking-wider">
          {groomName} <span className="text-amber-400 font-light">&</span> {brideName}
        </h1>
        <p className="text-xs text-amber-200/70 font-serif italic max-w-xs mt-1">
          "{t.welcomeText}"
        </p>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-20 w-full max-w-sm flex flex-col items-center my-2"
      >
        <div className="w-full bg-gradient-to-b from-stone-850 via-stone-900 to-stone-950 border-2 border-amber-400/60 rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden flex flex-col items-center text-center gap-5">
          
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400/50 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400/50 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400/50 rounded-br-lg" />

          <div className="w-full h-40 relative flex items-center justify-center overflow-hidden">
            <motion.div
              animate={{ 
                y: [0, -6, 0],
                scale: [1, 1.03, 1]
              }}
              transition={{ 
                duration: 3.5, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="relative w-64 h-36 flex items-center justify-center pointer-events-none"
              style={{
                maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 80%)',
                WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 80%)'
              }}
            >
              <img 
                src="/wedding_doves.png" 
                alt="Wedding Doves" 
                className="w-full h-full object-cover scale-110 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
              />
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.15)_0%,_transparent_75%)]" />
            </motion.div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-[0.25em] text-amber-400/80 font-bold">
              Marmar Saroyi
            </span>
            <h2 className="text-xl font-serif font-bold text-amber-100">
              {groomName} & {brideName}
            </h2>
          </div>

          <div className="relative my-2 flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-24 h-24 rounded-full bg-amber-500/20 blur-md"
            />

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenClick}
              disabled={isTransitioning}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-2xl relative z-10 cursor-pointer flex items-center justify-center group"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-600 via-amber-800 to-amber-950 border border-amber-300/80 flex flex-col items-center justify-center text-amber-200 shadow-inner">
                <Crown className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform mb-0.5" />
                <span className="text-[10px] font-serif font-bold tracking-widest text-amber-100">
                  {groomName.charAt(0)}&{brideName.charAt(0)}
                </span>
              </div>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenClick}
            disabled={isTransitioning}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-xs tracking-wider transition-all border border-amber-300"
          >
            <span>{isTransitioning ? t.openingText : t.openEnvelopeBtn}</span>
          </motion.button>
        </div>
      </motion.div>

      <span className="text-[10px] uppercase tracking-widest text-amber-400/50 font-mono z-20 mt-2">
        {t.ringTouchHint}
      </span>
    </div>
  );
};

// ==========================================
// Main Marmar Wedding Site Component
// ==========================================
export const MarmarWeddingSite: React.FC<WebsiteTemplateProps> = ({
  data,
  customFields = [],
  lang = 'ru',
  isOpened = true,
  onOpenEnvelope,
  isPlaying = false,
  onToggleAudio,
  timeLeft,
  rsvpState,
  isPreview = false,
  onToggleSection,
  onLanguageChange
}) => {
  const currentDifference = useCountdownTimer(data.date, data.time, timeLeft);
  const [currentLang, setCurrentLang] = useState<'ru' | 'uz' | 'en'>(lang || 'ru');
  const [hiddenSections, setHiddenSections] = useState<string[]>(data.hiddenSections || []);

  useEffect(() => {
    if (data.hiddenSections) {
      setHiddenSections(data.hiddenSections);
    }
  }, [data.hiddenSections]);
  const [showSectionManager, setShowSectionManager] = useState<boolean>(false);

  // Photo gallery and hero photo states
  const defaultPhoto = data.photoUrl ? getMediaUrl(data.photoUrl) : 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop';
  const defaultGallery = data.photos && data.photos.length > 0 
    ? data.photos.map(p => getMediaUrl(p))
    : [
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop',
      ];

  const [heroPhoto, setHeroPhoto] = useState<string>(defaultPhoto);
  const [photos, setPhotos] = useState<string[]>(defaultGallery);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [activeModalPhoto, setActiveModalPhoto] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [goldBurstActive, setGoldBurstActive] = useState(false);
  const [guestLikes, setGuestLikes] = useState(148);
  const [hasLiked, setHasLiked] = useState(false);

  const groomName = data.groomName || 'Акмаль';
  const brideName = data.brideName || 'Дильноза';
  const date = data.date || '2026-08-15';
  const time = data.time || '17:00';
  const venue = data.venue || 'Marmar Saroyi';
  const address = data.address || 'г. Ташкент, Юнусабадский район, ул. Амира Темура, 12';
  const loveStory = data.loveStory;
  const phone = data.phone;
  const giftCardNumber = data.giftCardNumber || '8600 5501 9922 4310';
  const giftCardOwner = data.giftCardOwner || `${groomName} А.`;

  const isSectionVisible = (sectionKey: string) => {
    if (hiddenSections.includes(sectionKey)) return false;
    if ((sectionKey === 'giftCard' || sectionKey === 'gift') && (hiddenSections.includes('giftCard') || hiddenSections.includes('gift'))) return false;
    if ((sectionKey === 'dateVenue' || sectionKey === 'venue' || sectionKey === 'calendar') && (hiddenSections.includes('dateVenue') || hiddenSections.includes('venue') || hiddenSections.includes('calendar'))) return false;
    if ((sectionKey === 'photo' || sectionKey === 'couple') && (hiddenSections.includes('photo') || hiddenSections.includes('couple') || hiddenSections.includes('showHeroPhoto'))) return false;
    return true;
  };

  const toggleHideSection = (sectionKey: string) => {
    setHiddenSections(prev => {
      const updated = prev.includes(sectionKey)
        ? prev.filter(k => k !== sectionKey)
        : [...prev, sectionKey];
      return updated;
    });
    if (onToggleSection) onToggleSection(sectionKey);
  };

  const changeLanguage = (newLang: 'ru' | 'uz' | 'en') => {
    setCurrentLang(newLang);
    if (onLanguageChange) onLanguageChange(newLang);
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setPhotos(prev => [...prev, getMediaUrl(newPhotoUrl.trim())]);
    setNewPhotoUrl('');
    setGoldBurstActive(true);
    setTimeout(() => setGoldBurstActive(false), 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotos(prev => [...prev, url]);
      if (!heroPhoto) setHeroPhoto(url);
      setGoldBurstActive(true);
      setTimeout(() => setGoldBurstActive(false), 1500);
    }
  };

  const copyGiftCard = () => {
    navigator.clipboard.writeText(giftCardNumber);
    setCopied(true);
    setGoldBurstActive(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setGoldBurstActive(false), 1500);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setGuestLikes(prev => prev + 1);
      setHasLiked(true);
      setGoldBurstActive(true);
      setTimeout(() => setGoldBurstActive(false), 1500);
    }
  };

  let formattedDate = date;
  try {
    const localeMap = { ru: 'ru-RU', uz: 'uz-UZ', en: 'en-US' };
    formattedDate = new Date(date).toLocaleDateString(localeMap[currentLang] || 'ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    });
  } catch (e) {}

  const translations = {
    ru: {
      invitationTitle: 'Торжественное Приглашение',
      welcomeText: 'Снискав благословение родителей, мы рады пригласить вас на объединение наших сердец!',
      openEnvelopeBtn: 'Открыть приглашение',
      openingText: 'Открытие...',
      ringTouchHint: 'Нажмите на печать, чтобы открыть',
      ourStoryTitle: 'Наша История Любви',
      dateAndPlace: 'Дата и Место Торжества',
      dateLabel: 'Дата',
      timeLabel: 'Время',
      venueLabel: 'Ресторан / Зал',
      addressLabel: 'Адрес',
      openMap: 'Посмотреть на карте',
      countdownTitle: 'До счастливого момента осталось',
      days: 'дней',
      hours: 'часов',
      minutes: 'минут',
      seconds: 'секунд',
      passed: 'Торжество уже началось!',
      programTitle: 'Программа Свадебного Дня',
      dressCodeTitle: 'Дресс-Код & Палитра',
      dressCodeSubtitle: 'Будем признательны, если при выборе нарядов вы придержитесь нашей праздничной палитры:',
      galleryTitle: 'Фотогалерея Молодожёнов',
      gallerySubtitle: 'Наши самые счастливые мгновения вместе',
      addPhotoBtn: 'Добавить фото',
      addPhotoPlaceholder: 'Вставьте ссылку на фото...',
      rsvpTitle: 'Подтверждение Присутствия',
      rsvpSubtitle: 'Пожалуйста, подтвердите ваше участие заранее',
      yourName: 'Ваше имя и фамилия',
      willAttend: 'Вы сможете присутствовать?',
      yes: 'Да, с удовольствием!',
      no: 'К сожалению, не смогу',
      wishesPlaceholder: 'Напишите ваши тёплые пожелания молодожёнам...',
      sendRsvp: 'Отправить подтверждение',
      sending: 'Отправка...',
      thankYouRsvp: 'Спасибо! Ваш ответ успешно отправлен.',
      giftTitle: 'Подарки & Пожелания',
      giftSubtitle: 'Ваше присутствие — наш главный подарок! Но если вы хотите поздравить нас отдельно:',
      copyCard: 'Скопировать номер карты',
      copiedText: 'Скопировано!',
      cardOwner: 'Получатель',
      guestsTitle: 'Дорогой и желанный гость!',
      shareLove: 'Отправить любовь и тёплые пожелания',
      likesCount: 'гостей уже высказали свои пожелания',
      sectionsManager: 'Разделы сайта',
      restoreAll: 'Показать все скрытые блоки',
      hideSectionHint: 'Убрать раздел',
      scheduleItems: [
        { time: '17:00', title: 'Сбор гостей & Welcome Drink', desc: 'Живая музыка, фотозона и приветственные напитки' },
        { time: '18:00', title: 'Торжественный Вход & Регистрация', desc: 'Официальная регистрация молодожёнов' },
        { time: '19:00', title: 'Праздничный Банкет & Шоу', desc: 'Поздравления, танцы и шоу-программа' },
        { time: '21:30', title: 'Свадебный Торт & Салют', desc: 'Сладкий финал сказочного вечера' },
      ],
      colors: [
        { name: 'Королевское Золото', hex: '#D4AF37' },
        { name: 'Мраморный Крем', hex: '#FFF8DC' },
        { name: 'Нюдовый Розовый', hex: '#E8C5C8' },
        { name: 'Глубокий Изумруд', hex: '#1B4D3E' }
      ]
    },
    uz: {
      invitationTitle: 'Тантанали Таклифнома',
      welcomeText: 'Ота-оналаримиз дуоси билан, сизни қалбларимиз пайванди тўй тантанамизга таклиф этамиз!',
      openEnvelopeBtn: 'Таклифномани очиш',
      openingText: 'Очилмоқда...',
      ringTouchHint: 'Очиш учун муҳрни босинг',
      ourStoryTitle: 'Бизнинг Севги Тарихимиз',
      dateAndPlace: 'Сана ва Тўй Ўтказиш Жойи',
      dateLabel: 'Сана',
      timeLabel: 'Вақт',
      venueLabel: 'Ресторан / Зал',
      addressLabel: 'Манзил',
      openMap: 'Харитада жойлашувни кўриш',
      countdownTitle: 'Бахтли кунгача қолган вақт',
      days: 'кун',
      hours: 'соат',
      minutes: 'дақиқа',
      seconds: 'сония',
      passed: 'Тўй тантанаси бошланди!',
      programTitle: 'Тўй Куни Дастури',
      dressCodeTitle: 'Дресс-Код ва Ранглар Палитраси',
      dressCodeSubtitle: 'Тўйимиз учун қуйидаги нафис ранглардаги либосларни танласангиз хурсанд бўламиз:',
      galleryTitle: 'Ёшларнинг Фотогалереяси',
      gallerySubtitle: 'Бизнинг энг бахтли ва унутилмас дамларимиз',
      addPhotoBtn: 'Расм қўшиш',
      addPhotoPlaceholder: 'Расм ҳаволасини киритинг...',
      rsvpTitle: 'Ташрифни Тасдиқлаш',
      rsvpSubtitle: 'Илтимос, ташрифингиз ҳақида олдиндан хабар беринг',
      yourName: 'Исмингиз ва фамилиянгиз',
      willAttend: 'Тўйга кела оласизми?',
      yes: 'Ҳа, мамнуният билан!',
      no: 'Афсус, кела олмайман',
      wishesPlaceholder: 'Ёшларга энг эзгу тилакларингизни ёзиб қолдиринг...',
      sendRsvp: 'Жавобни юбориш',
      sending: 'Юборилмоқда...',
      thankYouRsvp: 'Раҳмат! Жавобингиз қабул қилинди.',
      giftTitle: 'Совғалар ва Тилаклар',
      giftSubtitle: 'Биз учун энг катта совға — сизнинг ташрифингиз!',
      copyCard: 'Карта нусхасини олиш',
      copiedText: 'Нусхаланди!',
      cardOwner: 'Эгаси',
      guestsTitle: 'Ҳурматли ва азиз меҳмон!',
      shareLove: 'Ёшларга самимий тилак ва севги юбориш',
      likesCount: 'меҳмонлар ўз тилакларини билдирдилар',
      sectionsManager: 'Сайт бўлимлари',
      restoreAll: 'Барча яширилган бўлимларни кўрсатиш',
      hideSectionHint: 'Бўлимни ўчириш',
      scheduleItems: [
        { time: '17:00', title: 'Меҳмонларни кутиб олиш', desc: 'Жонли мусиқа ва байрамона фотозона' },
        { time: '18:00', title: 'Тантанали кириш ва Никоҳ', desc: 'Никоҳ маросими ва табриклар' },
        { time: '19:00', title: 'Байрам Банкети', desc: 'Табриклар, рақслар ва шоу-дастур' },
        { time: '21:30', title: 'Тўй Торти ва Файерверк', desc: 'Ширин ва унутилмас хотима' },
      ],
      colors: [
        { name: 'Шоҳона Олтин', hex: '#D4AF37' },
        { name: 'Мармар Крем', hex: '#FFF8DC' },
        { name: 'Очиқ Пушти', hex: '#E8C5C8' },
        { name: 'Тўқ Замша', hex: '#1B4D3E' }
      ]
    },
    en: {
      invitationTitle: 'Solemn Wedding Invitation',
      welcomeText: 'Blessed by our loving parents, we joyfully invite you to celebrate our wedding union!',
      openEnvelopeBtn: 'Open Invitation',
      openingText: 'Opening...',
      ringTouchHint: 'Tap seal to open envelope',
      ourStoryTitle: 'Our Love Story',
      dateAndPlace: 'Date & Ceremony Location',
      dateLabel: 'Date',
      timeLabel: 'Time',
      venueLabel: 'Venue / Hall',
      addressLabel: 'Address',
      openMap: 'View on Google Maps',
      countdownTitle: 'Countdown to the Special Day',
      days: 'days',
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
      passed: 'The Wedding Celebration has Begun!',
      programTitle: 'Wedding Day Timeline',
      dressCodeTitle: 'Dress Code & Palette',
      dressCodeSubtitle: 'We kindly appreciate your outfits adhering to our wedding color palette:',
      galleryTitle: 'Couple Photo Gallery',
      gallerySubtitle: 'Memorable moments of our journey together',
      addPhotoBtn: 'Add Photo',
      addPhotoPlaceholder: 'Paste photo URL here...',
      rsvpTitle: 'RSVP Confirmation',
      rsvpSubtitle: 'Please kindly confirm your attendance in advance',
      yourName: 'Your Full Name',
      willAttend: 'Will you be joining us?',
      yes: 'Yes, with pleasure!',
      no: 'Regretfully, I cannot',
      wishesPlaceholder: 'Write your warm wishes for the couple...',
      sendRsvp: 'Submit RSVP',
      sending: 'Sending...',
      thankYouRsvp: 'Thank you! Your response has been received.',
      giftTitle: 'Gifts & Registry',
      giftSubtitle: 'Your presence is our greatest present! However, if you wish to bless us:',
      copyCard: 'Copy Card Number',
      copiedText: 'Copied!',
      cardOwner: 'Card Holder',
      guestsTitle: 'Dear Honored Guest!',
      shareLove: 'Send love & congratulations',
      likesCount: 'guests sent their warm wishes',
      sectionsManager: 'Manage Sections',
      restoreAll: 'Show All Hidden Sections',
      hideSectionHint: 'Remove section',
      scheduleItems: [
        { time: '17:00', title: 'Guest Arrival & Welcome Drinks', desc: 'Live music, photo area & welcome beverages' },
        { time: '18:00', title: 'Grand Entrance & Registration', desc: 'Official wedding ceremony' },
        { time: '19:00', title: 'Festive Banquet & Show', desc: 'Toasts, dancing and live performance' },
        { time: '21:30', title: 'Cake Cutting & Fireworks', desc: 'Sweet finale of a magical evening' },
      ],
      colors: [
        { name: 'Imperial Gold', hex: '#D4AF37' },
        { name: 'Marble Cream', hex: '#FFF8DC' },
        { name: 'Blush Pink', hex: '#E8C5C8' },
        { name: 'Deep Emerald', hex: '#1B4D3E' }
      ]
    }
  };

  const t = translations[currentLang] || translations.ru;

  if (!isOpened) {
    return (
      <EnvelopeEntranceAnimation 
        groomName={groomName} 
        brideName={brideName} 
        onOpen={onOpenEnvelope} 
        t={t} 
      />
    );
  }

  const containerClasses = isPreview
    ? 'w-full h-full overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/60 via-stone-50 to-amber-100/40 text-stone-800 p-4 font-sans select-none scrollbar-thin relative'
    : 'min-h-[100dvh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/80 via-stone-100 to-amber-100/50 text-stone-800 py-6 px-4 font-sans flex flex-col items-center select-none relative snap-y snap-mandatory overflow-x-hidden';

  const innerClasses = isPreview
    ? 'w-full flex flex-col gap-6 items-center text-center max-w-md mx-auto relative z-20'
    : 'w-full max-w-md flex flex-col gap-8 items-center text-center relative z-20';

  const sectionWrapperClass = "w-full min-h-[100dvh] md:min-h-0 flex flex-col items-center justify-center py-6 px-1 snap-start relative";

  return (
    <div className={containerClasses}>
      <MarmarParticleSystem isPreview={isPreview} />
      <GoldBurst active={goldBurstActive} />

      {/* TOP FLOATING CONTROLS */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none max-w-md mx-auto">
        
        {/* Language Switcher Bar */}
        <div className="pointer-events-auto flex items-center gap-1 bg-stone-900/85 border border-amber-400/60 p-1 rounded-full shadow-2xl backdrop-blur-md">
          <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
          {(['ru', 'uz', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => changeLanguage(l)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                currentLang === l
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md'
                  : 'text-amber-200/80 hover:text-amber-100'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Action Controls: Restore Sections Manager & Audio Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          {isPreview && (
            <button
              onClick={() => setShowSectionManager(!showSectionManager)}
              title={t.sectionsManager}
              className="w-10 h-10 rounded-full bg-stone-900/85 border border-amber-400/60 text-amber-300 flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-stone-800 transition-all relative"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              {hiddenSections.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {hiddenSections.length}
                </span>
              )}
            </button>
          )}

          {!isPreview && onToggleAudio && (
            <button
              onClick={onToggleAudio}
              className="w-10 h-10 rounded-full bg-stone-900/85 border border-amber-400/60 text-amber-300 flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-stone-800 transition-all"
            >
              {isPlaying ? (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-amber-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              ) : (
                <VolumeX className="w-4 h-4 text-amber-400/70" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* SECTION MANAGER MODAL / PANEL */}
      <AnimatePresence>
        {isPreview && showSectionManager && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 left-4 max-w-sm mx-auto z-50 bg-stone-950/95 border-2 border-amber-400/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-amber-100 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between border-b border-amber-400/30 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {t.sectionsManager}
              </span>
              <button 
                onClick={() => setShowSectionManager(false)}
                className="w-6 h-6 rounded-full bg-stone-800 hover:bg-rose-900 text-stone-300 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-stone-300/80">
              Нажмите на крестик («X») у любого блока на странице, чтобы скрыть его, или восстановите скрытые блоки ниже:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'hero', name: 'Главная карточка' },
                { id: 'photo', name: 'Главное фото' },
                { id: 'video', name: 'Видео-ролик' },
                { id: 'loveStory', name: 'История любви' },
                { id: 'dateVenue', name: 'Дата и Место' },
                { id: 'countdown', name: 'Таймер отсчета' },
                { id: 'schedule', name: 'Программа дня' },
                { id: 'gallery', name: 'Фотогалерея' },
                { id: 'dressCode', name: 'Дресс-код' },
                { id: 'rsvp', name: 'Анкета гостей' },
                { id: 'giftCard', name: 'Подарки и карта' },
                { id: 'phone', name: 'Контакты' },
              ].map(sec => (
                <button
                  key={sec.id}
                  onClick={() => toggleHideSection(sec.id)}
                  className={`py-1.5 px-2.5 rounded-xl text-[11px] font-semibold border flex items-center justify-between transition-all ${
                    isSectionVisible(sec.id)
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                      : 'bg-stone-900 border-stone-800 text-stone-500 line-through'
                  }`}
                >
                  <span>{sec.name}</span>
                  {isSectionVisible(sec.id) ? (
                    <Eye className="w-3 h-3 text-amber-400 shrink-0" />
                  ) : (
                    <X className="w-3 h-3 text-rose-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {hiddenSections.length > 0 && (
              <button
                onClick={() => setHiddenSections([])}
                className="mt-1 w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                {t.restoreAll}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={innerClasses}>
        
        {/* HERO CARD SECTION */}
        {isSectionVisible('hero') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-white/85 border-2 border-amber-300/80 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(212,175,55,0.15)] backdrop-blur-xl relative overflow-hidden flex flex-col items-center gap-6"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('hero')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-900/40 hover:bg-rose-600 text-stone-100 hover:text-white border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-400/80 rounded-tl-xl" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-400/80 rounded-bl-xl" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-400/80 rounded-br-xl" />

              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 border-2 border-amber-400/90 flex flex-col items-center justify-center text-amber-300 shadow-xl relative"
              >
                <Crown className="w-6 h-6 text-amber-400 mb-0.5" />
                <span className="text-xs font-serif font-bold tracking-wider text-amber-200">
                  {groomName.charAt(0)} & {brideName.charAt(0)}
                </span>
              </motion.div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/80 px-4 py-1 rounded-full border border-amber-300/50">
                  {t.invitationTitle}
                </span>
                
                <div className="flex flex-col items-center gap-1 my-3">
                  <h1 className="text-4xl font-serif font-extrabold text-stone-900 tracking-wide drop-shadow-sm">
                    {groomName}
                  </h1>
                  
                  <div className="flex items-center gap-3 my-2">
                    <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center border border-amber-300"
                    >
                      <Heart className="w-4 h-4 fill-amber-600 text-amber-600" />
                    </motion.div>
                    <span className="h-[1px] w-12 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
                  </div>

                  <h1 className="text-4xl font-serif font-extrabold text-stone-900 tracking-wide drop-shadow-sm">
                    {brideName}
                  </h1>
                </div>

                <p className="text-xs text-stone-600 font-serif italic max-w-xs leading-relaxed px-4 text-center">
                  "{t.welcomeText}"
                </p>
              </div>

              <div className="w-full pt-4 border-t border-amber-200/70 flex items-center justify-between text-xs text-amber-950 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>{time}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* MAIN COUPLE HERO PHOTO SECTION */}
        {isSectionVisible('photo') && heroPhoto && (
          <div className={sectionWrapperClass}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full bg-white/90 border-2 border-amber-300/80 rounded-3xl p-3 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col items-center group"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('photo')}
                  title={t.hideSectionHint}
                  className="absolute top-5 right-5 z-30 w-7 h-7 rounded-full bg-stone-900/60 hover:bg-rose-600 text-stone-100 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="w-full h-80 rounded-2xl overflow-hidden relative border border-amber-200">
                <img 
                  src={getMediaUrl(heroPhoto)} 
                  alt={`${groomName} & ${brideName}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-amber-100 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                    {groomName} & {brideName}
                  </span>
                  <p className="text-xs font-serif italic text-amber-100/90">{formattedDate}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* CUSTOM VIDEO PLAYER SECTION */}
        {isSectionVisible('video') && data.videoUrl && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full bg-white/90 border-2 border-amber-300/80 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col items-center gap-4 text-center relative overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('video')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-900/40 hover:bg-rose-600 text-stone-100 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <span className="text-[10px] uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/85 px-4 py-1 rounded-full border border-amber-300/50 select-none">
                Видео-приглашение
              </span>

              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-amber-200 shadow-md bg-black relative">
                <video 
                  src={getMediaUrl(data.videoUrl)} 
                  controls 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover" 
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* LOVE STORY TIMELINE SECTION */}
        {isSectionVisible('loveStory') && loveStory && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full bg-white/90 border border-amber-300/70 rounded-3xl p-6 shadow-lg backdrop-blur-md flex flex-col items-center gap-3 relative overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('loveStory')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-900/40 hover:bg-rose-600 text-stone-100 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="w-10 h-10 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-700">
                <Heart className="w-5 h-5 text-amber-600 fill-amber-600/20" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-800 font-bold">
                {t.ourStoryTitle}
              </span>
              <p className="text-xs text-stone-700 italic font-serif leading-relaxed px-3 text-center">
                "{loveStory}"
              </p>
            </motion.div>
          </div>
        )}

        {/* DATE & VENUE MAP CARD */}
        {isSectionVisible('dateVenue') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full bg-white/90 border border-amber-300/70 rounded-3xl p-6 shadow-lg backdrop-blur-md flex flex-col gap-5 text-center relative overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('dateVenue')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-900/40 hover:bg-rose-600 text-stone-100 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/85 px-4 py-1 rounded-full border border-amber-300/50 select-none">
                  {t.dateAndPlace}
                </span>
                <h3 className="text-xl font-serif font-bold text-amber-950 mt-1">{venue}</h3>
                <p className="text-xs text-stone-500 max-w-xs">{address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-amber-200/80 text-xs">
                <div className="flex flex-col items-center gap-1 p-2 bg-amber-50/60 rounded-xl border border-amber-200/50">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span className="text-[9px] text-stone-400 font-bold uppercase">{t.dateLabel}</span>
                  <span className="font-semibold text-stone-800 capitalize text-center">{formattedDate}</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-amber-50/60 rounded-xl border border-amber-200/50">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span className="text-[9px] text-stone-400 font-bold uppercase">{t.timeLabel}</span>
                  <span className="font-semibold text-stone-800">{time}</span>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${venue} ${address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 hover:from-amber-900 hover:to-stone-900 border border-amber-400/60 rounded-2xl text-xs font-bold text-amber-200 flex items-center justify-center gap-2 transition-all shadow-md group"
              >
                <Navigation className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                {t.openMap}
              </a>
            </motion.div>
          </div>
        )}

        {/* COUNTDOWN TIMER SECTION */}
        {isSectionVisible('countdown') && timeLeft && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 text-amber-100 border-2 border-amber-400/80 rounded-3xl p-6 shadow-xl flex flex-col items-center gap-4 relative overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('countdown')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-900/60 hover:bg-rose-600 text-stone-100 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-bold">
                {t.countdownTitle}
              </span>

              {currentDifference.isPassed ? (
                <p className="text-base font-bold text-amber-300">{t.passed}</p>
              ) : (
                <div className="grid grid-cols-4 gap-2.5 w-full">
                  {[
                    { label: t.days, val: currentDifference.days },
                    { label: t.hours, val: currentDifference.hours },
                    { label: t.minutes, val: currentDifference.minutes },
                    { label: t.seconds, val: currentDifference.seconds },
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="bg-stone-900/90 border border-amber-400/40 rounded-2xl p-2.5 flex flex-col items-center shadow-inner"
                    >
                      <span className="text-xl font-bold text-amber-300 font-mono">{item.val}</span>
                      <span className="text-[8px] uppercase text-amber-200/70 font-bold mt-0.5">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* WEDDING PROGRAM SCHEDULE */}
        {isSectionVisible('schedule') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full bg-white/90 border border-amber-300/70 rounded-3xl p-6 shadow-lg backdrop-blur-md flex flex-col items-center gap-5 relative overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('schedule')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-900/40 hover:bg-rose-600 text-stone-100 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/85 px-4 py-1 rounded-full border border-amber-300/50 select-none">
                  {t.programTitle}
                </span>
              </div>

              <div className="w-full flex flex-col gap-4 text-left relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-amber-200">
                {t.scheduleItems.map((item: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 relative z-10"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-900 font-bold text-xs shrink-0 shadow-sm">
                      {item.time}
                    </div>
                    <div className="flex flex-col pt-1">
                      <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                      <p className="text-[11px] text-stone-500">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* INTERACTIVE PHOTO GALLERY SECTION */}
        {isSectionVisible('gallery') && (
          <div className={sectionWrapperClass}>
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full bg-white/90 border border-amber-300/70 rounded-3xl p-6 shadow-lg backdrop-blur-md flex flex-col items-center gap-4 text-center relative overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('gallery')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-900/40 hover:bg-rose-600 text-stone-100 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                <ImageIcon className="w-5 h-5 text-amber-700" />
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/85 px-4 py-1 rounded-full border border-amber-300/50 select-none">
                  {t.galleryTitle}
                </span>
                <p className="text-[11px] text-stone-500 px-2 leading-relaxed">
                  {t.gallerySubtitle}
                </p>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 gap-2.5 w-full mt-2">
                {photos.map((url, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-amber-200/80 shadow-md group cursor-pointer"
                    onClick={() => setActiveModalPhoto(getMediaUrl(url))}
                  >
                    <img src={getMediaUrl(url)} alt={`Gallery photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 className="w-5 h-5 drop-shadow-md" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Upload Controls only shown in preview mode */}
              {isPreview && (
                <div className="w-full border-t border-amber-200/70 pt-3 mt-1 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder={t.addPhotoPlaceholder}
                      className="flex-1 bg-amber-50/60 border border-amber-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={handleAddPhoto}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t.addPhotoBtn}
                    </button>
                  </div>

                  <label className="cursor-pointer py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 border border-amber-400/50 shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Загрузить фото с устройства</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* PHOTO LIGHTBOX MODAL */}
        <AnimatePresence>
          {activeModalPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalPhoto(null)}
              className="fixed inset-0 z-50 bg-stone-950/90 flex items-center justify-center p-4 backdrop-blur-md"
            >
              <div className="relative max-w-lg w-full max-h-[85vh] rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl">
                <img src={getMediaUrl(activeModalPhoto)} alt="Full view" className="w-full h-full object-contain bg-black" />
                <button
                  onClick={() => setActiveModalPhoto(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/80 text-amber-200 flex items-center justify-center border border-amber-400/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DRESS CODE & PALETTE */}
        {isSectionVisible('dressCode') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full bg-white/90 border border-amber-300/70 rounded-3xl p-6 shadow-lg backdrop-blur-md flex flex-col items-center gap-4 text-center relative overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('dressCode')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-900/40 hover:bg-rose-600 text-stone-100 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                <Shirt className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/85 px-4 py-1 rounded-full border border-amber-300/50 select-none">
                  {t.dressCodeTitle}
                </span>
                <p className="text-[11px] text-stone-500 px-2 leading-relaxed">
                  {t.dressCodeSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3 w-full mt-1">
                {t.colors.map((c: any, i: number) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPalette(c.name)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all ${
                      selectedPalette === c.name ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-300' : 'border-stone-200 bg-stone-50/50'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full shadow-inner border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[9px] font-medium text-stone-700 leading-tight text-center">
                      {c.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Dynamic Custom Fields */}
        {customFields.length > 0 && (
          <div className="w-full flex flex-col gap-3">
            {customFields.map((field) => (
              <div key={field.id} className="w-full bg-white border border-amber-300/70 rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-amber-800">{field.label}</span>
                <span className="text-xs text-stone-700">{data[field.id] || field.placeholder}</span>
              </div>
            ))}
          </div>
        )}

        {/* RSVP FORM SECTION */}
        {isSectionVisible('rsvp') && rsvpState && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full bg-white/90 border-2 border-amber-300/80 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col gap-4 text-left relative overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('rsvp')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-900/40 hover:bg-rose-600 text-stone-100 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="text-center flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/85 px-4 py-1 rounded-full border border-amber-300/50 select-none">
                  {t.rsvpTitle}
                </span>
                <p className="text-[11px] text-stone-500">{t.rsvpSubtitle}</p>
              </div>

              {rsvpState.isSuccess ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-center flex flex-col items-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-xs font-bold text-emerald-950">{t.thankYouRsvp}</span>
                </motion.div>
              ) : (
                <form onSubmit={rsvpState.onSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">{t.yourName}</label>
                    <input
                      type="text"
                      required
                      value={rsvpState.name}
                      onChange={(e) => rsvpState.setName(e.target.value)}
                      placeholder="Например: Алишер и Малика"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">{t.willAttend}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => rsvpState.setAttending(true)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          rsvpState.attending === true
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-sm'
                            : 'bg-stone-50 border-stone-300 text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        {t.yes}
                      </button>
                      <button
                        type="button"
                        onClick={() => rsvpState.setAttending(false)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          rsvpState.attending === false
                            ? 'bg-rose-100 border-rose-500 text-rose-950 shadow-sm'
                            : 'bg-stone-50 border-stone-300 text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        {t.no}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-stone-600 block mb-1">{t.wishesPlaceholder}</label>
                    <textarea
                      rows={3}
                      value={rsvpState.wishes}
                      onChange={(e) => rsvpState.setWishes(e.target.value)}
                      placeholder="Ваши искренние пожелания молодожёнам..."
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={rsvpState.isSubmitting || rsvpState.attending === null}
                    className="w-full py-3 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all border border-amber-400/50"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    {rsvpState.isSubmitting ? t.sending : t.sendRsvp}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {/* GIFT CARD & REGISTRY SECTION */}
        {isSectionVisible('giftCard') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full bg-white/90 border border-amber-300/70 rounded-3xl p-6 shadow-lg backdrop-blur-md flex flex-col items-center gap-4 text-center relative overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('giftCard')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-900/40 hover:bg-rose-600 text-stone-100 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                <Gift className="w-5 h-5 text-amber-700" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/85 px-4 py-1 rounded-full border border-amber-300/50 select-none">{t.giftTitle}</span>
              <p className="text-[11px] text-stone-500 leading-relaxed px-2">{t.giftSubtitle}</p>
              
              <div className="w-full bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col items-center gap-2 mt-1">
                <span className="text-sm font-mono font-bold text-amber-950 tracking-widest">{giftCardNumber}</span>
                <span className="text-[10px] text-stone-500">{t.cardOwner}: {giftCardOwner}</span>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={copyGiftCard}
                  className="mt-2 py-2 px-4 bg-white hover:bg-stone-50 border border-amber-300 rounded-xl text-xs font-semibold text-amber-900 flex items-center gap-2 transition-all shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-700" />}
                  {copied ? t.copiedText : t.copyCard}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* INTERACTIVE LOVE LIKE & PHONE CONTACT */}
        {isSectionVisible('phone') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full bg-gradient-to-r from-amber-100/60 via-stone-50 to-amber-100/60 border border-amber-300/70 rounded-3xl p-5 flex flex-col items-center gap-3 text-center relative overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('phone')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-900/40 hover:bg-rose-600 text-stone-100 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-md transition-all ${
                  hasLiked 
                    ? 'bg-rose-500 border-rose-600 text-white' 
                    : 'bg-white border-amber-300 text-rose-500 hover:bg-rose-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : 'fill-rose-500'}`} />
                <span className="text-xs font-bold">{guestLikes}</span>
              </motion.button>
              <span className="text-[10px] text-stone-500 italic">{t.likesCount}</span>

              {phone && (
                <div className="text-xs text-stone-600 flex items-center gap-1.5 mt-2 border-t border-amber-200/60 pt-3 w-full justify-center">
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Инфо: <a href={`tel:${phone}`} className="text-amber-950 font-bold hover:underline">{phone}</a></span>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Footer Signature */}
        <div className="text-[10px] uppercase tracking-[0.25em] text-amber-800/60 font-serif pt-4 pb-8 select-none">
          {groomName} & {brideName} • 2026
        </div>

      </div>
    </div>
  );
};
