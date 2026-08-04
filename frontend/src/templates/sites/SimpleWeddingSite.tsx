import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, VolumeX,
  Copy, Check, Navigation,
  X, Globe, Upload, SlidersHorizontal, Eye
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
  onLanguageChange
}) => {
  const isBirthday = visualVariant === 'birthday';
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
  const defaultPhoto = data.photoUrl ? getMediaUrl(data.photoUrl) : 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop';
  const defaultGallery = data.photos && data.photos.length > 0 
    ? data.photos.map(p => getMediaUrl(p))
    : [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop',
      ];

  const [heroPhoto, setHeroPhoto] = useState<string>(defaultPhoto);
  const [photos, setPhotos] = useState<string[]>(defaultGallery);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [activeModalPhoto, setActiveModalPhoto] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const groomName = data.groomName || 'Даврон';
  const brideName = data.brideName || 'Севинч';
  const date = data.date || '2026-10-10';
  const time = data.time || '17:30';
  const venue = data.venue || 'Versal Saroyi';
  const address = data.address || 'г. Ташкент, Яккасарайский район, ул. Бобура, 45';
  const loveStory = data.loveStory;
  const giftCardNumber = data.giftCardNumber || '8600 1200 4490 1102';

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
      invitationTitle: 'Приглашение на Свадьбу',
      welcomeText: 'Приглашаем вас разделять радость нашего торжества!',
      ourStoryTitle: 'Наша История',
      dateAndPlace: 'Дата и Место',
      dateLabel: 'Дата',
      timeLabel: 'Время',
      venueLabel: 'Ресторан',
      openMap: 'Посмотреть на карте',
      countdownTitle: 'До события осталось',
      days: 'дней',
      hours: 'часов',
      minutes: 'минут',
      seconds: 'секунд',
      passed: 'Событие началось!',
      galleryTitle: 'Галерея',
      addPhotoBtn: 'Добавить',
      addPhotoPlaceholder: 'Ссылка на фото...',
      rsvpTitle: 'Подтверждение',
      yourName: 'Ваше имя',
      willAttend: 'Вы прийдете?',
      yes: 'Да',
      no: 'Нет',
      wishesPlaceholder: 'Ваши пожелания...',
      sendRsvp: 'Отправить',
      sending: 'Отправка...',
      thankYouRsvp: 'Спасибо за ваш ответ!',
      giftTitle: 'Подарки',
      giftSubtitle: 'Ваше присутствие — главный подарок!',
      copyCard: 'Скопировать карту',
      copiedText: 'Скопировано!',
      cardOwner: 'Получатель',
      sectionsManager: 'Разделы сайта',
      restoreAll: 'Показать все скрытые блоки',
      hideSectionHint: 'Убрать раздел',
    },
    uz: {
      invitationTitle: 'Тўй Таклифномаси',
      welcomeText: 'Сизни тўй тантанамизда кутиб қоламиз!',
      ourStoryTitle: 'Бизнинг Тарих',
      dateAndPlace: 'Сана ва Манзил',
      dateLabel: 'Сана',
      timeLabel: 'Вақт',
      venueLabel: 'Ресторан',
      openMap: 'Харитада кўриш',
      countdownTitle: 'Тўйгача қолди',
      days: 'кун',
      hours: 'соат',
      minutes: 'дақиқа',
      seconds: 'сония',
      passed: 'Тўй бошланди!',
      galleryTitle: 'Галерея',
      addPhotoBtn: 'Қўшиш',
      addPhotoPlaceholder: 'Расм ҳаволаси...',
      rsvpTitle: 'Ташрифни тасдиқлаш',
      yourName: 'Исмингиз',
      willAttend: 'Кела оласизми?',
      yes: 'Ҳа',
      no: 'Йўқ',
      wishesPlaceholder: 'Тилакларингиз...',
      sendRsvp: 'Юбориш',
      sending: 'Юборилмоқда...',
      thankYouRsvp: 'Раҳмат!',
      giftTitle: 'Совғалар',
      giftSubtitle: 'Сизнинг ташрифингиз — энг катта совға!',
      copyCard: 'Картани кўчириш',
      copiedText: 'Нусхаланди!',
      cardOwner: 'Эгаси',
      sectionsManager: 'Сайт бўлимлари',
      restoreAll: 'Барча яширилган бўлимларни кўрсатиш',
      hideSectionHint: 'Бўлимни ўчириш',
    },
    en: {
      invitationTitle: 'Wedding Invitation',
      welcomeText: 'Join us in celebrating our special day!',
      ourStoryTitle: 'Our Story',
      dateAndPlace: 'Date & Location',
      dateLabel: 'Date',
      timeLabel: 'Time',
      venueLabel: 'Venue',
      openMap: 'Open Map',
      countdownTitle: 'Countdown',
      days: 'days',
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
      passed: 'Event Started!',
      galleryTitle: 'Gallery',
      addPhotoBtn: 'Add',
      addPhotoPlaceholder: 'Photo Link...',
      rsvpTitle: 'RSVP',
      yourName: 'Your Name',
      willAttend: 'Will you attend?',
      yes: 'Yes',
      no: 'No',
      wishesPlaceholder: 'Your wishes...',
      sendRsvp: 'Submit',
      sending: 'Sending...',
      thankYouRsvp: 'Thank you!',
      giftTitle: 'Gifts',
      giftSubtitle: 'Your presence is our present!',
      copyCard: 'Copy Card',
      copiedText: 'Copied!',
      cardOwner: 'Card Holder',
      sectionsManager: 'Manage Sections',
      restoreAll: 'Show All Hidden Sections',
      hideSectionHint: 'Remove section',
    }
  };

  const t = translations[currentLang] || translations.ru;

  if (!isOpened) {
    return (
      <div className={`${isPreview ? 'h-full min-h-full p-4' : 'min-h-[100dvh] p-6'} ${
        isBirthday
          ? 'bg-[radial-gradient(circle_at_top,#312e81_0%,#1e1b4b_40%,#09090b_100%)] text-fuchsia-50'
          : 'bg-stone-950 text-amber-50'
      } w-full flex flex-col items-center justify-center relative overflow-hidden select-none text-center`}>
        <div className={`w-full max-w-sm border-2 p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-5 sm:gap-6 relative overflow-hidden ${
          isBirthday
            ? 'bg-gradient-to-b from-indigo-950/95 via-violet-950/95 to-fuchsia-950/90 border-violet-400/60 rounded-[2rem] shadow-fuchsia-950/40'
            : 'bg-stone-900/90 border-amber-400/50 rounded-3xl'
        }`}>
          {isBirthday && (
            <>
              <span className="absolute top-4 left-5 text-fuchsia-300/60 text-lg">✦</span>
              <span className="absolute bottom-4 right-5 text-violet-300/50 text-sm">✦</span>
            </>
          )}
          <div className={`w-16 h-16 border flex items-center justify-center shadow-xl ${
            isBirthday
              ? 'rounded-2xl rotate-3 bg-fuchsia-500/15 border-fuchsia-300/70 text-fuchsia-300 shadow-fuchsia-500/10'
              : 'rounded-full bg-amber-500/10 border-amber-400 text-amber-400'
          }`}>
            <span className={`text-sm font-serif font-extrabold tracking-wider text-center leading-none ${isBirthday ? 'text-fuchsia-200' : 'text-amber-200'}`}>
              {groomName.trim().charAt(0).toUpperCase()}♡{brideName.trim().charAt(0).toUpperCase()}
            </span>
          </div>
          <span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${isBirthday ? 'text-fuchsia-300' : 'text-amber-400'}`}>
            {isBirthday ? 'Приглашение на день рождения' : (t.invitationTitle || 'Торжественное Приглашение')}
          </span>
          <h1 className={`text-3xl font-serif font-bold ${isBirthday ? 'text-white' : 'text-amber-100'}`}>
            {groomName} <span className={`${isBirthday ? 'text-fuchsia-300' : 'text-amber-400'} font-light`}>&</span> {brideName}
          </h1>
          <button
            onClick={onOpenEnvelope}
            className={`w-full py-3.5 font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all mt-2 cursor-pointer ${
              isBirthday
                ? 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 hover:brightness-110 text-white rounded-xl shadow-fuchsia-500/20'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl'
            }`}
          >
            {isBirthday ? 'Открыть праздник' : (t.openEnvelopeBtn || 'Открыть Приглашение')}
          </button>
        </div>
      </div>
    );
  }

  const containerClasses = isPreview
    ? 'w-full h-full overflow-y-auto bg-stone-950 text-stone-100 p-4 font-sans select-none scrollbar-thin relative'
    : 'min-h-[100dvh] bg-stone-950 text-stone-100 py-6 px-4 font-sans flex flex-col items-center select-none relative snap-y snap-mandatory overflow-x-hidden';

  const innerClasses = isPreview
    ? 'w-full flex flex-col gap-6 items-center text-center max-w-md mx-auto relative z-20'
    : 'w-full max-w-md flex flex-col gap-8 items-center text-center relative z-20';

  const sectionWrapperClass = "w-full min-h-[100dvh] md:min-h-0 flex flex-col items-center justify-center py-6 px-1 snap-start relative";

  return (
    <div className={containerClasses}>

      {/* FLOATING CONTROLS */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none max-w-md mx-auto">
        <div className="pointer-events-auto flex items-center gap-1 bg-stone-900/90 border border-stone-800 p-1 rounded-full shadow-2xl backdrop-blur-md">
          <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
          {(['ru', 'uz', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => changeLanguage(l)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                currentLang === l
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
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
              className="w-10 h-10 rounded-full bg-stone-900/90 border border-stone-800 text-amber-400 flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-stone-800 transition-all relative"
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
              className="w-10 h-10 rounded-full bg-stone-900/90 border border-stone-800 text-amber-400 flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-stone-800 transition-all"
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
            className="fixed top-16 right-4 left-4 max-w-sm mx-auto z-50 bg-stone-950/95 border-2 border-amber-500/70 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-stone-100 flex flex-col gap-3"
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
                { id: 'hero', name: 'Главный блок' },
                { id: 'photo', name: 'Главное фото' },
                { id: 'video', name: 'Видео-ролик' },
                { id: 'loveStory', name: 'История любви' },
                { id: 'dateVenue', name: 'Дата и Место' },
                { id: 'countdown', name: 'Таймер отсчета' },
                { id: 'gallery', name: 'Фотогалерея' },
                { id: 'rsvp', name: 'Анкета RSVP' },
                { id: 'giftCard', name: 'Подарки и карта' },
                { id: 'phone', name: 'Контакты' },
              ].map(sec => (
                <button
                  key={sec.id}
                  onClick={() => toggleHideSection(sec.id)}
                  className={`py-1.5 px-2.5 rounded-xl text-[11px] font-semibold border flex items-center justify-between transition-all ${
                    isSectionVisible(sec.id)
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-200'
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
                className="mt-1 w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-stone-900/90 border border-stone-800 rounded-3xl p-8 shadow-xl relative overflow-hidden backdrop-blur-xl flex flex-col items-center gap-6"
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

              <div className="w-16 h-16 rounded-full bg-stone-950 border border-amber-400/50 flex items-center justify-center text-amber-400">
                <Heart className="w-7 h-7 text-amber-400 fill-amber-400/20" />
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">{t.invitationTitle}</span>
                <h1 className="text-3xl font-serif font-bold text-stone-100">{groomName} & {brideName}</h1>
                <p className="text-xs text-stone-400 italic max-w-xs leading-relaxed">"{t.welcomeText}"</p>
              </div>

              <div className="w-full pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-300">
                <span>{formattedDate}</span>
                <span>{time}</span>
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
              className="w-full bg-stone-900/90 border border-stone-800 rounded-3xl p-3 shadow-xl relative overflow-hidden backdrop-blur-xl group"
            >
              {isPreview && (
                <button
                  onClick={() => toggleHideSection('photo')}
                  title={t.hideSectionHint}
                  className="absolute top-5 right-5 z-30 w-7 h-7 rounded-full bg-stone-950/70 hover:bg-rose-600 text-stone-200 border border-white/20 flex items-center justify-center transition-all shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="w-full h-80 rounded-2xl overflow-hidden relative border border-stone-800">
                <img src={getMediaUrl(heroPhoto)} alt={`${groomName} & ${brideName}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent flex flex-col justify-end p-4 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">{groomName} & {brideName}</span>
                  <p className="text-xs font-serif italic text-stone-300">{formattedDate}</p>
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
              className="w-full bg-stone-900/90 border border-amber-500/20 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col items-center gap-3 text-center"
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

              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                Видео-приглашение
              </span>

              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-stone-800 bg-black relative">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col items-center gap-2 relative overflow-hidden text-center"
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

              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">{t.ourStoryTitle}</span>
              <p className="text-xs text-stone-300 italic">"{loveStory}"</p>
            </motion.div>
          </div>
        )}

        {/* DATE & VENUE */}
        {isSectionVisible('dateVenue') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4 relative overflow-hidden text-center"
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
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">{t.dateAndPlace}</span>
                <h3 className="text-lg font-bold text-stone-100">{venue}</h3>
                <p className="text-xs text-stone-400">{address}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-y border-stone-800 py-2">
                <span>{formattedDate}</span>
                <span>{time}</span>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${venue} ${address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col items-center gap-3 relative overflow-hidden"
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

              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">{t.countdownTitle}</span>

              {currentDifference.isPassed ? (
                <p className="text-sm font-bold text-amber-400">{t.passed}</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 w-full">
                  {[
                    { label: t.days, val: currentDifference.days },
                    { label: t.hours, val: currentDifference.hours },
                    { label: t.minutes, val: currentDifference.minutes },
                    { label: t.seconds, val: currentDifference.seconds },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-stone-950 rounded-xl p-2 flex flex-col items-center">
                      <span className="text-lg font-bold text-amber-400 font-mono">{item.val}</span>
                      <span className="text-[8px] uppercase text-stone-500 mt-0.5">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* GALLERY */}
        {isSectionVisible('gallery') && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col items-center gap-3 relative overflow-hidden text-center"
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

              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">{t.galleryTitle}</span>

              <div className="grid grid-cols-2 gap-2 w-full">
                {photos.map((url, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveModalPhoto(getMediaUrl(url))}
                    className="relative aspect-square rounded-xl overflow-hidden border border-stone-800 cursor-pointer"
                  >
                    <img src={getMediaUrl(url)} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {isPreview && (
                <div className="w-full border-t border-stone-800 pt-3 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder={t.addPhotoPlaceholder}
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-100 outline-none"
                    />
                    <button onClick={handleAddPhoto} className="px-3 py-1.5 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl">
                      +
                    </button>
                  </div>
                  <label className="cursor-pointer py-1.5 px-3 bg-stone-950 border border-stone-800 rounded-xl text-[11px] text-amber-400 font-bold flex items-center justify-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Загрузить фото</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}
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
              <div className="relative max-w-lg w-full max-h-[85vh] rounded-2xl overflow-hidden border border-stone-800">
                <img src={getMediaUrl(activeModalPhoto)} alt="Modal view" className="w-full h-full object-contain bg-black" />
                <button 
                  onClick={() => setActiveModalPhoto(null)} 
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900 text-stone-200 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RSVP FORM */}
        {isSectionVisible('rsvp') && rsvpState && (
          <div className={sectionWrapperClass}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col gap-3 text-left relative overflow-hidden"
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

              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold text-center block">{t.rsvpTitle}</span>

              {rsvpState.isSuccess ? (
                <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3 text-center text-xs font-bold text-emerald-300">
                  {t.thankYouRsvp}
                </div>
              ) : (
                <form onSubmit={rsvpState.onSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    required
                    placeholder={t.yourName}
                    value={rsvpState.name}
                    onChange={(e) => rsvpState.setName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  />

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

                  <textarea
                    rows={2}
                    placeholder={t.wishesPlaceholder}
                    value={rsvpState.wishes}
                    onChange={(e) => rsvpState.setWishes(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  />

                  <button
                    type="submit"
                    disabled={rsvpState.isSubmitting || rsvpState.attending === null}
                    className="w-full py-2.5 bg-amber-500 font-bold rounded-xl text-xs text-stone-950 shadow-lg disabled:opacity-50"
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col items-center gap-3 text-center relative overflow-hidden"
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

              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">{t.giftTitle}</span>

              <div className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 flex flex-col items-center gap-2">
                <span className="text-sm font-mono font-bold text-amber-400">{giftCardNumber}</span>
                <button
                  onClick={copyGiftCard}
                  className="py-1.5 px-3 bg-stone-900 border border-stone-700 rounded-lg text-xs font-bold text-stone-300 flex items-center gap-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t.copiedText : t.copyCard}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* FOOTER */}
        <div className="text-[10px] uppercase tracking-widest text-stone-600 font-serif pt-4 pb-8 select-none">
          {groomName} & {brideName} • 2026
        </div>

      </div>
    </div>
  );
};
