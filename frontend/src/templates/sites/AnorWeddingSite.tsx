import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Heart, Calendar, Clock, VolumeX,
  Copy, Check, Navigation,
  Crown, X, Globe, Maximize2, Upload, SlidersHorizontal, Eye
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

  // Photos & Gallery
  const defaultPhoto = data.photoUrl ? getMediaUrl(data.photoUrl) : 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop';
  const defaultGallery = data.photos && data.photos.length > 0 
    ? data.photos.map(p => getMediaUrl(p))
    : [
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop',
      ];

  const [heroPhoto, setHeroPhoto] = useState<string>(defaultPhoto);
  const [photos, setPhotos] = useState<string[]>(defaultGallery);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [activeModalPhoto, setActiveModalPhoto] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const groomName = data.groomName || 'Сардор';
  const brideName = data.brideName || 'Нигора';
  const date = data.date || '2026-09-20';
  const time = data.time || '18:00';
  const venue = data.venue || 'Anor Saroyi';
  const address = data.address || 'г. Ташкент, Шайхантахурский район, ул. Навои, 88';
  const loveStory = data.loveStory;
  const giftCardNumber = data.giftCardNumber || '8600 7710 4420 8911';
  const giftCardOwner = data.giftCardOwner || `${groomName} С.`;

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
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotos(prev => [...prev, url]);
      if (!heroPhoto) setHeroPhoto(url);
    }
  };

  const copyGiftCard = () => {
    navigator.clipboard.writeText(giftCardNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      invitationTitle: 'Восточное Свадебное Приглашение',
      welcomeText: 'С любовью и уважением приглашаем вас разделять с нами праздник нашего вечного союза!',
      openEnvelopeBtn: 'Открыть приглашение',
      ourStoryTitle: 'История Любви',
      dateAndPlace: 'Дата и Место Торжества',
      dateLabel: 'Дата',
      timeLabel: 'Время',
      venueLabel: 'Зал торжеств',
      addressLabel: 'Адрес',
      openMap: 'Открыть на карте',
      countdownTitle: 'До торжества осталось',
      days: 'дней',
      hours: 'часов',
      minutes: 'минут',
      seconds: 'секунд',
      passed: 'Свадьба уже идет!',
      programTitle: 'Программа Вечера',
      dressCodeTitle: 'Палитра & Дресс-код',
      dressCodeSubtitle: 'Будем признательны за соблюдение праздничной гаммы:',
      galleryTitle: 'Фотогалерея',
      gallerySubtitle: 'Самые памятные моменты нашей жизни',
      addPhotoBtn: 'Добавить фото',
      addPhotoPlaceholder: 'Ссылка на фото...',
      rsvpTitle: 'Подтверждение (RSVP)',
      rsvpSubtitle: 'Пожалуйста, подтвердите ваше участие заранее',
      yourName: 'Ваше имя',
      willAttend: 'Сможете ли вы прийти?',
      yes: 'Да, обязательно буду!',
      no: 'К сожалению, не смогу',
      wishesPlaceholder: 'Пожелания для молодожёнов...',
      sendRsvp: 'Отправить ответ',
      sending: 'Отправка...',
      thankYouRsvp: 'Спасибо за ваш ответ!',
      giftTitle: 'Подарки и Пожелания',
      giftSubtitle: 'Ваше присутствие — лучшая награда для нас!',
      copyCard: 'Скопировать номер карты',
      copiedText: 'Скопировано!',
      cardOwner: 'Получатель',
      sectionsManager: 'Разделы сайта',
      restoreAll: 'Показать все скрытые блоки',
      hideSectionHint: 'Убрать раздел',
      scheduleItems: [
        { time: '18:00', title: 'Встреча гостей', desc: 'Приветственный напиток и фотосессия' },
        { time: '19:00', title: 'Торжественный Загс', desc: 'Выездная церемония' },
        { time: '20:00', title: 'Восточный Банкет', desc: 'Национальное шоу, танцы и поздравления' },
        { time: '22:00', title: 'Разрезание Торта', desc: 'Сладкое завершение вечера' },
      ],
      colors: [
        { name: 'Рубиновый Гранат', hex: '#8B0000' },
        { name: 'Восточное Золото', hex: '#D4AF37' },
        { name: 'Темный Бордо', hex: '#4A0E17' },
        { name: 'Шампань Крем', hex: '#F5E6D3' }
      ]
    },
    uz: {
      invitationTitle: 'Тантанали Тўй Таклифномаси',
      welcomeText: 'Сизни бахтли кунимизда, никоҳ тўйимиз шодиёнасида кўришдан бағоят мамнун бўламиз!',
      openEnvelopeBtn: 'Таклифномани очиш',
      ourStoryTitle: 'Севги Тарихи',
      dateAndPlace: 'Сана ва Манзил',
      dateLabel: 'Сана',
      timeLabel: 'Вақт',
      venueLabel: 'Тўйхона',
      addressLabel: 'Манзил',
      openMap: 'Харитада очиш',
      countdownTitle: 'Тўйгача қолган вақт',
      days: 'кун',
      hours: 'соат',
      minutes: 'дақиқа',
      seconds: 'сония',
      passed: 'Тўй бошланди!',
      programTitle: 'Оқшом Дастури',
      dressCodeTitle: 'Либос Ранг Палитраси',
      dressCodeSubtitle: 'Тўйимиз учун қуйидаги рангларда либос танласангиз хурсанд бўламиз:',
      galleryTitle: 'Расмлар Галереяси',
      gallerySubtitle: 'Энг ширин хотираларимиз',
      addPhotoBtn: 'Расм қўшиш',
      addPhotoPlaceholder: 'Расм ҳаволаси...',
      rsvpTitle: 'Ташрифни Тасдиқлаш',
      rsvpSubtitle: 'Илтимос, ташрифингизни олдиндан тасдиқланг',
      yourName: 'Исмингиз',
      willAttend: 'Кела оласизми?',
      yes: 'Ҳа, албатта!',
      no: 'Афсус, кела олмайман',
      wishesPlaceholder: 'Ёшларга эзгу тилакларингиз...',
      sendRsvp: 'Жавобни юбориш',
      sending: 'Юборилмоқда...',
      thankYouRsvp: 'Жавобингиз учун раҳмат!',
      giftTitle: 'Совғалар',
      giftSubtitle: 'Сизнинг ташрифингиз — биз учун энг катта совға!',
      copyCard: 'Карта рақамини олиш',
      copiedText: 'Нусхаланди!',
      cardOwner: 'Эгаси',
      sectionsManager: 'Сайт бўлимлари',
      restoreAll: 'Барча яширилган бўлимларни кўрсатиш',
      hideSectionHint: 'Бўлимни ўчириш',
      scheduleItems: [
        { time: '18:00', title: 'Меҳмонларни кутиб олиш', desc: 'Ичимликлар ва фотозона' },
        { time: '19:00', title: 'Никоҳ Маросими', desc: 'Тантанали никоҳ' },
        { time: '20:00', title: 'Байрам Оши ва Банкет', desc: 'Миллий шоу ва рақслар' },
        { time: '22:00', title: 'Тўй Торти', desc: 'Тантанали ширинлик' },
      ],
      colors: [
        { name: 'Анор Қизили', hex: '#8B0000' },
        { name: 'Шоҳона Олтин', hex: '#D4AF37' },
        { name: 'Тўқ Бордо', hex: '#4A0E17' },
        { name: 'Крем', hex: '#F5E6D3' }
      ]
    },
    en: {
      invitationTitle: 'Oriental Wedding Invitation',
      welcomeText: 'With love and joy, we invite you to celebrate the union of our hearts!',
      openEnvelopeBtn: 'Open Invitation',
      ourStoryTitle: 'Love Story',
      dateAndPlace: 'Date & Location',
      dateLabel: 'Date',
      timeLabel: 'Time',
      venueLabel: 'Grand Hall',
      addressLabel: 'Address',
      openMap: 'Open Map',
      countdownTitle: 'Countdown to Ceremony',
      days: 'days',
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
      passed: 'Wedding has started!',
      programTitle: 'Evening Program',
      dressCodeTitle: 'Dress Code & Palette',
      dressCodeSubtitle: 'We kindly invite guests to follow our color scheme:',
      galleryTitle: 'Photo Gallery',
      gallerySubtitle: 'Precious moments together',
      addPhotoBtn: 'Add Photo',
      addPhotoPlaceholder: 'Photo URL...',
      rsvpTitle: 'RSVP Confirmation',
      rsvpSubtitle: 'Please kindly confirm your attendance',
      yourName: 'Your Name',
      willAttend: 'Will you attend?',
      yes: 'Yes, I will be there!',
      no: 'Regretfully no',
      wishesPlaceholder: 'Your warm wishes...',
      sendRsvp: 'Send RSVP',
      sending: 'Sending...',
      thankYouRsvp: 'Thank you for your response!',
      giftTitle: 'Gifts & Wishes',
      giftSubtitle: 'Your presence is our best gift!',
      copyCard: 'Copy Card',
      copiedText: 'Copied!',
      cardOwner: 'Card Holder',
      sectionsManager: 'Manage Sections',
      restoreAll: 'Show All Hidden Sections',
      hideSectionHint: 'Remove section',
      scheduleItems: [
        { time: '18:00', title: 'Guest Gathering', desc: 'Welcome drinks & photo session' },
        { time: '19:00', title: 'Solemn Ceremony', desc: 'Wedding vows' },
        { time: '20:00', title: 'Festive Banquet', desc: 'National show & dance performance' },
        { time: '22:00', title: 'Cake Cutting', desc: 'Sweet conclusion' },
      ],
      colors: [
        { name: 'Ruby Pomegranate', hex: '#8B0000' },
        { name: 'Oriental Gold', hex: '#D4AF37' },
        { name: 'Deep Burgundy', hex: '#4A0E17' },
        { name: 'Champagne Cream', hex: '#F5E6D3' }
      ]
    }
  };

  const t = translations[currentLang] || translations.ru;

  if (!isOpened) {
    return (
      <div className={`${isPreview ? 'h-full min-h-full p-4' : 'min-h-[100dvh] p-6'} w-full bg-stone-950 text-rose-100 flex flex-col items-center justify-center relative overflow-hidden select-none text-center`}>
        <div className="w-full max-w-sm bg-gradient-to-b from-stone-900/95 via-stone-900/90 to-rose-950/95 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-5 sm:gap-6 relative">
          <div className="w-20 h-20 rounded-full bg-stone-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-xl">
            <span className="text-base font-serif font-extrabold tracking-wider text-amber-200 text-center leading-none">
              {groomName.trim().charAt(0).toUpperCase()}♡{brideName.trim().charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-serif font-bold">
            {t.invitationTitle}
          </span>
          <h1 className="text-3xl font-serif font-bold text-amber-100">
            {groomName} <span className="text-amber-400 font-light">&</span> {brideName}
          </h1>
          <p className="text-xs text-rose-200/70 font-serif italic">
            "{t.welcomeText}"
          </p>
          <button
            onClick={onOpenEnvelope}
            className="w-full py-3.5 bg-gradient-to-r from-rose-700 via-amber-600 to-rose-700 text-white font-bold rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 active:scale-95 transition-all mt-2 cursor-pointer"
          >
            {t.openEnvelopeBtn}
          </button>
        </div>
      </div>
    );
  }

  const containerClasses = isPreview
    ? 'w-full h-full overflow-y-auto bg-stone-950 text-rose-100 p-4 font-sans select-none scrollbar-thin relative'
    : 'min-h-[100dvh] bg-stone-950 text-rose-100 py-6 px-4 font-sans flex flex-col items-center select-none relative snap-y snap-mandatory overflow-x-hidden';

  const innerClasses = isPreview
    ? 'w-full flex flex-col gap-6 items-center text-center max-w-md mx-auto relative z-20'
    : 'w-full max-w-md flex flex-col gap-8 items-center text-center relative z-20';

  const sectionWrapperClass = "w-full min-h-[100dvh] md:min-h-0 flex flex-col items-center justify-center py-6 px-1 snap-start relative";

  return (
    <div className={containerClasses}>
      {/* Smooth Scroll Progress Laser Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 origin-left z-50 shadow-[0_0_10px_#f59e0b]"
        style={{ scaleX: smoothProgress }}
      />

      {/* FLOATING CONTROLS */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none max-w-md mx-auto">
        <div className="pointer-events-auto flex items-center gap-1 bg-stone-950/90 border border-amber-500/40 p-1 rounded-full shadow-2xl backdrop-blur-md">
          <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
          {(['ru', 'uz', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => changeLanguage(l)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                currentLang === l
                  ? 'bg-gradient-to-r from-rose-700 to-amber-600 text-white shadow-md'
                  : 'text-rose-200/70 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {isPreview && (
            <button
              onClick={() => setShowSectionManager(!showSectionManager)}
              title={t.sectionsManager}
              className="w-10 h-10 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-stone-900 transition-all relative"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              {hiddenSections.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {hiddenSections.length}
                </span>
              )}
            </button>
          )}

          {!isPreview && onToggleAudio && (
            <button
              onClick={onToggleAudio}
              className="w-10 h-10 rounded-full bg-stone-950/90 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-stone-900 transition-all"
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

      {/* SECTION MANAGER MODAL */}
      <AnimatePresence>
        {isPreview && showSectionManager && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 left-4 max-w-sm mx-auto z-50 bg-stone-950/95 border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-rose-100 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
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

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'hero', name: 'Главная карточка' },
                { id: 'photo', name: 'Главное фото' },
                { id: 'video', name: 'Видео-ролик' },
                { id: 'loveStory', name: 'История любви' },
                { id: 'dateVenue', name: 'Дата и Место' },
                { id: 'countdown', name: 'Таймер отсчета' },
                { id: 'schedule', name: 'Программа вечера' },
                { id: 'gallery', name: 'Фотогалерея' },
                { id: 'dressCode', name: 'Дресс-код' },
                { id: 'rsvp', name: 'Анкета RSVP' },
                { id: 'giftCard', name: 'Подарки и карта' },
                { id: 'phone', name: 'Контакты' },
              ].map(sec => (
                <button
                  key={sec.id}
                  onClick={() => toggleHideSection(sec.id)}
                  className={`py-1.5 px-2.5 rounded-xl text-[11px] font-semibold border flex items-center justify-between transition-all ${
                    isSectionVisible(sec.id)
                      ? 'bg-rose-950/80 border-amber-500/60 text-amber-200'
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
                className="mt-1 w-full py-2 bg-gradient-to-r from-rose-700 to-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                {t.restoreAll}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={innerClasses}>

        {/* HERO CARD */}
        {isSectionVisible('hero') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="w-full bg-gradient-to-b from-stone-900/95 via-stone-900/90 to-rose-950/95 border-2 border-amber-500/40 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(139,0,0,0.3)] relative overflow-hidden backdrop-blur-xl flex flex-col items-center gap-6"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('hero')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-950/60 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="w-20 h-20 rounded-full bg-stone-950 border-2 border-amber-400/80 flex items-center justify-center text-amber-400 shadow-2xl relative">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-serif font-bold">
                  {t.invitationTitle}
                </span>

                <div className="flex flex-col items-center gap-1 my-2">
                  <h1 className="text-4xl font-serif font-extrabold text-amber-100 tracking-wide">
                    {groomName}
                  </h1>
                  <span className="text-amber-400 font-serif text-xl italic my-1">&</span>
                  <h1 className="text-4xl font-serif font-extrabold text-amber-100 tracking-wide">
                    {brideName}
                  </h1>
                </div>

                <p className="text-xs text-rose-200/80 font-serif italic max-w-xs leading-relaxed">
                  "{t.welcomeText}"
                </p>
              </div>

              <div className="w-full pt-4 border-t border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{time}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* HERO PHOTO */}
        {isSectionVisible('photo') && heroPhoto && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/90 border border-amber-500/30 rounded-3xl p-3 shadow-2xl relative overflow-hidden backdrop-blur-xl"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('photo')}
                  title={t.hideSectionHint}
                  className="absolute top-5 right-5 z-30 w-7 h-7 rounded-full bg-stone-950/60 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="w-full h-80 rounded-2xl overflow-hidden relative border border-amber-500/20">
                <img src={getMediaUrl(heroPhoto)} alt={`${groomName} & ${brideName}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent flex flex-col justify-end p-4 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">{groomName} & {brideName}</span>
                  <p className="text-xs font-serif italic text-rose-200">{formattedDate}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* VIDEO SECTION */}
        {isSectionVisible('video') && data.videoUrl && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col items-center gap-4 text-center"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('video')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-950/60 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold font-serif">
                Видео-приглашение
              </span>

              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-amber-500/30 bg-black relative shadow-lg">
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

        {/* LOVE STORY */}
        {isSectionVisible('loveStory') && loveStory && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/90 border border-amber-500/25 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-3 relative backdrop-blur-xl overflow-hidden text-center"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('loveStory')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-950/60 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Heart className="w-5 h-5 text-amber-400 fill-rose-500/20" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400/90 font-bold">{t.ourStoryTitle}</span>
              <p className="text-xs text-rose-100/90 italic font-serif leading-relaxed px-2">
                "{loveStory}"
              </p>
            </motion.div>
          </div>
        )}

        {/* DATE & LOCATION */}
        {isSectionVisible('dateVenue') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/90 border border-amber-500/25 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 relative backdrop-blur-xl overflow-hidden text-center"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('dateVenue')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-950/60 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">{t.dateAndPlace}</span>
                <h3 className="text-xl font-serif font-bold text-amber-100 mt-1">{venue}</h3>
                <p className="text-xs text-stone-400">{address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-amber-500/20 text-xs">
                <div className="flex flex-col items-center gap-1 p-2 bg-stone-950/50 rounded-xl border border-amber-500/20">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-200 capitalize">{formattedDate}</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-stone-950/50 rounded-xl border border-amber-500/20">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-200">{time}</span>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${venue} ${address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-gradient-to-r from-rose-800 to-amber-700 hover:from-rose-700 hover:to-amber-600 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Navigation className="w-4 h-4" />
                {t.openMap}
              </a>
            </motion.div>
          </div>
        )}

        {/* COUNTDOWN */}
        {isSectionVisible('countdown') && timeLeft && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 relative backdrop-blur-xl overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('countdown')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-950/60 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">{t.countdownTitle}</span>

              {currentDifference.isPassed ? (
                <p className="text-base font-bold text-amber-400">{t.passed}</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 w-full">
                  {[
                    { label: t.days, val: currentDifference.days },
                    { label: t.hours, val: currentDifference.hours },
                    { label: t.minutes, val: currentDifference.minutes },
                    { label: t.seconds, val: currentDifference.seconds },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-stone-950/80 border border-amber-500/30 rounded-2xl p-2 flex flex-col items-center">
                      <span className="text-xl font-bold text-amber-400 font-mono">{item.val}</span>
                      <span className="text-[8px] uppercase text-stone-400 mt-0.5">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* PROGRAM */}
        {isSectionVisible('schedule') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/90 border border-amber-500/25 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-5 relative backdrop-blur-xl overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('schedule')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-950/60 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">{t.programTitle}</span>

              <div className="w-full flex flex-col gap-4 text-left relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[1px] before:bg-amber-500/30">
                {t.scheduleItems.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-stone-950 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0 shadow-md">
                      {item.time}
                    </div>
                    <div className="flex flex-col pt-0.5">
                      <h4 className="text-xs font-bold text-amber-100">{item.title}</h4>
                      <p className="text-[11px] text-stone-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* PHOTO GALLERY */}
        {isSectionVisible('gallery') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/90 border border-amber-500/25 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 relative backdrop-blur-xl overflow-hidden text-center"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('gallery')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-950/60 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">{t.galleryTitle}</span>

              <div className="grid grid-cols-2 gap-2.5 w-full mt-1">
                {photos.map((url, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveModalPhoto(getMediaUrl(url))}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-amber-500/20 group cursor-pointer"
                  >
                    <img src={getMediaUrl(url)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-400">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {activeModalPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalPhoto(null)}
              className="fixed inset-0 z-50 bg-stone-950/90 flex items-center justify-center p-4 backdrop-blur-md"
            >
              <div className="relative max-w-lg w-full max-h-[85vh] rounded-2xl overflow-hidden border-2 border-amber-500/80">
                <img src={getMediaUrl(activeModalPhoto)} alt="Modal view" className="w-full h-full object-contain bg-black" />
                <button 
                  onClick={() => setActiveModalPhoto(null)} 
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DRESS CODE */}
        {isSectionVisible('dressCode') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/90 border border-amber-500/25 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 relative backdrop-blur-xl overflow-hidden text-center"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('dressCode')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-950/60 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">{t.dressCodeTitle}</span>
              <p className="text-[11px] text-stone-400">{t.dressCodeSubtitle}</p>

              <div className="grid grid-cols-4 gap-2.5 w-full mt-1">
                {t.colors.map((c: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPalette(c.name)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all ${
                      selectedPalette === c.name ? 'border-amber-400 bg-stone-950' : 'border-amber-500/20 bg-stone-950/40'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                    <span className="text-[9px] text-stone-300 leading-tight text-center">{c.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* RSVP FORM */}
        {isSectionVisible('rsvp') && rsvpState && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-left relative backdrop-blur-xl overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('rsvp')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-950/60 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="text-center flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">{t.rsvpTitle}</span>
                <p className="text-[11px] text-stone-400">{t.rsvpSubtitle}</p>
              </div>

              {rsvpState.isSuccess ? (
                <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 text-center text-xs font-bold text-emerald-300">
                  {t.thankYouRsvp}
                </div>
              ) : (
                <form onSubmit={rsvpState.onSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-stone-400 block mb-1">{t.yourName}</label>
                    <input
                      type="text"
                      required
                      value={rsvpState.name}
                      onChange={(e) => rsvpState.setName(e.target.value)}
                      className="w-full bg-stone-950 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-rose-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-stone-400 block mb-1">{t.willAttend}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => rsvpState.setAttending(true)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                          rsvpState.attending === true ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200' : 'bg-stone-950 border-stone-800 text-stone-400'
                        }`}
                      >
                        {t.yes}
                      </button>
                      <button
                        type="button"
                        onClick={() => rsvpState.setAttending(false)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                          rsvpState.attending === false ? 'bg-rose-900/60 border-rose-500 text-rose-200' : 'bg-stone-950 border-stone-800 text-stone-400'
                        }`}
                      >
                        {t.no}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-stone-400 block mb-1">{t.wishesPlaceholder}</label>
                    <textarea
                      rows={3}
                      value={rsvpState.wishes}
                      onChange={(e) => rsvpState.setWishes(e.target.value)}
                      className="w-full bg-stone-950 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-rose-100 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rsvpState.isSubmitting || rsvpState.attending === null}
                    className="w-full py-3 bg-gradient-to-r from-rose-800 to-amber-700 font-bold rounded-xl text-xs text-white shadow-lg disabled:opacity-50"
                  >
                    {rsvpState.isSubmitting ? t.sending : t.sendRsvp}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {/* GIFT CARD */}
        {isSectionVisible('giftCard') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/90 border border-amber-500/25 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center relative backdrop-blur-xl overflow-hidden"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('giftCard')}
                  title={t.hideSectionHint}
                  className="absolute top-4 right-4 z-30 w-7 h-7 rounded-full bg-stone-950/60 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">{t.giftTitle}</span>
              <p className="text-[11px] text-stone-400">{t.giftSubtitle}</p>

              <div className="w-full bg-stone-950 border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center gap-2">
                <span className="text-sm font-mono font-bold text-amber-400">{giftCardNumber}</span>
                <span className="text-[10px] text-stone-400">{t.cardOwner}: {giftCardOwner}</span>
                
                <button
                  onClick={copyGiftCard}
                  className="mt-1 py-2 px-4 bg-stone-900 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-300 flex items-center gap-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t.copiedText : t.copyCard}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* FOOTER */}
        <div className="text-[10px] uppercase tracking-[0.3em] text-amber-500/50 font-serif pt-4 pb-8 select-none">
          {groomName} & {brideName} • 2026
        </div>

      </div>
    </div>
  );
};
