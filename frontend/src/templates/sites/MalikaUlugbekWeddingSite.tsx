import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, Clock, VolumeX, Volume2,
  Send, Copy, Check, Gift, Phone, Navigation,
  Crown, X, Image as ImageIcon, Sparkles, ChevronDown,
  MapPin, Music, CheckCircle2, UserCheck, MessageSquare
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
// Golden Dust Ambient Particle System
// ==========================================
const GoldParticleSystem = ({ isPreview }: { isPreview?: boolean }) => {
  if (isPreview) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {[...Array(18)].map((_, i) => (
        <motion.div
          key={`gold-dust-${i}`}
          className="absolute rounded-full"
          style={{
            top: `${(i * 11) % 100}%`,
            left: `${(i * 19) % 100}%`,
            width: `${3 + (i % 4) * 2}px`,
            height: `${3 + (i % 4) * 2}px`,
            background: i % 2 === 0
              ? 'radial-gradient(circle, rgba(212,175,55,0.85) 0%, rgba(212,175,55,0) 70%)'
              : 'radial-gradient(circle, rgba(255,223,128,0.75) 0%, rgba(245,158,11,0) 70%)',
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.4)',
          }}
          animate={{
            y: [0, -75, 0],
            x: [0, (i % 2 === 0 ? 15 : -15), 0],
            opacity: [0.15, 0.85, 0.15],
            scale: [0.7, 1.25, 0.7],
          }}
          transition={{
            duration: 5 + (i % 4),
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
// SWIPE TO OPEN SLIDER BUTTON (EXACT VIDEO MATCH)
// ==========================================
const SwipeToOpenButton = ({ onOpen }: { onOpen: () => void }) => {
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

  const handleDragEnd = (_: any, info: any) => {
    const maxDrag = containerWidth - 56;
    if (info.offset.x > maxDrag * 0.45 || info.point.x > containerWidth * 0.6) {
      triggerSuccess();
    }
  };

  const triggerSuccess = () => {
    if (dragged) return;
    setDragged(true);
    setTimeout(() => {
      onOpen();
    }, 450);
  };

  return (
    <div 
      ref={containerRef}
      onClick={triggerSuccess}
      className="w-full h-14 sm:h-16 rounded-full bg-slate-900/90 border border-amber-400/50 backdrop-blur-md p-1.5 flex items-center relative overflow-hidden select-none shadow-[0_0_30px_rgba(212,175,55,0.35)] cursor-pointer group"
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

      {/* Centered Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pl-6">
        <span className="text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.25em] text-amber-200 group-hover:text-amber-100 transition-colors drop-shadow-md">
          OCHISH UCHUN SURING
        </span>
      </div>

      {/* Draggable Circle Knob (Starts at LEFT) */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: Math.max(0, containerWidth - 56) }}
        dragElastic={0.15}
        dragSnapToOrigin={!dragged}
        onDragEnd={handleDragEnd}
        animate={
          dragged
            ? { x: Math.max(0, containerWidth - 56) }
            : { x: [0, 14, 0] }
        }
        transition={
          dragged
            ? { duration: 0.45, ease: 'easeOut' }
            : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
        }
        className="w-11 sm:w-13 h-11 sm:h-13 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-bold flex items-center justify-center shadow-lg z-20 shrink-0 cursor-grab active:cursor-grabbing border border-amber-200/80"
      >
        <span className="text-base sm:text-lg font-bold">→</span>
      </motion.div>
    </div>
  );
};

// Default sample gallery images matching luxury wedding vibe
const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop',
];

export const MalikaUlugbekWeddingSite: React.FC<WebsiteTemplateProps> = ({
  data,
  customFields,
  lang = 'uz',
  isOpened = false,
  onOpenEnvelope,
  isPlaying = false,
  onToggleAudio,
  timeLeft: externalTimeLeft,
  rsvpState,
  isPreview = false,
  onToggleSection,
}) => {
  // Opening state
  const [internalOpened, setInternalOpened] = useState(isOpened);
  const isOpenedState = isOpened || internalOpened;

  const handleOpen = () => {
    setInternalOpened(true);
    if (onOpenEnvelope) onOpenEnvelope();
  };

  // Content state with fallback defaults matching reference video
  const groomName = data.groomName || "Ulug'bek";
  const brideName = data.brideName || "Malika";
  const weddingDate = data.date || "2026-09-09";
  const weddingTime = data.time || "18:00";
  const venueName = data.venue || "Baxtiyor restorani";
  const addressText = data.address || "Toshkent sh., Yunusobod tumani, Amir Temur ko'chasi 108";

  // Gallery Photos Display (No public inputs)
  const photos = useMemo(() => {
    if (data.photos && data.photos.length > 0) {
      return data.photos.map(p => getMediaUrl(p));
    }
    return DEFAULT_GALLERY;
  }, [data.photos]);

  const maxPhotosLimit = 6;
  const [activeModalPhoto, setActiveModalPhoto] = useState<string | null>(null);

  // Live Timer
  const timerDisplay = useCountdownTimer(weddingDate, weddingTime, externalTimeLeft);

  // Calendar Export (.ics)
  const handleAddToCalendar = () => {
    const title = `${brideName} & ${groomName} Nikoh To'yi`;
    const details = `Sizni ${brideName} va ${groomName} ning nikoh to'yiga taklif etamiz. Manzil: ${venueName}, ${addressText}`;
    const location = `${venueName}, ${addressText}`;
    
    const dateObj = new Date(`${weddingDate}T${weddingTime}:00`);
    const startTimeStr = dateObj.toISOString().replace(/-|:|\.\d+/g, '');
    const endDateObj = new Date(dateObj.getTime() + 4 * 60 * 60 * 1000);
    const endTimeStr = endDateObj.toISOString().replace(/-|:|\.\d+/g, '');

    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Taklifnoma//Wedding Calendar//UZ
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${details}
LOCATION:${location}
DTSTART:${startTimeStr}
DTEND:${endTimeStr}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'wedding_event.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // RSVP Form Modal State
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [guestNameInput, setGuestNameInput] = useState('');
  const [isAttendingInput, setIsAttendingInput] = useState<boolean | null>(true);
  const [guestWishesInput, setGuestWishesInput] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpState?.onSubmit) {
      rsvpState.onSubmit(e);
    }
    setRsvpSubmitted(true);
    setTimeout(() => {
      setShowRsvpModal(false);
      setRsvpSubmitted(false);
    }, 2200);
  };

  // Maps URL
  const mapUrl = `https://yandex.com/maps/?text=${encodeURIComponent(`${venueName} ${addressText}`)}`;

  return (
    <div className="w-full min-h-screen bg-[#070A10] text-[#2C2420] font-serif antialiased relative selection:bg-amber-200 selection:text-amber-900 flex justify-center">
      <GoldParticleSystem isPreview={isPreview} />

      {/* Floating Audio Toggle */}
      {onToggleAudio && (
        <button
          onClick={onToggleAudio}
          className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
          title="Musiqani yoqish/o'chirish"
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

      {/* ======================================================== */}
      {/* COVER / ENVELOPE INTRO SCREEN (SLIDES UPWARDS ON OPEN) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {!isOpenedState && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={{ 
              y: '-100%', 
              opacity: 0,
              transition: { duration: 0.85, ease: [0.33, 1, 0.68, 1] } 
            }}
            className="fixed inset-0 z-40 bg-[#0A0E17] flex flex-col items-center justify-between p-6 sm:p-10 text-center select-none overflow-hidden"
          >
            {/* Luxury Border Ornaments */}
            <div className="absolute inset-4 sm:inset-8 border border-amber-500/30 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
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
            <div className="pt-8 sm:pt-12 z-10">
              <span className="inline-block px-5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm uppercase tracking-[0.25em] font-sans">
                SIZGA TAKLIFNOMA KELDI
              </span>
            </div>

            {/* Center Names & Quranic Ayah */}
            <div className="my-auto z-10 max-w-md w-full px-4 space-y-4">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="text-4xl sm:text-6xl font-serif tracking-wide text-amber-200 drop-shadow-md"
                >
                  {brideName}
                </motion.h1>
                <span className="text-amber-400/80 text-2xl font-light italic font-serif my-1 block">&</span>
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  className="text-4xl sm:text-6xl font-serif tracking-wide text-amber-200 drop-shadow-md"
                >
                  {groomName}
                </motion.h1>
              </div>

              <div className="text-amber-300/80 tracking-widest text-xs sm:text-sm font-sans">
                {weddingDate.replace(/-/g, ' . ')}
              </div>

              {/* Calligraphy Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-sm shadow-2xl space-y-2.5"
              >
                <p className="text-2xl sm:text-3xl text-amber-200 font-serif leading-relaxed" style={{ fontFamily: 'Traditional Arabic, Scheherazade, serif' }}>
                  وَأَلَّفَ بَيْنَ قُلُوبِهِمْ
                </p>
                <p className="text-xs sm:text-sm text-amber-100/90 italic font-serif">
                  «Va U ularning qalblarini birlashtirdi»
                </p>
                <p className="text-[10px] text-amber-400/70 uppercase tracking-widest font-sans">
                  ANFOL SURASI, 63-OYAT
                </p>
              </motion.div>
            </div>

            {/* Bottom Swipe To Open Button (EXACT VIDEO MATCH) */}
            <div className="pb-8 sm:pb-12 z-10 w-full max-w-xs px-4">
              <SwipeToOpenButton onOpen={handleOpen} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Device Frame Container for Exact Video Match */}
      <div className="w-full max-w-[450px] min-h-screen bg-[#FAF7F2] relative shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-x-hidden border-x border-amber-900/10">

        {/* ======================================================== */}
        {/* MAIN WEBSITE CONTENT (SILK CHAMPAGNE PAGE) */}
        {/* ======================================================== */}
        <main className="w-full px-5 py-8 space-y-14 z-20">

          {/* ------------------------------------------------------ */}
          {/* SECTION 1: MAIN HERO */}
          {/* ------------------------------------------------------ */}
          <section className="pt-6 text-center space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-3"
            >
              <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-amber-800/70 border-b border-amber-300/60 pb-1 inline-block">
                NIKOH TO'YIGA TAKLIFNOMA
              </span>
              
              <h1 className="text-4xl sm:text-5xl font-serif text-[#2C2420] tracking-wide pt-1">
                {brideName}
              </h1>
              <div className="text-amber-600/80 text-xl font-light italic font-serif">&</div>
              <h1 className="text-4xl sm:text-5xl font-serif text-[#2C2420] tracking-wide">
                {groomName}
              </h1>

              <div className="pt-3 flex items-center justify-center gap-3 text-amber-900/80 text-xs font-sans tracking-widest">
                <span className="h-[1px] w-6 bg-amber-400/60"></span>
                <span>{weddingDate.replace(/-/g, ' . ')}</span>
                <span className="h-[1px] w-6 bg-amber-400/60"></span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="pt-8 text-center text-[10px] text-amber-900/60 font-sans tracking-widest uppercase flex flex-col items-center gap-1.5"
            >
              <span>DAVOMI BOR — SURING</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown className="w-4 h-4 text-amber-600" />
              </motion.div>
            </motion.div>
          </section>

          {/* ------------------------------------------------------ */}
          {/* SECTION 2: SACRED AYAH CARD */}
          {/* ------------------------------------------------------ */}
          <section>
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-amber-200/80 shadow-[0_8px_25px_rgba(212,175,55,0.08)] text-center space-y-3.5 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>

              <p className="text-2xl text-amber-950 font-serif leading-relaxed pt-1" style={{ fontFamily: 'Traditional Arabic, Scheherazade, serif' }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              <p className="text-xl text-amber-900/90 font-serif leading-loose" style={{ fontFamily: 'Traditional Arabic, Scheherazade, serif' }}>
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
              </p>

              <p className="text-xs text-stone-700 italic font-serif leading-relaxed">
                «Yana Uning oyatlaridan biri — sizlarga tiringizdan, ko'ngillaringizga orom topishi uchun juftlar yaratgani va orangizda muhabbat va rahmat solib qo'yganidir.»
              </p>

              <span className="inline-block text-[9px] text-amber-800/60 uppercase tracking-widest font-sans">
                (RUM SURASI, 21-OYAT)
              </span>
            </motion.div>
          </section>

          {/* ------------------------------------------------------ */}
          {/* SECTION 3: HOSTS & RESPECT SECTION */}
          {/* ------------------------------------------------------ */}
          <section className="text-center space-y-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-sans tracking-[0.2em] text-amber-800/60 uppercase">
                KATTA HURMAT BILAN
              </span>
              <div className="w-10 h-[1px] bg-amber-400/60 mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-white/60 border border-amber-200/50">
                <span className="text-[9px] font-sans tracking-widest uppercase text-amber-800/70 block mb-1">
                  KELIN TOMONDAN
                </span>
                <p className="text-sm font-serif text-stone-900 font-semibold">
                  Akmal va Dilbar
                </p>
                <p className="text-xs font-serif text-amber-800/80">Karimovlar</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/60 border border-amber-200/50">
                <span className="text-[9px] font-sans tracking-widest uppercase text-amber-800/70 block mb-1">
                  KUYOV TOMONDAN
                </span>
                <p className="text-sm font-serif text-stone-900 font-semibold">
                  Rustam va Nodira
                </p>
                <p className="text-xs font-serif text-amber-800/80">Soliyevlar</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 font-serif italic max-w-xs mx-auto">
              Farzandlarimizning baxtli kunini Siz bilan birga nishonlashdan mamnunmiz.
            </p>

            <div className="pt-2 space-y-2.5">
              <span className="text-[10px] font-sans tracking-[0.2em] text-amber-800/60 uppercase block">
                SIZNI TAKLIF ETAMIZ
              </span>
              <div className="p-5 rounded-2xl bg-white/80 border border-amber-200/70 shadow-sm text-xs font-serif leading-relaxed text-stone-800">
                <p className="italic mb-2 text-amber-900 font-medium text-sm">
                  «Ikki yurak bir bo'lib, yangi hayot ostonasida turibmiz...»
                </p>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  Hayotimizdagi eng baxtli kun — nikoh to'yimizda Siz aziz mehmonimiz bo'lishingizni samimiy va nafis bir tilak bilan so'rab qolamiz.
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------ */}
          {/* SECTION 4: COUNTDOWN & CALENDAR EXPORT */}
          {/* ------------------------------------------------------ */}
          <section className="text-center space-y-5">
            <span className="text-[10px] font-sans tracking-[0.2em] text-amber-800/70 uppercase">
              TO'YGA QOLDI
            </span>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'KUN', value: timerDisplay.days },
                { label: 'SOAT', value: timerDisplay.hours },
                { label: 'DAQIQA', value: timerDisplay.minutes },
                { label: 'SONIYA', value: timerDisplay.seconds },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-2xl bg-white border border-amber-200/80 shadow-sm flex flex-col items-center justify-center"
                >
                  <span className="text-2xl font-serif font-bold text-amber-900">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-sans tracking-wider text-stone-500 mt-0.5 uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddToCalendar}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-amber-300 text-amber-900 text-xs font-sans font-semibold tracking-wider uppercase shadow-sm hover:bg-amber-50 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>KALENDARGA QO'SHISH</span>
            </button>
          </section>

          {/* ------------------------------------------------------ */}
          {/* SECTION 5: LOVE STORY TIMELINE */}
          {/* ------------------------------------------------------ */}
          <section className="space-y-5">
            <div className="text-center space-y-0.5">
              <span className="text-[9px] font-sans tracking-[0.2em] text-amber-800/60 uppercase">
                SEVGI TARIXI
              </span>
              <h2 className="text-2xl font-serif text-stone-900">
                Bizning hikoyamiz
              </h2>
            </div>

            <div className="space-y-3 relative before:absolute before:left-5 before:top-2.5 before:bottom-2.5 before:w-[1px] before:bg-amber-300/60">
              {[
                {
                  year: '2022',
                  title: 'Ilk uchrashuv',
                  desc: 'Taqdir bizi bir kurs shahar bog\'ida uchrashatirdi.',
                },
                {
                  year: '2023',
                  title: 'Sevgi izhori',
                  desc: 'Bir yil do\'stlikdan so\'ng yuraklarimiz birga bog\'lendi.',
                },
                {
                  year: '2024',
                  title: 'Unashtiruv',
                  desc: 'Oilalarimiz duosi bilan unashtirildik, kelajakni rejalashtirdik.',
                },
              ].map((step, idx) => (
                <div key={idx} className="relative pl-10">
                  <div className="absolute left-3.5 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-sm -translate-x-1/2"></div>
                  <div className="p-3.5 rounded-2xl bg-white/70 border border-amber-200/50 shadow-sm space-y-0.5">
                    <span className="text-[11px] font-sans font-bold text-amber-700 tracking-wider">
                      {step.year}
                    </span>
                    <h3 className="text-sm font-serif font-semibold text-stone-900">
                      {step.title}
                    </h3>
                    <p className="text-xs text-stone-600 font-sans leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------ */}
          {/* SECTION 6: EVENT PROGRAM SCHEDULE */}
          {/* ------------------------------------------------------ */}
          <section className="space-y-5">
            <div className="text-center space-y-0.5">
              <span className="text-[9px] font-sans tracking-[0.2em] text-amber-800/60 uppercase">
                KUN TARTIBI
              </span>
              <h2 className="text-2xl font-serif text-stone-900">
                Marosim dasturi
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { time: '18:00', icon: Heart, label: 'Mehmonlarni kutib olish' },
                { time: '19:00', icon: Crown, label: 'Nikoh marosimi' },
                { time: '20:00', icon: Sparkles, label: 'Ziyofat boshlanishi' },
                { time: '22:00', icon: Music, label: 'Marosim yakuni' },
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/80 border border-amber-200/60 shadow-sm flex items-center gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100/80 border border-amber-300/60 flex items-center justify-center text-amber-800 shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-sans font-bold text-amber-900 block">
                        {item.time}
                      </span>
                      <span className="text-xs font-serif text-stone-700">
                        {item.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ------------------------------------------------------ */}
          {/* SECTION 7: PHOTO GALLERY & UPLOAD COUNTER (NO PUBLIC INPUTS) */}
          {/* ------------------------------------------------------ */}
          <section className="space-y-5">
            <div className="text-center space-y-0.5">
              <span className="text-[9px] font-sans tracking-[0.2em] text-amber-800/60 uppercase">
                LAHZALAR
              </span>
              <h2 className="text-2xl font-serif text-stone-900">
                Bizning suratlarimiz
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                Suratga bosib kattalashtiring
              </p>
            </div>

            {/* UPLOAD COUNTER BADGE */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white border border-amber-200/70 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-sans font-medium text-stone-700">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>Yuklangan rasmlar:</span>
              </div>
              <span className="px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-900 font-sans font-bold text-xs">
                {photos.length} / {maxPhotosLimit}
              </span>
            </div>

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
                    alt={`Gallery photo ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------ */}
          {/* SECTION 8: LOCATION & MAP */}
          {/* ------------------------------------------------------ */}
          <section className="space-y-5 text-center">
            <div className="space-y-0.5">
              <span className="text-[9px] font-sans tracking-[0.2em] text-amber-800/60 uppercase">
                MAROSIM MANZILI
              </span>
              <h2 className="text-2xl font-serif text-stone-900">
                To'y qayerda bo'ladi
              </h2>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-md text-center space-y-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300/60 mx-auto flex items-center justify-center text-amber-800">
                <MapPin className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-serif font-bold text-amber-950">
                {venueName}
              </h3>

              <p className="text-xs text-stone-600 font-sans max-w-xs mx-auto leading-relaxed">
                {addressText}
              </p>

              <p className="text-xs font-sans font-semibold text-amber-800">
                Soat {weddingTime} dan
              </p>

              <div className="pt-1">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-stone-950 font-sans font-bold text-xs tracking-wider uppercase shadow-md hover:bg-amber-400 transition-all"
                >
                  <span>MANZILNI KO'RISH</span>
                  <Navigation className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------ */}
          {/* SECTION 9: RSVP & CLOSING DARK CARD */}
          {/* ------------------------------------------------------ */}
          <section className="pt-4 pb-4">
            <div className="p-7 rounded-3xl bg-[#0B0F17] border border-amber-500/30 text-center text-amber-100 shadow-2xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500"></div>

              <h2 className="text-3xl font-serif text-amber-300">
                {brideName} & {groomName}
              </h2>

              <p className="text-xs font-serif italic text-amber-200/80">
                Sizni kutib qolamiz
              </p>

              <p className="text-[11px] font-sans tracking-widest text-amber-400/80 uppercase">
                {weddingDate.replace(/-/g, ' . ')}
              </p>

              <div className="pt-1">
                <button
                  onClick={() => setShowRsvpModal(true)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all cursor-pointer"
                >
                  TASHRIFNOMA (RSVP FORM)
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ======================================================== */}
      {/* LIGHTBOX MODAL FOR GALLERY PHOTOS */}
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
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10"
              onClick={() => setActiveModalPhoto(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={activeModalPhoto} 
              alt="Enlarged view" 
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* RSVP FORM MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showRsvpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 text-stone-900 shadow-2xl border border-amber-200 relative"
            >
              <button 
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>

              {rsvpSubmitted ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Rahmat! Tashrifingiz qabul qilindi.
                  </h3>
                  <p className="text-xs font-sans text-stone-500">
                    Sizni to'yimizda ko'rishdan juda mamnun bo'lamiz!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-3.5">
                  <div className="text-center space-y-0.5">
                    <span className="text-[9px] font-sans tracking-[0.2em] text-amber-800/70 uppercase">
                      ONLAYN TAKLIFNOMA
                    </span>
                    <h3 className="text-lg font-serif font-bold text-stone-900">
                      Tashrifingizni tasdiqlang
                    </h3>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-sans font-semibold text-stone-700">
                      Ismingiz va Familiyangiz:
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpState ? rsvpState.name : guestNameInput}
                      onChange={(e) => {
                        if (rsvpState) rsvpState.setName(e.target.value);
                        else setGuestNameInput(e.target.value);
                      }}
                      placeholder="Masalan: Jamshid Aliyev"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-semibold text-stone-700 block">
                      Tashrif buyurasizmi?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (rsvpState) rsvpState.setAttending(true);
                          else setIsAttendingInput(true);
                        }}
                        className={`py-2 rounded-xl font-sans text-xs font-bold border transition-all ${
                          (rsvpState ? rsvpState.attending === true : isAttendingInput === true)
                            ? 'bg-amber-500 border-amber-500 text-stone-950 shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        Albatta kelaman!
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (rsvpState) rsvpState.setAttending(false);
                          else setIsAttendingInput(false);
                        }}
                        className={`py-2 rounded-xl font-sans text-xs font-bold border transition-all ${
                          (rsvpState ? rsvpState.attending === false : isAttendingInput === false)
                            ? 'bg-stone-800 border-stone-800 text-white shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        Bora olmayman
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-sans font-semibold text-stone-700">
                      Samimiy tilagingiz (ixtiyoriy):
                    </label>
                    <textarea
                      rows={2}
                      value={rsvpState ? rsvpState.wishes : guestWishesInput}
                      onChange={(e) => {
                        if (rsvpState) rsvpState.setWishes(e.target.value);
                        else setGuestWishesInput(e.target.value);
                      }}
                      placeholder="Yoshlarga baxt-saodat tilayman..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-950 font-sans font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
                  >
                    YUBORISH
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
