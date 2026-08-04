import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, Clock, VolumeX, Volume2,
  Send, Copy, Check, Gift, Phone, Navigation,
  Crown, X, Plus, Image as ImageIcon, Video,
  Globe, Maximize2, Upload, SlidersHorizontal, Eye,
  Play, Pause, MapPin, User, Users, CheckCircle2, ChevronLeft, ChevronRight,
  MessageSquareHeart, ArrowDown
} from 'lucide-react';
import type { WebsiteTemplateProps } from './types';
import { useCountdownTimer, parseEventDateTime } from '../../utils/timer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getMediaUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

// ==========================================
// Falling Petal Particle System
// ==========================================
const PetalParticleSystem = ({ isPreview, isRose = false }: { isPreview?: boolean; isRose?: boolean }) => {
  if (isPreview) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={`petal-${i}`}
          className="absolute rounded-tl-full rounded-br-full opacity-60"
          style={{
            top: `-10%`,
            left: `${(i * 19) % 100}%`,
            width: `${10 + (i % 4) * 4}px`,
            height: `${14 + (i % 4) * 5}px`,
            background: isRose
              ? i % 2 === 0
                ? 'linear-gradient(135deg, #FDA4AF 0%, #EC4899 100%)'
                : 'linear-gradient(135deg, #FBCFE8 0%, #E11D48 100%)'
              : i % 2 === 0
                ? 'linear-gradient(135deg, #F472B6 0%, #C084FC 100%)'
                : 'linear-gradient(135deg, #E879F9 0%, #F43F5E 100%)',
            boxShadow: isRose
              ? '0 2px 8px rgba(225, 29, 72, 0.3)'
              : '0 2px 8px rgba(192, 132, 252, 0.3)',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (i % 2 === 0 ? 40 : -40), 0],
            rotate: [0, 360],
            opacity: [0.1, 0.75, 0],
          }}
          transition={{
            duration: 8 + (i % 5) * 2,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.5,
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
      {[...Array(28)].map((_, i) => {
        const angle = (i / 28) * 360;
        const radius = 70 + Math.random() * 100;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={`gold-burst-${i}`}
            className="absolute rounded-full bg-amber-300"
            style={{
              width: `${4 + Math.random() * 4}px`,
              height: `${4 + Math.random() * 4}px`,
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.9)',
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ 
              x, 
              y, 
              scale: [1, 1.4, 0], 
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
// Multilingual Dictionary
// ==========================================
const translations = {
  uz: {
    assalomuAlaykum: "ASSALOMU ALAYKUM",
    taklifnoma: "Taklifnoma",
    invitationSubtitle: "To'yimizga tashrif buyurishingizni so'raymiz",
    scrollDown: "PASTGA SURING",
    weddingTitle: "NIKOH TO'YI TANTANASI",
    and: "&",
    quote: "Abadiy sevgining guli — bu ikki qalbning uyg'unligi...",
    galleryTitle: "SURATLAR",
    calendarTitle: "TO'Y SANASI",
    startTime: "Boshlanish vaqti",
    weekdays: ["Dsh", "Ssh", "Chsh", "Psh", "Jum", "Shb", "Yak"],
    countdownTitle: "TO'YGA QADAR",
    countdownSub: "Sizni ko'rishni sabrsizlik bilan kutamiz",
    days: "KUN",
    hours: "SOAT",
    minutes: "DAQIQA",
    seconds: "SONIYA",
    venueHeader: "TANTANALI MAROSIM",
    venueTitle: "BAXT TO'YXONASI",
    openMap: "XARITADA KO'RISH",
    wishHeader: "SAMIMIYY TILAK",
    wishFrom: "Hurmat bilan:",
    wishesTitle: "Wishes",
    leaveWish: "LEAVE A WISH",
    willYouAttend: "WILL YOU ATTEND?",
    yes: "Yes",
    no: "No",
    nameLabel: "Ismingiz",
    namePlaceholder: "Ismingizni kiriting",
    guestsLabel: "Mehmonlar soni",
    submitRsvp: "Javobni yuborish",
    rsvpSuccess: "TASHRIFINGIZDAN MAMNUNMIZ!",
    rsvpSuccessSub: "Javobingiz qabul qilindi. Rahmat!",
    tapTheSeal: "TAP THE SEAL",
    exclusivelyForYou: "This invitation is exclusively for you",
    footerText: "Bunday taklifnomani siz ham buyurtma bering",
    addMedia: "Foto/Video qo'shish",
    videoTag: "VIDEO",
    writeWish: "Samimiy tilagingizni yozing",
    sendWish: "Tilakni yuborish",
  },
  ru: {
    assalomuAlaykum: "ДОБРО ПОЖАЛОВАТЬ",
    taklifnoma: "Приглашение",
    invitationSubtitle: "Приглашаем вас разделить с нами радость торжества",
    scrollDown: "ЛИСТАЙТЕ ВНИЗ",
    weddingTitle: "СВАДЕБНОЕ ТОРЖЕСТВО",
    and: "&",
    quote: "Любовь — это гармония двух сердец, соединившихся навсегда...",
    galleryTitle: "ГАЛЕРЕЯ",
    calendarTitle: "ДАТА СВАДЬБЫ",
    startTime: "Время начала",
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    countdownTitle: "ДО СВАДЬБЫ",
    countdownSub: "С нетерпением ждем нашей встречи",
    days: "ДНЕЙ",
    hours: "ЧАСОВ",
    minutes: "МИНУТ",
    seconds: "СЕКУНД",
    venueHeader: "ТОРЖЕСТВЕННЫЙ ЗАЛ",
    venueTitle: "РЕСТОРАН BAXT",
    openMap: "ПОСМОТРЕТЬ НА КАРТЕ",
    wishHeader: "ПОЖЕЛАНИЕ",
    wishFrom: "С уважением:",
    wishesTitle: "Пожелания",
    leaveWish: "ОСТАВИТЬ ПОЖЕЛАНИЕ",
    willYouAttend: "ВЫ ПРИДЕТЕ?",
    yes: "Да",
    no: "Нет",
    nameLabel: "Ваше имя",
    namePlaceholder: "Введите ваше имя",
    guestsLabel: "Количество гостей",
    submitRsvp: "Отправить ответ",
    rsvpSuccess: "СПАСИБО ЗА ВАШ ОТВЕТ!",
    rsvpSuccessSub: "Ваше подтверждение принято!",
    tapTheSeal: "НАЖМИТЕ НА ПЕЧАТЬ",
    exclusivelyForYou: "Это приглашение создано специально для вас",
    footerText: "Создайте такое же красивое приглашение",
    addMedia: "Добавить Фото/Видео",
    videoTag: "ВИДЕО",
    writeWish: "Напишите ваши тёплые слова",
    sendWish: "Отправить пожелание",
  },
  en: {
    assalomuAlaykum: "WELCOME",
    taklifnoma: "Invitation",
    invitationSubtitle: "We cordially invite you to celebrate our special day",
    scrollDown: "SCROLL DOWN",
    weddingTitle: "WEDDING CELEBRATION",
    and: "&",
    quote: "Love is the harmony of two souls joining together forever...",
    galleryTitle: "GALLERY",
    calendarTitle: "WEDDING DATE",
    startTime: "Start Time",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    countdownTitle: "COUNTDOWN",
    countdownSub: "We look forward to seeing you",
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINUTES",
    seconds: "SECONDS",
    venueHeader: "CELEBRATION VENUE",
    venueTitle: "BAXT RECEPTION HALL",
    openMap: "VIEW ON MAP",
    wishHeader: "WARM WISHES",
    wishFrom: "Warm regards:",
    wishesTitle: "Wishes",
    leaveWish: "LEAVE A WISH",
    willYouAttend: "WILL YOU ATTEND?",
    yes: "Yes",
    no: "No",
    nameLabel: "Your Name",
    namePlaceholder: "Enter your name",
    guestsLabel: "Number of Guests",
    submitRsvp: "Submit RSVP",
    rsvpSuccess: "THANK YOU FOR YOUR RSVP!",
    rsvpSuccessSub: "Your response has been saved!",
    tapTheSeal: "TAP THE SEAL",
    exclusivelyForYou: "This invitation is exclusively for you",
    footerText: "Create a beautiful invitation like this",
    addMedia: "Add Photo/Video",
    videoTag: "VIDEO",
    writeWish: "Write your warm wishes",
    sendWish: "Send Wish",
  }
};

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
  const isRoseEnvelope = visualVariant === 'pink-envelope';
  const [currentLang, setCurrentLang] = useState<'uz' | 'ru' | 'en'>(lang || 'uz');
  const t = translations[currentLang] || translations.uz;

  const [internalOpened, setInternalOpened] = useState(externalIsOpened);
  const [isOpening, setIsOpening] = useState(false);
  const [burstActive, setBurstActive] = useState(false);

  useEffect(() => {
    setInternalOpened(externalIsOpened);
    if (!externalIsOpened) {
      setIsOpening(false);
      setBurstActive(false);
    }
  }, [externalIsOpened]);

  const isOpened = externalIsOpened || internalOpened;

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setBurstActive(true);

    setTimeout(() => {
      setInternalOpened(true);
      if (onOpenEnvelope) onOpenEnvelope();
    }, 1600);
  };

  // Section visibility control
  const [hiddenSections, setHiddenSections] = useState<string[]>(data.hiddenSections || []);
  useEffect(() => {
    if (data.hiddenSections) {
      setHiddenSections(data.hiddenSections);
    }
  }, [data.hiddenSections]);
  const [showSectionManager, setShowSectionManager] = useState(false);

  const isSectionVisible = (sectionKey: string) => {
    if (hiddenSections.includes(sectionKey)) return false;
    if ((sectionKey === 'venue' || sectionKey === 'calendar') && hiddenSections.includes('dateVenue')) return false;
    if ((sectionKey === 'greeting') && hiddenSections.includes('loveStory')) return false;
    if ((sectionKey === 'couple') && (hiddenSections.includes('photo') || hiddenSections.includes('showHeroPhoto'))) return false;
    if ((sectionKey === 'giftCard' || sectionKey === 'gift') && (hiddenSections.includes('giftCard') || hiddenSections.includes('gift'))) return false;
    return true;
  };

  // Dynamic Data & Media Fallbacks
  const groomName = data.groomName || 'Farhod';
  const brideName = data.brideName || 'Shirin';
  const dateStr = data.date || '2026-09-18';
  const timeStr = data.time || '17:00';
  const venueName = data.venue || 'BAXT TO\'YXONASI';
  const venueAddress = data.address || "Toshkent shahri, Yunusobod tumani, Ahmad Yassaviy 34C";
  const wishFrom = data.loveStory || 'Shomurodovlar';
  const giftCardNumber = data.giftCardNumber || '8600 7710 4420 8911';
  const giftCardOwner = data.giftCardOwner || 'Сардор С.';

  // Gallery Photos
  const defaultGallery = useMemo(() => {
    if (data.photos && data.photos.length > 0) {
      return data.photos.map(p => getMediaUrl(p));
    }
    return [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    ];
  }, [data.photos]);

  const [galleryMedia, setGalleryMedia] = useState<string[]>(defaultGallery);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeModalMedia, setActiveModalMedia] = useState<string | null>(null);
  const [showWishModal, setShowWishModal] = useState(false);
  const [userWishText, setUserWishText] = useState('');
  const [userWishSent, setUserWishSent] = useState(false);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState(rsvpState?.name || '');
  const [rsvpGuests, setRsvpGuests] = useState(rsvpState?.guestCount || 1);
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(rsvpState?.attending ?? null);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(rsvpState?.isSuccess || false);

  const updateRsvpName = (value: string) => {
    setRsvpName(value);
    rsvpState?.setName(value);
  };

  const updateRsvpAttending = (value: boolean) => {
    setRsvpAttending(value);
    rsvpState?.setAttending(value);
  };

  const updateRsvpGuests = (value: number) => {
    setRsvpGuests(value);
    rsvpState?.setGuestCount(value);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpState?.onSubmit) {
      rsvpState.onSubmit(e);
    } else {
      setRsvpSubmitted(true);
    }
  };

  // Countdown timer calculations
  const calculatedTimeLeft = useCountdownTimer(data.date, data.time, timeLeft);

  // Dynamic Calendar Day Highlight setup based on event date
  const parsedEventDate = parseEventDateTime(data.date || '2026-09-18', data.time);
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

  return (
    <div className={`relative min-h-screen bg-gradient-to-b from-[#FAF5FF] via-[#F3E8FF] to-[#FCE7F3] text-[#4C1D95] font-serif overflow-x-hidden selection:bg-[#C084FC] selection:text-white ${isRoseEnvelope ? 'taklifet-rose-envelope-theme' : ''}`}>
      {/* Background Falling Petals */}
      <PetalParticleSystem isPreview={isPreview} isRose={isRoseEnvelope} />

      {/* Floating Audio & Language Controls */}
      {!isCatalogPreview && <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* Language selector */}
        <div className="bg-white/80 border border-[#C084FC]/40 rounded-full px-3 py-1 flex items-center gap-1 text-xs text-[#6B21A8] backdrop-blur-md shadow-lg shadow-purple-900/10 font-sans">
          <Globe className="w-3.5 h-3.5" />
          <button
            onClick={() => {
              const nextLang = currentLang === 'uz' ? 'ru' : currentLang === 'ru' ? 'en' : 'uz';
              setCurrentLang(nextLang);
              if (onLanguageChange) onLanguageChange(nextLang);
            }}
            className="uppercase font-bold tracking-wider hover:text-[#9333EA] transition-colors"
          >
            {currentLang}
          </button>
        </div>

        {/* Audio Toggle */}
        {onToggleAudio && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleAudio}
            className="w-10 h-10 rounded-full bg-white/80 border border-[#C084FC]/40 flex items-center justify-center text-[#6B21A8] backdrop-blur-md shadow-lg shadow-purple-900/10 hover:bg-[#C084FC] hover:text-white transition-all"
            title="Musiqa"
          >
            {isPlaying ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                <Volume2 className="w-5 h-5" />
              </motion.div>
            ) : (
              <VolumeX className="w-5 h-5 text-purple-400" />
            )}
          </motion.button>
        )}

        {/* Preview Section Manager Button */}
        {isPreview && (
          <button
            onClick={() => setShowSectionManager(!showSectionManager)}
            className="w-10 h-10 rounded-full bg-[#9333EA] text-white flex items-center justify-center shadow-lg font-sans"
            title="Sektsiyalarni boshqarish"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>}

      {/* Preview Section Manager Drawer */}
      {isPreview && !isCatalogPreview && showSectionManager && (
        <div className="fixed top-16 right-4 z-50 bg-white/95 border border-[#C084FC]/50 rounded-2xl p-4 w-72 shadow-2xl backdrop-blur-xl text-xs font-sans text-purple-950">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-200">
            <span className="font-bold text-[#7E22CE] flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Sektsiyalarni ko'rsatish
            </span>
            <button onClick={() => setShowSectionManager(false)} className="text-gray-400 hover:text-purple-900">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {[
              { id: 'hero', name: 'Приветствие & Заголовок' },
              { id: 'couple', name: 'Имена Молодоженов' },
              { id: 'gallery', name: 'Карусель Фотографий' },
              { id: 'calendar', name: 'Дата & Календарь' },
              { id: 'countdown', name: 'Таймер Отсчета' },
              { id: 'venue', name: 'Ресторан & Локация' },
              { id: 'wish', name: 'Пожелание Семьи' },
              { id: 'rsvp', name: 'RSVP & Пожелание Гостя' },
            ].map(sec => (
              <label key={sec.id} className="flex items-center justify-between p-2 rounded-lg bg-purple-50 border border-purple-100 cursor-pointer hover:border-purple-300">
                <span className="text-purple-900">{sec.name}</span>
                <input
                  type="checkbox"
                  checked={isSectionVisible(sec.id)}
                  onChange={() => {
                    if (onToggleSection) {
                      onToggleSection(sec.id);
                    } else {
                      setHiddenSections(prev => 
                        prev.includes(sec.id) ? prev.filter(s => s !== sec.id) : [...prev, sec.id]
                      );
                    }
                  }}
                  className="accent-[#7E22CE] w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. REALISTIC 3D PURPLE ENVELOPE OPENING SCREEN (As seen in Video 2)       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={isOpening ? { opacity: [1, 1, 0], scale: [1, 1.03, 1.08] } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
            transition={{ duration: 1.3, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-40 bg-[#F5EEF8] flex flex-col items-center justify-center p-4 select-none overflow-hidden"
          >
            {/* Golden Particles Splash */}
            <GoldBurst active={burstActive} />

            {/* Glowing background aura */}
            <div className="absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.3)_0%,transparent_70%)] pointer-events-none blur-3xl" />

            {/* Envelope Stand & 3D Unfolding Container */}
            <div className="relative w-full max-w-[320px] aspect-[4/3] bg-[#7C3AED] rounded-3xl shadow-[0_25px_60px_rgba(124,58,237,0.35)] flex items-center justify-center p-2 border-2 border-purple-400/40">
              
              {/* Letter Card sliding UP out of envelope */}
              <motion.div
                initial={{ y: 0, opacity: 0.95 }}
                animate={isOpening ? { y: -130, scale: 1.06, opacity: 1 } : { y: 0, opacity: 0.95 }}
                transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
                className="absolute top-2 w-[88%] h-[85%] bg-white rounded-2xl shadow-xl p-4 text-center border border-purple-100 flex flex-col items-center justify-center z-10"
              >
                <span className="text-xl md:text-2xl font-serif font-bold text-[#581C87] tracking-wider">
                  {groomName.charAt(0)} ♡ {brideName.charAt(0)}
                </span>
                <p className="text-[10px] text-purple-700 font-sans tracking-wide mt-1.5 font-medium">
                  {t.exclusivelyForYou}
                </p>
              </motion.div>

              {/* Envelope Front Pocket Base */}
              <div 
                className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#7C3AED] via-[#6D28D9] to-[#581C87] border-b-2 border-purple-300/40 z-20 pointer-events-none"
                style={{
                  clipPath: 'polygon(0 0, 0% 100%, 100% 100%, 100% 0, 50% 50%)'
                }}
              />

              {/* Top Triangular Flap Folding OPEN (rotateX 180deg) */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={isOpening ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[#8B5CF6] to-[#7C3AED] rounded-t-3xl border-t border-purple-300/50 z-30 origin-top flex items-center justify-center shadow-lg"
                style={{
                  transformStyle: 'preserve-3d',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                }}
              />

              {/* Central Golden Wax Seal Button (Positioned over flap seam) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.75, 0.3] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-amber-400/40 blur-md pointer-events-none"
                />

                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleOpenClick}
                  disabled={isOpening}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-[0_0_25px_rgba(251,191,36,0.7)] flex items-center justify-center cursor-pointer group"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#581C87] to-[#3B0764] border border-amber-300 flex items-center justify-center text-amber-300 shadow-inner">
                    {isRoseEnvelope ? (
                      <Heart className="w-5 h-5 fill-current text-amber-200 group-hover:scale-110 transition-transform" />
                    ) : (
                      <span className="text-xs font-serif font-bold tracking-widest text-amber-200 group-hover:scale-110 transition-transform">
                        {groomName.charAt(0)}♡{brideName.charAt(0)}
                      </span>
                    )}
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Seal Hint Text */}
            <span className="text-[11px] font-sans font-bold tracking-[0.25em] text-[#7C3AED] uppercase mt-8 z-10">
              {t.tapTheSeal}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MAIN INVITATION CONTENT                                                  */}
      {/* ========================================================================= */}
      <div className="w-full max-w-md mx-auto px-4 py-8 space-y-12">

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 1: GREETING & TAKLIFNOMA TITLE                                 */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('hero') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center pt-6 space-y-6"
          >
            {/* Top Floral Crown Accent */}
            <div className="flex justify-center text-purple-400">
              <Crown className="w-6 h-6 text-[#9333EA]" />
            </div>

            <div className="space-y-2 px-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#7E22CE] font-sans font-bold block">
                {t.assalomuAlaykum}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#581C87] font-bold tracking-wide break-words max-w-full overflow-hidden">
                {t.taklifnoma}
              </h1>
              <p className="text-xs text-purple-900/80 font-sans font-medium max-w-xs mx-auto leading-relaxed">
                {t.invitationSubtitle}
              </p>
            </div>

            {/* Scroll Down Cue */}
            <div className="pt-4 flex flex-col items-center gap-1.5">
              <span className="text-[9px] tracking-[0.25em] font-sans font-bold text-purple-700 uppercase">
                {t.scrollDown}
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-7 h-7 rounded-full bg-white/80 border border-purple-300 flex items-center justify-center text-purple-700 shadow-sm"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 2: GROOM & BRIDE COUPLE SHOWCASE                                */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('couple') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-3xl bg-white/70 border border-purple-200/80 shadow-xl shadow-purple-900/5 text-center space-y-4 backdrop-blur-md"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#7E22CE] font-sans font-bold">
              {t.weddingTitle}
            </span>

            <div className="space-y-2 py-2">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#581C87]">
                {groomName}
              </h2>
              <div className="text-2xl font-serif italic text-purple-500 my-1">
                {t.and}
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#581C87]">
                {brideName}
              </h2>
            </div>

            <p className="text-xs text-purple-900/80 font-serif italic max-w-xs mx-auto leading-relaxed">
              "{t.quote}"
            </p>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 3: PHOTO CAROUSEL / SLIDER ("SURATLAR")                        */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('gallery') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4 text-center"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#7E22CE] font-sans font-bold">
              {t.galleryTitle}
            </span>

            {/* Carousel Box */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-white shadow-xl shadow-purple-900/10 group bg-purple-100">
              <img
                src={galleryMedia[currentSlide]}
                alt="Gallery"
                className="w-full h-full object-cover cursor-pointer transition-all duration-500"
                onClick={() => setActiveModalMedia(galleryMedia[currentSlide])}
              />

              {/* Prev / Next Controls */}
              {galleryMedia.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev === 0 ? galleryMedia.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-purple-900 flex items-center justify-center shadow-md hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev === galleryMedia.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-purple-900 flex items-center justify-center shadow-md hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dots */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                {galleryMedia.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === idx ? 'w-6 bg-purple-700' : 'w-2 bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 4: CALENDAR CARD ("TO'Y SANASI")                                */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('calendar') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-6 rounded-3xl bg-white/80 border border-purple-200 shadow-xl space-y-4 font-sans text-center"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7E22CE] font-semibold">
                {t.calendarTitle}
              </span>
              <h4 className="text-xl font-serif font-bold text-[#581C87]">{dateStr}</h4>
            </div>

            <div className="pt-2">
              <div className="grid grid-cols-7 text-center text-xs text-purple-800 font-bold mb-2">
                {(t.weekdays || ["Dsh", "Ssh", "Chsh", "Psh", "Jum", "Shb", "Yak"]).map((wd, i) => (
                  <div key={i}>{wd}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center text-xs gap-y-2 text-purple-950">
                {calendarDays.map((d, i) => {
                  const isWeddingDay = d === targetDay;
                  return (
                    <div key={i} className="h-8 flex items-center justify-center">
                      {d && (
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-medium ${
                            isWeddingDay
                              ? 'bg-[#7E22CE] text-white font-bold shadow-lg shadow-purple-500/40 scale-110 animate-pulse'
                              : 'hover:bg-purple-100'
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

            <div className="pt-2 border-t border-purple-100 text-xs text-purple-900 font-medium flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4 text-[#7E22CE]" />
              <span>{timeStr} — {t.startTime}</span>
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 5: COUNTDOWN TIMER ("TO'YGA QADAR")                             */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('countdown') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-5"
          >
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#7E22CE] font-sans font-bold">
                {t.countdownTitle}
              </span>
              <p className="text-xs text-purple-800 font-light font-sans">{t.countdownSub}</p>
            </div>

            <div className="grid grid-cols-4 gap-2 font-sans">
              {[
                { label: t.days, val: calculatedTimeLeft.days },
                { label: t.hours, val: calculatedTimeLeft.hours },
                { label: t.minutes, val: calculatedTimeLeft.minutes },
                { label: t.seconds, val: calculatedTimeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/80 border border-purple-200 shadow-md shadow-purple-900/5"
                >
                  <span className="text-2xl md:text-3xl font-bold text-[#581C87]">
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-purple-700 mt-1 font-semibold">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 6: RECEPTION VENUE CARD ("BAXT TO'YXONASI")                    */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('venue') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-6 rounded-3xl bg-white/80 border border-purple-200 shadow-xl text-center space-y-4 font-sans"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7E22CE] font-semibold">
                {t.venueHeader}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#581C87]">{venueName}</h3>
              <p className="text-xs text-purple-900 font-light flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#7E22CE] shrink-0" />
                {venueAddress}
              </p>
            </div>

            {/* Map Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(venueName + ' ' + venueAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-purple-50 border border-purple-300 text-[#581C87] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#7E22CE] hover:text-white transition-all shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                Google Maps
              </a>
              <a
                href={`https://yandex.com/maps/?text=${encodeURIComponent(venueName + ' ' + venueAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-purple-50 border border-purple-300 text-[#581C87] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#7E22CE] hover:text-white transition-all shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                Yandex Maps
              </a>
            </div>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 7: WARM WISH CARD                                               */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('wish') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-purple-100/90 via-pink-50/90 to-purple-100/90 border border-purple-200 text-center space-y-3 font-serif shadow-lg"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#7E22CE] font-sans font-bold">
              {t.wishHeader}
            </span>
            <p className="text-xs text-purple-900 font-sans font-semibold">
              {t.wishFrom} <span className="text-[#581C87] font-bold">{wishFrom}</span>
            </p>
            <p className="text-xs text-purple-950/80 italic leading-relaxed px-4">
              «Gulday ochilgan bu baxt kunida siz bilan birga bo'lishni istardik. Kelishingizni intizorlik bilan kutamiz.»
            </p>
          </motion.section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SECTION 8: RSVP & LEAVE A WISH                                          */}
        {/* ----------------------------------------------------------------------- */}
        {isSectionVisible('rsvp') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-6 rounded-3xl bg-white/80 border border-purple-200 shadow-xl space-y-5 font-sans"
          >
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7E22CE] font-semibold">
                {t.wishesTitle}
              </span>
              <div>
                <button
                  type="button"
                  onClick={() => setShowWishModal(true)}
                  className="py-3 px-6 rounded-full bg-[#7E22CE] text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:bg-[#6B21A8] transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <MessageSquareHeart className="w-4 h-4" />
                  {t.leaveWish}
                </button>
              </div>
            </div>

            <div className="w-12 h-[1px] bg-purple-200 mx-auto" />

            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7E22CE] font-semibold">
                {t.willYouAttend}
              </span>
            </div>

            {(rsvpState?.isSuccess || rsvpSubmitted) ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-purple-50 border border-purple-300 text-center space-y-3"
              >
                <CheckCircle2 className="w-12 h-12 text-[#7E22CE] mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-[#581C87]">{t.rsvpSuccess}</h4>
                <p className="text-xs text-purple-800">{t.rsvpSuccessSub}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateRsvpAttending(true)}
                    className={`py-3 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      rsvpAttending === true
                        ? 'bg-[#7E22CE] text-white shadow-md'
                        : 'bg-purple-50 border border-purple-200 text-purple-900 hover:border-purple-400'
                    }`}
                  >
                    <Check className="w-4 h-4" /> {t.yes}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateRsvpAttending(false)}
                    className={`py-3 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      rsvpAttending === false
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-purple-50 border border-purple-200 text-purple-900 hover:border-purple-400'
                    }`}
                  >
                    <X className="w-4 h-4" /> {t.no}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-purple-900 font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#7E22CE]" /> {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => updateRsvpName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 placeholder-purple-400 focus:outline-none focus:border-[#7E22CE] transition-colors"
                  />
                </div>

                {rsvpAttending && (
                  <div className="space-y-1">
                    <label className="text-purple-900 font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#7E22CE]" /> {t.guestsLabel}
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => updateRsvpGuests(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-950 focus:outline-none focus:border-[#7E22CE] transition-colors"
                    >
                      <option value="1">1 kishi</option>
                      <option value="2">2 kishi</option>
                      <option value="3">3 kishi</option>
                      <option value="4">4+ kishi</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={rsvpState?.isSubmitting || !rsvpName.trim() || rsvpAttending === null}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#7E22CE] text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:bg-[#6B21A8] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {rsvpState?.isSubmitting ? 'ОТПРАВКА...' : t.submitRsvp}
                </button>
              </form>
            )}
          </motion.section>
        )}

        {/* SECTION 9: GIFT CARD / DONATION */}
        {isSectionVisible('giftCard') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-6 rounded-3xl bg-white/80 border border-purple-200 shadow-xl text-center space-y-4 font-sans"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7E22CE] font-semibold flex items-center justify-center gap-1">
                <Gift className="w-3.5 h-3.5" /> ПОДАРКИ И ПОЖЕЛАНИЯ
              </span>
              <h3 className="text-xl font-serif font-bold text-[#581C87]">Денежный подарок</h3>
              <p className="text-xs text-purple-800 font-light max-w-xs mx-auto leading-relaxed">
                Ваше присутствие — лучший подарок для нас! Если вы хотите сделать подарок в виде денежного перевода:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/90 border border-purple-200 flex flex-col items-center gap-2 max-w-xs mx-auto shadow-sm">
              <span className="text-base font-mono font-bold text-[#581C87] tracking-widest">{giftCardNumber}</span>
              <span className="text-[11px] text-purple-800 font-medium">Получатель: {giftCardOwner}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(giftCardNumber.replace(/\s+/g, ''));
                  alert('Номер карты скопирован!');
                }}
                className="mt-1 px-4 py-2 rounded-xl bg-[#7E22CE] text-white font-bold text-xs hover:bg-[#6B21A8] transition-all shadow-md shadow-purple-500/10 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Copy className="w-3.5 h-3.5" />
                Скопировать номер карты
              </button>
            </div>
          </motion.section>
        )}

        {/* FOOTER */}
        <footer className="text-center pt-8 pb-12 space-y-4 border-t border-purple-200 font-sans">
          <h5 className="text-2xl font-serif font-bold text-[#581C87]">
            {groomName} & {brideName}
          </h5>
          <p className="text-xs text-purple-800 font-light">{t.footerText}</p>
        </footer>

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeModalMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalMedia(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <button
              onClick={() => setActiveModalMedia(null)}
              className="absolute top-6 right-6 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-purple-400" onClick={e => e.stopPropagation()}>
              <img src={activeModalMedia} alt="Enlarged media" className="max-w-full max-h-[80vh] object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEAVE A WISH MODAL */}
      <AnimatePresence>
        {showWishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWishModal(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 text-purple-950"
            >
              <div className="flex justify-between items-center border-b pb-3 border-purple-100">
                <h4 className="font-serif font-bold text-lg text-[#581C87] flex items-center gap-2">
                  <MessageSquareHeart className="w-5 h-5 text-[#7E22CE]" />
                  {t.wishesTitle}
                </h4>
                <button onClick={() => setShowWishModal(false)} className="text-gray-400 hover:text-purple-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {userWishSent ? (
                <div className="py-6 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-[#7E22CE] mx-auto animate-bounce" />
                  <p className="font-bold text-[#581C87]">Rahmat! Tilagingiz yuborildi.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-purple-800">{t.writeWish}</label>
                  <textarea
                    rows={4}
                    value={userWishText}
                    onChange={e => setUserWishText(e.target.value)}
                    placeholder="Kelin va kuyovga samimiy niyatlaringiz..."
                    className="w-full p-3 rounded-xl border border-purple-200 text-xs focus:outline-none focus:border-[#7E22CE]"
                  />
                  <button
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
                    className="w-full py-3 rounded-xl bg-[#7E22CE] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#6B21A8] transition-all"
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
