import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, Clock, VolumeX, Volume2,
  Send, Copy, Check, Gift, Phone, Navigation,
  Crown, X, Plus, Image as ImageIcon, Video,
  Globe, Maximize2, Upload, SlidersHorizontal, Eye,
  Play, Pause, MapPin, User, Users, CheckCircle2, Share2
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
// Hilal Emerald & Gold Floating Dust Particle System
// ==========================================
const HilalParticleSystem = ({ isPreview }: { isPreview?: boolean }) => {
  if (isPreview) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {[...Array(18)].map((_, i) => (
        <motion.div
          key={`hilal-dust-${i}`}
          className="absolute rounded-full"
          style={{
            top: `${(i * 12) % 100}%`,
            left: `${(i * 23) % 100}%`,
            width: `${3 + (i % 4) * 2}px`,
            height: `${3 + (i % 4) * 2}px`,
            background: i % 3 === 0
              ? 'radial-gradient(circle, rgba(243,224,160,0.9) 0%, rgba(212,175,55,0) 70%)'
              : i % 3 === 1
              ? 'radial-gradient(circle, rgba(212,175,55,0.8) 0%, rgba(170,124,17,0) 70%)'
              : 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(212,175,55,0) 70%)',
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.4)',
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, (i % 2 === 0 ? 25 : -25), 0],
            opacity: [0.1, 0.85, 0.1],
            scale: [0.7, 1.3, 0.7],
          }}
          transition={{
            duration: 5 + (i % 5),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
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
        const radius = 70 + Math.random() * 110;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={`gold-burst-${i}`}
            className="absolute rounded-full bg-[#D4AF37]"
            style={{
              width: `${4 + Math.random() * 5}px`,
              height: `${4 + Math.random() * 5}px`,
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.9)',
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ 
              x, 
              y, 
              scale: [1, 1.4, 0], 
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
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
    bismillah: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ",
    openInvitation: "TAKLIFACHIQ",
    openInvitationSub: "Taklifnomani ochish uchun muhrni bosing",
    weddingInvitation: "NIKOH TO'YI TAKLIFNOMASI",
    weddingTitle: "NIKOH TO'YI",
    and: "&",
    quranHeader: "QUR'ONI KARIMDAN OYAT",
    quranArabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    quranTranslation: "«Va Sizlarga osuda hayot kechirishingiz uchun o'zingizdan juftlar yaratishi va o'rtangizda muhabbat hamda mehri-shafqat paydo qilib qo'yganligi — Uning belgilaridandir.»",
    quranSurah: "Rum surasi, 21-oyat",
    countdownTitle: "SANOQ",
    countdownSub: "To'ygacha qolgan vaqt",
    days: "KUN",
    hours: "SOAT",
    minutes: "DAQIQA",
    seconds: "SONIYA",
    calendarTitle: "SANA VA VAQT",
    calendarSub: "Tashrifingizni kutamiz",
    months: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
    weekdays: ["Dsh", "Ssh", "Chsh", "Psh", "Jum", "Shb", "Yak"],
    galleryTitle: "SURATLAR VA VIDEOLAR",
    gallerySub: "Baxtli damlarimizdan lavhalar",
    venueTitle: "MANZILIMIZ / TO'YXONA",
    venueSub: "Tantana o'tkaziladigan maskan",
    googleMaps: "Google Maps",
    yandexMaps: "Yandex Maps",
    duaArabic: "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    rsvpTitle: "MAROSIMGA KELASIZMI?",
    rsvpSub: "Iltimos, tashrifingizni tasdiqlang",
    attendingYes: "Albatta boraman",
    attendingNo: "Kela olmayman",
    nameLabel: "Ismingiz va familiyangiz",
    namePlaceholder: "Ismingizni kiriting",
    guestsLabel: "Mehmonlar soni",
    guestsPlaceholder: "Necha kishi kelasiz?",
    wishesLabel: "Samimiy tilaklaringiz",
    wishesPlaceholder: "Kelin-kuyovga niyatlaringiz...",
    submitRsvp: "Javobni yuborish",
    rsvpSuccess: "TASHRIFINGIZDAN MAMNUNMIZ!",
    rsvpSuccessSub: "Javobingiz qabul qilindi. Rahmat! ✨",
    giftTitle: "SOVGA UCHUN / TO'Y UCHUN",
    giftSub: "Pul ko'rinishidagi sovg'alar uchun",
    copyCard: "Karta raqamini nusxalash",
    copied: "Nusxalandi!",
    giftNote: "Kelin-kuyovga pul ko'rinishida sovg'a qilmoqchi bo'lsangiz, ushbu karta raqamiga o'tkazishingiz mumkin.",
    footerText: "Bunday taklifnomani siz ham buyurtma bering",
    addMedia: "Foto/Video qo'shish",
    videoTag: "VIDEO",
  },
  ru: {
    bismillah: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ",
    openInvitation: "ОТКРЫТЬ ПРИГЛАШЕНИЕ",
    openInvitationSub: "Нажмите на печать, чтобы открыть приглашение",
    weddingInvitation: "СВАДЕБНОЕ ПРИГЛАШЕНИЕ",
    weddingTitle: "СВАДЕБНОЕ ТОРЖЕСТВО",
    and: "&",
    quranHeader: "АЯТ ИЗ СВЯЩЕННОГО КОРАНА",
    quranArabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    quranTranslation: "«Среди Его знамений — то, что Он сотворил из вас самих жён для вас, чтобы вы находили в них покой, и установил между вами любовь и милосердие.»",
    quranSurah: "Сура Аль-Рум, 21-аят",
    countdownTitle: "ОТСЧЕТ ВРЕМЕНИ",
    countdownSub: "Осталось до торжества",
    days: "ДНЕЙ",
    hours: "ЧАСОВ",
    minutes: "МИНУТ",
    seconds: "СЕКУНД",
    calendarTitle: "ДАТА И ВРЕМЯ",
    calendarSub: "Ждем вас с нетерпением",
    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    galleryTitle: "ГАЛЕРЕЯ ФОТО И ВИДЕО",
    gallerySub: "Кадры нашей истории",
    venueTitle: "МЕСТО ПРОВЕДЕНИЯ",
    venueSub: "Адрес торжественного зала",
    googleMaps: "Google Карты",
    yandexMaps: "Яндекс Карты",
    duaArabic: "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    rsvpTitle: "ПОТВЕРЖДЕНИЕ ПРИСУТСТВИЯ",
    rsvpSub: "Пожалуйста, подтвердите ваше участие",
    attendingYes: "Я приду",
    attendingNo: "К сожалению, не смогу",
    nameLabel: "Ваше имя и фамилия",
    namePlaceholder: "Введите ваше имя",
    guestsLabel: "Количество гостей",
    guestsPlaceholder: "Сколько человек с вами?",
    wishesLabel: "Ваши пожелания",
    wishesPlaceholder: "Напишите ваши теплыя слова...",
    submitRsvp: "Отправить ответ",
    rsvpSuccess: "МЫ ОЧЕНЬ РАДЫ ВАШЕМУ ОТВЕТУ!",
    rsvpSuccessSub: "Ваше подтверждение принято. Спасибо! ✨",
    giftTitle: "ПОДАРОК НА СВАДЬБУ",
    giftSub: "Для денежных подарков",
    copyCard: "Скопировать номер карты",
    copied: "Скопировано!",
    giftNote: "Если вы хотите сделать подарок в виде денежного перевода, можете воспользоваться этим номером карты.",
    footerText: "Создайте такое же красивое приглашение",
    addMedia: "Добавить Фото/Видео",
    videoTag: "ВИДЕО",
  },
  en: {
    bismillah: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ",
    openInvitation: "OPEN INVITATION",
    openInvitationSub: "Tap the seal to open invitation",
    weddingInvitation: "WEDDING INVITATION",
    weddingTitle: "WEDDING CELEBRATION",
    and: "&",
    quranHeader: "HOLY QURAN VERSE",
    quranArabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    quranTranslation: "«And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.»",
    quranSurah: "Surah Ar-Rum, Verse 21",
    countdownTitle: "COUNTDOWN",
    countdownSub: "Time remaining until the big day",
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINUTES",
    seconds: "SECONDS",
    calendarTitle: "DATE & TIME",
    calendarSub: "We look forward to seeing you",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    galleryTitle: "PHOTO & VIDEO GALLERY",
    gallerySub: "Moments of our love story",
    venueTitle: "VENUE LOCATION",
    venueSub: "Where the ceremony will take place",
    googleMaps: "Google Maps",
    yandexMaps: "Yandex Maps",
    duaArabic: "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    rsvpTitle: "WILL YOU ATTEND?",
    rsvpSub: "Please confirm your attendance",
    attendingYes: "Yes, I will attend",
    attendingNo: "Sorry, I cannot attend",
    nameLabel: "Your Full Name",
    namePlaceholder: "Enter your name",
    guestsLabel: "Number of Guests",
    guestsPlaceholder: "How many guests?",
    wishesLabel: "Warm Wishes",
    wishesPlaceholder: "Leave your wishes for the couple...",
    submitRsvp: "Send Confirmation",
    rsvpSuccess: "WE ARE DELIGHTED TO HAVE YOU!",
    rsvpSuccessSub: "Your RSVP response has been received. Thank you! ✨",
    giftTitle: "WEDDING GIFT",
    giftSub: "For monetary gifts",
    copyCard: "Copy Card Number",
    copied: "Copied!",
    giftNote: "If you wish to send a monetary gift to the bride and groom, you can use the card number below.",
    footerText: "Create a beautiful invitation like this",
    addMedia: "Add Photo/Video",
    videoTag: "VIDEO",
  }
};

export const HilalWeddingSite: React.FC<WebsiteTemplateProps> = ({
  data,
  lang = 'uz',
  isOpened: externalIsOpened = false,
  onOpenEnvelope,
  isPlaying = false,
  onToggleAudio,
  timeLeft,
  rsvpState,
  isPreview = false,
  onToggleSection,
  onLanguageChange,
}) => {
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
    }, 850);
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
    if ((sectionKey === 'gift' || sectionKey === 'giftCard') && (hiddenSections.includes('gift') || hiddenSections.includes('giftCard'))) return false;
    if ((sectionKey === 'venue' || sectionKey === 'calendar') && hiddenSections.includes('dateVenue')) return false;
    if ((sectionKey === 'quran') && hiddenSections.includes('loveStory')) return false;
    return true;
  };

  // Dynamic Data & Media Fallbacks
  const groomName = data.groomName || 'DIYORBEK';
  const brideName = data.brideName || 'OYSHA';
  const dateStr = data.date || '8-IYUL, 2026';
  const timeStr = data.time || '14:00';
  const venueName = data.venue || 'SUNBULA';
  const venueAddress = data.address || "Toshkent shahri, Yunusobod tumani, Ahmad Yassaviy 34C";
  const giftCardNumber = data.giftCardNumber || '5614 6887 0174 4723';
  const giftCardOwner = data.giftCardOwner || 'MASHHURA XAMRAYEVA';

  // Photo & Video Media Handling
  const defaultPhoto = data.photoUrl 
    ? getMediaUrl(data.photoUrl) 
    : 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop';
  
  const defaultVideo = data.videoUrl ? getMediaUrl(data.videoUrl) : '';

  const defaultGallery = useMemo(() => {
    if (data.photos && data.photos.length > 0) {
      return data.photos.map(p => getMediaUrl(p));
    }
    return [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop',
    ];
  }, [data.photos]);

  const [heroPhoto] = useState<string>(defaultPhoto);
  const [heroVideo] = useState<string>(defaultVideo);
  const [galleryMedia, setGalleryMedia] = useState<string[]>(defaultGallery);
  const [newMediaUrl, setNewMediaUrl] = useState<string>('');
  const [activeModalMedia, setActiveModalMedia] = useState<string | null>(null);

  // Copy card state
  const [copied, setCopied] = useState(false);
  const handleCopyCard = () => {
    navigator.clipboard?.writeText(giftCardNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState(rsvpState?.name || '');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(rsvpState?.attending ?? true);
  const [rsvpWishes] = useState(rsvpState?.wishes || '');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(rsvpState?.isSuccess || false);

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
  const parsedEventDate = parseEventDateTime(data.date || '2026-07-08', data.time);
  const targetYear = parsedEventDate ? parsedEventDate.getFullYear() : 2026;
  const targetMonth = parsedEventDate ? parsedEventDate.getMonth() : 6;
  const targetDay = parsedEventDate ? parsedEventDate.getDate() : 8;

  const calendarDays = useMemo(() => {
    const totalDays = new Date(targetYear, targetMonth + 1, 0).getDate();
    const firstDayIndex = new Date(targetYear, targetMonth, 1).getDay();
    const startPadding = (firstDayIndex + 6) % 7; 
    const days: (number | null)[] = [];
    for (let i = 0; i < startPadding; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    return days;
  }, [targetYear, targetMonth]);

  return (
    <div className="relative min-h-screen bg-[#0A120D] text-[#E5E9E6] font-serif overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0A120D]">
      {/* Background Floating Gold Dust Particle Animation */}
      <HilalParticleSystem isPreview={isPreview} />

      {/* Floating Audio & Language Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* Language selector */}
        <div className="bg-[#0F1A13]/90 border border-[#D4AF37]/40 rounded-full px-3 py-1 flex items-center gap-1 text-xs text-[#D4AF37] backdrop-blur-md shadow-lg shadow-black/50">
          <Globe className="w-3.5 h-3.5" />
          <button
            onClick={() => {
              const nextLang = currentLang === 'uz' ? 'ru' : currentLang === 'ru' ? 'en' : 'uz';
              setCurrentLang(nextLang);
              if (onLanguageChange) onLanguageChange(nextLang);
            }}
            className="uppercase font-bold tracking-wider hover:text-white transition-colors"
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
            className="w-10 h-10 rounded-full bg-[#0F1A13]/90 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] backdrop-blur-md shadow-lg shadow-black/50 hover:bg-[#D4AF37] hover:text-[#0A120D] transition-all"
            title="Musiqa"
          >
            {isPlaying ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                <Volume2 className="w-5 h-5" />
              </motion.div>
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
          </motion.button>
        )}

        {/* Preview Section Manager Button */}
        {isPreview && (
          <button
            onClick={() => setShowSectionManager(!showSectionManager)}
            className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#0A120D] flex items-center justify-center shadow-lg font-sans"
            title="Sektsiyalarni boshqarish"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Preview Section Manager Drawer */}
      {isPreview && showSectionManager && (
        <div className="fixed top-16 right-4 z-50 bg-[#0F1A13] border border-[#D4AF37]/50 rounded-2xl p-4 w-72 shadow-2xl backdrop-blur-xl text-xs font-sans">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D4AF37]/20">
            <span className="font-bold text-[#D4AF37] flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Sektsiyalarni ko'rsatish
            </span>
            <button onClick={() => setShowSectionManager(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {[
              { id: 'hero', name: 'Asosiy Bosh sahfa (Hero)' },
              { id: 'quran', name: "Qur'on Oyati & Dua" },
              { id: 'countdown', name: 'Sanoq (Countdown)' },
              { id: 'calendar', name: 'Sana & Kalendar' },
              { id: 'gallery', name: 'Foto va Video Galereya' },
              { id: 'venue', name: "To'yxona & Xarita" },
              { id: 'rsvp', name: 'RSVP (Taklifga javob)' },
              { id: 'gift', name: "Sovg'a uchun (Karta)" },
            ].map(sec => (
              <label key={sec.id} className="flex items-center justify-between p-2 rounded-lg bg-[#0A120D] border border-white/5 cursor-pointer hover:border-[#D4AF37]/30">
                <span className="text-gray-200">{sec.name}</span>
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
                  className="accent-[#D4AF37] w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. LUXURY ARCH ENVELOPE / OPENING SCREEN (Matching Reference Video 1)   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={isOpening ? { opacity: [1, 1, 0], scale: [1, 1.05, 1.1] } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-40 bg-[radial-gradient(ellipse_at_center,rgba(15,26,19,0.95)_0%,#0A120D_100%)] flex flex-col items-center justify-between p-4 md:p-6 overflow-hidden select-none"
          >
            {/* Particle Burst on Wax Seal Tap */}
            <GoldBurst active={burstActive} />

            {/* Background Ambient Radial Glow */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none blur-2xl" />

            {/* Top Header: Arabic Bismillah Calligraphy */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="w-full max-w-sm pt-4 md:pt-6 text-center flex flex-col items-center z-10"
            >
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/50 flex items-center justify-center mb-3 bg-[#0F1A13]/80 shadow-[0_0_25px_rgba(212,175,55,0.25)] text-[#D4AF37]">
                <Crown className="w-6 h-6" />
              </div>

              <div className="text-[#D4AF37] text-2xl md:text-3xl font-arabic tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(212,175,55,0.5)]">
                {t.bismillah}
              </div>
            </motion.div>

            {/* Center Ornate Islamic Arch Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isOpening ? { scale: 1.05, y: -20 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-20 w-full max-w-xs aspect-[3/4.2] rounded-t-full border-2 border-[#D4AF37]/60 p-4 bg-gradient-to-b from-[#0F1A13]/95 via-[#0A120D]/95 to-[#0F1A13]/95 backdrop-blur-xl shadow-[0_0_60px_rgba(212,175,55,0.25)] flex flex-col items-center justify-between text-center overflow-hidden my-auto"
            >
              {/* Decorative Arch Corner Borders */}
              <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#D4AF37]/70 rounded-tl-sm" />
              <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#D4AF37]/70 rounded-tr-sm" />
              <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#D4AF37]/70 rounded-bl-sm" />
              <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#D4AF37]/70 rounded-br-sm" />

              {/* Top Subtitle */}
              <div className="pt-2 z-10 space-y-1">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-sans font-bold">
                  {t.weddingInvitation}
                </span>
              </div>

              {/* Couple Photo Showcase Inside Arch Window */}
              <div className="relative w-36 aspect-[3/4] rounded-t-full border-2 border-[#D4AF37]/80 p-1 bg-[#0A120D] shadow-[0_0_25px_rgba(212,175,55,0.3)] overflow-hidden my-2 group">
                <div className="w-full h-full rounded-t-full overflow-hidden relative">
                  {heroVideo ? (
                    <video src={heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={heroPhoto} alt={`${groomName} & ${brideName}`} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A120D] via-transparent to-transparent opacity-40" />
                </div>
              </div>

              {/* Couple Names & Date */}
              <div className="z-10 space-y-1">
                <h1 className="text-2xl md:text-3xl font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F3E0A0] via-[#D4AF37] to-[#AA7C11]">
                  {groomName} <span className="text-[#D4AF37] font-light text-xl">&</span> {brideName}
                </h1>
                <p className="text-[11px] text-[#D4AF37]/80 font-sans font-medium">
                  {dateStr} • {timeStr}
                </p>
              </div>

              {/* Interactive Pulsing Wax Seal Button */}
              <div className="relative z-30 pt-2 pb-1 flex flex-col items-center gap-2">
                {/* Outer Pulsing Glow */}
                <motion.div 
                  animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.75, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-20 h-20 rounded-full bg-[#D4AF37]/30 blur-md pointer-events-none"
                />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleOpenClick}
                  disabled={isOpening}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F3E0A0] via-[#D4AF37] to-[#AA7C11] p-0.5 shadow-[0_0_30px_rgba(212,175,55,0.6)] cursor-pointer flex items-center justify-center relative z-10 group"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0F1A13] via-[#0A120D] to-[#0F1A13] border border-[#F3E0A0]/70 flex flex-col items-center justify-center text-[#D4AF37] shadow-inner">
                    <Crown className="w-4 h-4 text-[#F3E0A0] group-hover:scale-110 transition-transform mb-0.5" />
                    <span className="text-[9px] font-serif font-bold tracking-widest text-[#F3E0A0]">
                      {groomName.charAt(0)}&{brideName.charAt(0)}
                    </span>
                  </div>
                </motion.button>
              </div>

              <p className="text-[10px] text-gray-300 font-sans font-light italic z-10 pb-1">
                {t.openInvitationSub}
              </p>
            </motion.div>

            {/* Bottom Invitation Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="w-full max-w-xs pb-4 z-20"
            >
              <button
                onClick={handleOpenClick}
                disabled={isOpening}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E0A0] to-[#AA7C11] text-[#0A120D] font-sans font-bold tracking-widest text-xs uppercase shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:shadow-[0_0_40px_rgba(212,175,55,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4 text-[#0A120D]" />
                {isOpening ? "OCHILMOQDA..." : t.openInvitation}
                <Crown className="w-4 h-4 text-[#0A120D]" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MAIN INVITATION CONTENT                                                  */}
      {/* ========================================================================= */}
      <div className="w-full max-w-md mx-auto px-4 py-8 space-y-12">

        {/* SECTION 1: HERO HEADER & COUPLE ARCH SHOWCASE */}
        {isSectionVisible('hero') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center pt-6 space-y-6"
          >
            <div className="space-y-2">
              <div className="text-[#D4AF37] text-2xl md:text-3xl font-arabic tracking-wider drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                {t.bismillah}
              </div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/70 font-sans font-semibold">
                {t.weddingInvitation}
              </p>
            </div>

            {/* Arch Framed Photo / Video Showcase */}
            <div className="relative mx-auto w-64 aspect-[3/4] rounded-t-full border-2 border-[#D4AF37] p-2 bg-[#0F1A13] shadow-[0_0_40px_rgba(212,175,55,0.2)] overflow-hidden group">
              <div className="w-full h-full rounded-t-full overflow-hidden relative">
                {heroVideo ? (
                  <video
                    src={heroVideo}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover rounded-t-full"
                  />
                ) : (
                  <img
                    src={heroPhoto}
                    alt={`${groomName} & ${brideName}`}
                    className="w-full h-full object-cover rounded-t-full group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A120D] via-transparent to-transparent opacity-60" />
              </div>
            </div>

            {/* Couple Names Header */}
            <div className="space-y-3 pt-2">
              <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#F3E0A0] via-[#D4AF37] to-[#AA7C11]">
                {groomName}
              </h2>
              <div className="text-2xl font-light text-[#D4AF37] italic font-serif my-1">
                {t.and}
              </div>
              <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#F3E0A0] via-[#D4AF37] to-[#AA7C11]">
                {brideName}
              </h2>
            </div>

            {/* Date & Time Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#0F1A13] border border-[#D4AF37]/40 shadow-lg text-sm text-[#D4AF37] font-sans font-medium">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>{dateStr}</span>
              <span className="text-[#D4AF37]/40">•</span>
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>{timeStr}</span>
            </div>
          </motion.section>
        )}

        {/* SECTION 2: QURANIC VERSE & ISLAMIC DUA */}
        {isSectionVisible('quran') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-6 rounded-3xl bg-[#0F1A13]/90 border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] text-center space-y-4 overflow-hidden backdrop-blur-md"
          >
            <div className="flex justify-center text-[#D4AF37]">
              <Crown className="w-5 h-5" />
            </div>

            <div className="text-xs uppercase tracking-widest text-[#D4AF37]/80 font-sans font-semibold">
              {t.quranHeader}
            </div>

            <div className="text-lg md:text-xl font-arabic leading-loose text-[#F3E0A0] px-2 py-1">
              {t.quranArabic}
            </div>

            <p className="text-xs md:text-sm text-gray-300 font-light italic leading-relaxed px-2">
              {t.quranTranslation}
            </p>

            <div className="text-[11px] text-[#D4AF37]/70 font-sans font-medium uppercase tracking-wider">
              {t.quranSurah}
            </div>
          </motion.section>
        )}

        {/* SECTION 3: COUNTDOWN TIMER ("SANOQ") */}
        {isSectionVisible('countdown') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-5"
          >
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-sans font-bold">
                TO'YGA QADAR
              </span>
              <h3 className="text-2xl font-serif text-[#F3E0A0] font-normal">
                {t.countdownTitle}
              </h3>
              <p className="text-xs text-gray-400 font-light font-sans">{t.countdownSub}</p>
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
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0F1A13] border border-[#D4AF37]/30 shadow-lg shadow-black/40"
                >
                  <span className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F3E0A0] to-[#D4AF37]">
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 mt-1 font-semibold">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION 4: INTERACTIVE CALENDAR HIGHLIGHT */}
        {isSectionVisible('calendar') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-6 rounded-3xl bg-[#0F1A13]/90 border border-[#D4AF37]/30 shadow-xl space-y-4 font-sans text-center"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                {t.calendarTitle}
              </span>
              <h4 className="text-xl font-serif text-[#F3E0A0]">{dateStr}</h4>
            </div>

            <div className="pt-2">
              <div className="grid grid-cols-7 text-center text-xs text-[#D4AF37]/80 font-bold mb-2">
                {t.weekdays.map((wd, i) => (
                  <div key={i}>{wd}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center text-xs gap-y-2 text-gray-300">
                {calendarDays.map((d, i) => {
                  const isWeddingDay = d === targetDay;
                  return (
                    <div key={i} className="h-8 flex items-center justify-center">
                      {d && (
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-medium ${
                            isWeddingDay
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A120D] font-bold shadow-[0_0_12px_rgba(212,175,55,0.8)] scale-110 animate-pulse'
                              : 'hover:bg-white/5'
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
          </motion.section>
        )}

        {/* SECTION 5: PHOTO & VIDEO GALLERY */}
        {isSectionVisible('gallery') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4 text-center"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-sans font-semibold">
                {t.galleryTitle}
              </span>
              <p className="text-xs text-gray-400 font-light font-sans">{t.gallerySub}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {galleryMedia.map((url, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveModalMedia(url)}
                  className="relative aspect-square rounded-2xl border border-[#D4AF37]/30 overflow-hidden bg-[#0F1A13] cursor-pointer shadow-lg group"
                >
                  {url.endsWith('.mp4') || url.includes('video') ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                      <video src={url} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play className="w-8 h-8 text-[#D4AF37] fill-[#D4AF37]" />
                      </div>
                      <span className="absolute bottom-2 right-2 text-[9px] bg-[#0A120D]/80 text-[#D4AF37] px-2 py-0.5 rounded font-sans font-bold">
                        {t.videoTag}
                      </span>
                    </div>
                  ) : (
                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <Maximize2 className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                </motion.div>
              ))}
            </div>

            {isPreview && (
              <div className="p-4 rounded-2xl bg-[#0F1A13] border border-[#D4AF37]/40 space-y-2 text-xs font-sans text-left">
                <label className="text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <Upload className="w-4 h-4" /> {t.addMedia}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg yoki video.mp4"
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0A120D] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    onClick={() => {
                      if (newMediaUrl.trim()) {
                        setGalleryMedia(prev => [...prev, newMediaUrl.trim()]);
                        setNewMediaUrl('');
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-[#D4AF37] text-[#0A120D] font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* SECTION 6: VENUE LOCATION & DUAL MAP LINKS */}
        {isSectionVisible('venue') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-6 rounded-3xl bg-[#0F1A13]/90 border border-[#D4AF37]/30 shadow-xl text-center space-y-4 font-sans"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                {t.venueTitle}
              </span>
              <h3 className="text-2xl font-serif text-[#F3E0A0]">{venueName}</h3>
              <p className="text-xs text-gray-300 font-light flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                {venueAddress}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(venueName + ' ' + venueAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#0A120D] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-[#0A120D] transition-all shadow-md"
              >
                <Navigation className="w-4 h-4" />
                {t.googleMaps}
              </a>
              <a
                href={`https://yandex.com/maps/?text=${encodeURIComponent(venueName + ' ' + venueAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#0A120D] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-[#0A120D] transition-all shadow-md"
              >
                <Navigation className="w-4 h-4" />
                {t.yandexMaps}
              </a>
            </div>

            <div className="pt-2 text-sm font-arabic text-[#D4AF37]/90 leading-relaxed">
              {t.duaArabic}
            </div>
          </motion.section>
        )}

        {/* SECTION 7: INTERACTIVE RSVP FORM */}
        {isSectionVisible('rsvp') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-6 rounded-3xl bg-[#0F1A13]/90 border border-[#D4AF37]/30 shadow-xl space-y-5 font-sans"
          >
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                {t.rsvpTitle}
              </span>
              <p className="text-xs text-gray-300 font-light">{t.rsvpSub}</p>
            </div>

            {rsvpSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-[#0A120D] border border-[#D4AF37] text-center space-y-3"
              >
                <CheckCircle2 className="w-12 h-12 text-[#D4AF37] mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-[#F3E0A0]">{t.rsvpSuccess}</h4>
                <p className="text-xs text-gray-300">{t.rsvpSuccessSub}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(true)}
                    className={`py-3 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      rsvpAttending === true
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A120D] shadow-lg shadow-[#D4AF37]/30'
                        : 'bg-[#0A120D] border border-white/10 text-gray-300 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <Check className="w-4 h-4" /> {t.attendingYes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(false)}
                    className={`py-3 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      rsvpAttending === false
                        ? 'bg-red-900/60 border border-red-500 text-red-200'
                        : 'bg-[#0A120D] border border-white/10 text-gray-300 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <X className="w-4 h-4" /> {t.attendingNo}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" /> {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A120D] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                {rsvpAttending && (
                  <div className="space-y-1">
                    <label className="text-gray-300 font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" /> {t.guestsLabel}
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A120D] border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                    >
                      <option value="1">1 kishi</option>
                      <option value="2">2 kishi</option>
                      <option value="3">3 kishi</option>
                      <option value="4+">4+ kishi</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E0A0] to-[#AA7C11] text-[#0A120D] font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#D4AF37]/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {t.submitRsvp}
                </button>
              </form>
            )}
          </motion.section>
        )}

        {/* SECTION 8: GLASSMORPHIC BANK GIFT CARD ("SOVGA UCHUN") */}
        {isSectionVisible('gift') && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4 text-center font-sans"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                {t.giftTitle}
              </span>
              <p className="text-xs text-gray-400 font-light">{t.giftSub}</p>
            </div>

            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#0F2618] via-[#0F1A13] to-[#050B07] border border-[#D4AF37]/50 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-left space-y-5 overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />

              <div className="flex justify-between items-center">
                <span className="text-xs font-serif font-bold text-[#D4AF37] tracking-widest uppercase">
                  WEDDING GIFT CARD
                </span>
                <Gift className="w-6 h-6 text-[#D4AF37]" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">KARTA RAQAMI</span>
                <div className="text-xl md:text-2xl font-mono font-bold tracking-widest text-[#F3E0A0] drop-shadow-md">
                  {giftCardNumber}
                </div>
              </div>

              <div className="flex items-end justify-between pt-2">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-mono">EGASINI ISMI</span>
                  <span className="text-xs font-semibold text-white tracking-wider uppercase font-mono">
                    {giftCardOwner}
                  </span>
                </div>

                <button
                  onClick={handleCopyCard}
                  className="py-2 px-3.5 rounded-xl bg-[#D4AF37] text-[#0A120D] text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t.copied : t.copyCard}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 font-light px-4 italic leading-relaxed">
              {t.giftNote}
            </p>
          </motion.section>
        )}

        {/* FOOTER */}
        <footer className="text-center pt-8 pb-12 space-y-4 border-t border-[#D4AF37]/20 font-sans">
          <h5 className="text-2xl font-serif text-[#D4AF37]">
            {groomName} & {brideName}
          </h5>
          <p className="text-xs text-gray-400 font-light">{t.footerText}</p>
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
            <div className="max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-[#D4AF37]/50" onClick={e => e.stopPropagation()}>
              {activeModalMedia.endsWith('.mp4') || activeModalMedia.includes('video') ? (
                <video src={activeModalMedia} controls autoPlay className="max-w-full max-h-[80vh] object-contain" />
              ) : (
                <img src={activeModalMedia} alt="Enlarged media" className="max-w-full max-h-[80vh] object-contain" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
