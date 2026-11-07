import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, VolumeX, Volume2,
  Send, Copy, Check, Gift,
  X, Eye, Play, MapPin, User, Users,
  CheckCircle2, MessageSquare, SlidersHorizontal, Globe,
  Maximize2
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

// =========================================================================
// 1. PALETTES DEFINITION & CSS VARIABLES ENGINE
// =========================================================================
export interface HilalPalette {
  name: string;
  bg: string;
  panel: string;
  panelSoft: string;
  paper: string;
  ink: string;
  text: string;
  muted: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  border: string;
  borderStrong: string;
  glow: string;
  burstColor: string;
  particles: [string, string, string];
}

export const HILAL_PALETTES: Record<string, HilalPalette> = {
  default: {
    name: 'Emerald & Gold',
    bg: '#08140D',
    panel: '#0E2016',
    panelSoft: '#142A1E',
    paper: '#0F2116',
    ink: '#F5F8F5',
    text: '#F5F8F6',
    muted: '#B0C2B5',
    accent: '#D4AF37', // Authentic Islamic gold (46° hue, not orange/yellow)
    accentLight: '#F4E3B2',
    accentDark: '#AA7C11',
    border: 'rgba(212, 175, 55, 0.45)',
    borderStrong: 'rgba(212, 175, 55, 0.75)',
    glow: 'rgba(212, 175, 55, 0.22)',
    burstColor: '#D4AF37',
    particles: [
      'radial-gradient(circle, rgba(244,227,178,0.95) 0%, rgba(212,175,55,0) 70%)',
      'radial-gradient(circle, rgba(212,175,55,0.9) 0%, rgba(170,124,17,0) 70%)',
      'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(212,175,55,0) 70%)',
    ],
  },
  emerald: {
    name: 'Emerald & Gold',
    bg: '#08140D',
    panel: '#0E2016',
    panelSoft: '#142A1E',
    paper: '#0F2116',
    ink: '#F5F8F5',
    text: '#F5F8F6',
    muted: '#B0C2B5',
    accent: '#D4AF37',
    accentLight: '#F4E3B2',
    accentDark: '#AA7C11',
    border: 'rgba(212, 175, 55, 0.45)',
    borderStrong: 'rgba(212, 175, 55, 0.75)',
    glow: 'rgba(212, 175, 55, 0.22)',
    burstColor: '#D4AF37',
    particles: [
      'radial-gradient(circle, rgba(244,227,178,0.95) 0%, rgba(212,175,55,0) 70%)',
      'radial-gradient(circle, rgba(212,175,55,0.9) 0%, rgba(170,124,17,0) 70%)',
      'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(212,175,55,0) 70%)',
    ],
  },
  sapphire: {
    name: 'Sapphire & Silver-Blue',
    bg: '#050C18',
    panel: '#0B182F',
    panelSoft: '#112344',
    paper: '#0C1931',
    ink: '#F0F6FF',
    text: '#F0F6FF',
    muted: '#9DB6D6',
    accent: '#7DD3FC',
    accentLight: '#BAE6FD',
    accentDark: '#38BDF8',
    border: 'rgba(125, 211, 252, 0.45)',
    borderStrong: 'rgba(125, 211, 252, 0.75)',
    glow: 'rgba(56, 189, 248, 0.22)',
    burstColor: '#7DD3FC',
    particles: [
      'radial-gradient(circle, rgba(186,230,253,0.95) 0%, rgba(56,189,248,0) 70%)',
      'radial-gradient(circle, rgba(125,211,252,0.9) 0%, rgba(99,102,241,0) 70%)',
      'radial-gradient(circle, rgba(224,231,255,0.85) 0%, rgba(129,140,248,0) 70%)',
    ],
  },
  rose: {
    name: 'Rose & Damson',
    bg: '#180713',
    panel: '#2C0D22',
    panelSoft: '#3E1331',
    paper: '#2A0C21',
    ink: '#FFF1F7',
    text: '#FFF1F7',
    muted: '#D6AABF',
    accent: '#F9A8D4',
    accentLight: '#FCE7F3',
    accentDark: '#EC4899',
    border: 'rgba(249, 168, 212, 0.45)',
    borderStrong: 'rgba(249, 168, 212, 0.75)',
    glow: 'rgba(236, 72, 153, 0.22)',
    burstColor: '#F9A8D4',
    particles: [
      'radial-gradient(circle, rgba(252,231,243,0.95) 0%, rgba(236,72,153,0) 70%)',
      'radial-gradient(circle, rgba(249,168,212,0.9) 0%, rgba(225,29,72,0) 70%)',
      'radial-gradient(circle, rgba(255,241,247,0.85) 0%, rgba(249,168,212,0) 70%)',
    ],
  },
  'champagne-hilal': {
    name: 'Champagne Nude',
    bg: '#16120E',
    panel: '#282019',
    panelSoft: '#3A3026',
    paper: '#271F18',
    ink: '#FAF6F0',
    text: '#FAF6F0',
    muted: '#C7B9A9',
    accent: '#D8C3A5',
    accentLight: '#F4ECE1',
    accentDark: '#B59A78',
    border: 'rgba(216, 195, 165, 0.45)',
    borderStrong: 'rgba(216, 195, 165, 0.75)',
    glow: 'rgba(181, 154, 120, 0.22)',
    burstColor: '#D8C3A5',
    particles: [
      'radial-gradient(circle, rgba(244,236,225,0.95) 0%, rgba(216,195,165,0) 70%)',
      'radial-gradient(circle, rgba(216,195,165,0.9) 0%, rgba(166,108,63,0) 70%)',
      'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(216,195,165,0) 70%)',
    ],
  },
  'dusty-rose-hilal': {
    name: 'Dusty Rose & Peach',
    bg: '#1A0E14',
    panel: '#2B1721',
    panelSoft: '#3C212F',
    paper: '#291620',
    ink: '#FFF5F7',
    text: '#FFF5F7',
    muted: '#C7A8B3',
    accent: '#E2B3BE',
    accentLight: '#F9E4EB',
    accentDark: '#C48B9A',
    border: 'rgba(226, 179, 190, 0.45)',
    borderStrong: 'rgba(226, 179, 190, 0.75)',
    glow: 'rgba(196, 139, 154, 0.22)',
    burstColor: '#E2B3BE',
    particles: [
      'radial-gradient(circle, rgba(249,228,235,0.95) 0%, rgba(226,179,190,0) 70%)',
      'radial-gradient(circle, rgba(226,179,190,0.9) 0%, rgba(196,139,154,0) 70%)',
      'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(226,179,190,0) 70%)',
    ],
  },
  'dusty-blue-hilal': {
    name: 'Dusty Blue & Sage',
    bg: '#0E1520',
    panel: '#1A2536',
    panelSoft: '#25354D',
    paper: '#182435',
    ink: '#F2F6FA',
    text: '#F2F6FA',
    muted: '#A0B0C4',
    accent: '#BAC9DB',
    accentLight: '#E5EDF6',
    accentDark: '#8FA4BD',
    border: 'rgba(186, 201, 219, 0.45)',
    borderStrong: 'rgba(186, 201, 219, 0.75)',
    glow: 'rgba(143, 164, 189, 0.22)',
    burstColor: '#BAC9DB',
    particles: [
      'radial-gradient(circle, rgba(229,237,246,0.95) 0%, rgba(186,201,219,0) 70%)',
      'radial-gradient(circle, rgba(186,201,219,0.9) 0%, rgba(143,164,189,0) 70%)',
      'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(186,201,219,0) 70%)',
    ],
  },
  'navy-hilal': {
    name: 'Midnight Navy & Silver',
    bg: '#060B14',
    panel: '#0E1A2C',
    panelSoft: '#162740',
    paper: '#0D192B',
    ink: '#F0F5FA',
    text: '#F0F5FA',
    muted: '#9AAEC4',
    accent: '#C5D4E6',
    accentLight: '#E9F0F8',
    accentDark: '#8E9EAF',
    border: 'rgba(197, 212, 230, 0.45)',
    borderStrong: 'rgba(197, 212, 230, 0.75)',
    glow: 'rgba(142, 158, 175, 0.22)',
    burstColor: '#C5D4E6',
    particles: [
      'radial-gradient(circle, rgba(233,240,248,0.95) 0%, rgba(197,212,230,0) 70%)',
      'radial-gradient(circle, rgba(197,212,230,0.9) 0%, rgba(27,38,59,0) 70%)',
      'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(197,212,230,0) 70%)',
    ],
  },
  'burgundy-hilal': {
    name: 'Burgundy & Imperial Gold',
    bg: '#17050D',
    panel: '#290A17',
    panelSoft: '#3D1024',
    paper: '#280916',
    ink: '#FAF4EB',
    text: '#FAF4EB',
    muted: '#C4A3AF',
    accent: '#D4AF37', // True antique gold against burgundy
    accentLight: '#F3E0A0',
    accentDark: '#AA7C11',
    border: 'rgba(212, 175, 55, 0.45)',
    borderStrong: 'rgba(212, 175, 55, 0.75)',
    glow: 'rgba(212, 175, 55, 0.22)',
    burstColor: '#D4AF37',
    particles: [
      'radial-gradient(circle, rgba(243,224,160,0.95) 0%, rgba(212,175,55,0) 70%)',
      'radial-gradient(circle, rgba(212,175,55,0.9) 0%, rgba(107,23,36,0) 70%)',
      'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(212,175,55,0) 70%)',
    ],
  },
};

// =========================================================================
// 2. ISLAMIC VECTOR ORNAMENTS (ARCH, GIRIH, CRESCENT)
// =========================================================================

/**
 * Slender authentic Islamic crescent (Hilal) with internal accent star
 */
export const HilalCrescent: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-6 h-6',
  size = 24,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M14.5 3C9.8 3.5 6 7.3 6 12C6 16.7 9.8 20.5 14.5 21C11.5 19 9.5 15.5 9.5 12C9.5 8.5 11.5 5 14.5 3Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <circle cx="16" cy="7.5" r="1.1" fill="currentColor" />
  </svg>
);

/**
 * Geometric 8-pointed star tessellation pattern (Girih)
 */
export const GirihPattern: React.FC<{ className?: string }> = ({
  className = 'absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]',
}) => {
  const patternId = React.useId().replace(/:/g, '');
  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern
          id={patternId}
          width="56"
          height="56"
          patternUnits="userSpaceOnUse"
        >
          {/* Central 8-pointed star formed by two overlapping concentric squares */}
          <rect
            x="17"
            y="17"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          <rect
            x="17"
            y="17"
            width="22"
            height="22"
            transform="rotate(45 28 28)"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          {/* Corner star segments connecting adjacent tiles */}
          <path
            d="M 0 0 L 14 14 M 56 0 L 42 14 M 0 56 L 14 42 M 56 56 L 42 42"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          <rect
            x="-6"
            y="-6"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          <rect
            x="50"
            y="-6"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          <rect
            x="-6"
            y="50"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          <rect
            x="50"
            y="50"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

/**
 * Islamic pointed arch container with double golden border line and keystone girih ornament
 */
export interface HilalArchProps {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  ornament?: boolean;
}

export const HilalArch: React.FC<HilalArchProps> = ({
  children,
  className = '',
  innerClassName = '',
  ornament = true,
}) => {
  const rawId = React.useId();
  const clipId = `hilal-arch-clip-${rawId.replace(/:/g, '')}`;

  return (
    <div className={`relative ${className}`}>
      {/* SVG Clip Path definition */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="M 0.05 1 L 0.05 0.40 C 0.05 0.22, 0.24 0.05, 0.5 0.02 C 0.76 0.05, 0.95 0.22, 0.95 0.40 L 0.95 1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Clipped content container */}
      <div
        className={`w-full h-full ${innerClassName}`}
        style={{ clipPath: `url(#${clipId})` }}
      >
        {children}
      </div>

      {/* Vector pointed arch stroke overlay with double gold lines and keystone girih medallion */}
      <svg
        viewBox="0 0 300 400"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        aria-hidden="true"
      >
        {/* Outer arch line */}
        <path
          d="M 14 400 L 14 160 C 14 88, 72 20, 150 8 C 228 20, 286 88, 286 160 L 286 400"
          fill="none"
          stroke="var(--hilal-accent)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {/* Inner parallel arch line (double gold line) */}
        <path
          d="M 21 400 L 21 162 C 21 94, 76 28, 150 18 C 224 28, 279 94, 279 162 L 279 400"
          fill="none"
          stroke="var(--hilal-border-strong)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        {/* Keystone girih ornament at arch apex */}
        {ornament && (
          <g transform="translate(150, 18)">
            <rect
              x="-6.5"
              y="-6.5"
              width="13"
              height="13"
              fill="var(--hilal-bg)"
              stroke="var(--hilal-accent)"
              strokeWidth="1.2"
            />
            <rect
              x="-6.5"
              y="-6.5"
              width="13"
              height="13"
              transform="rotate(45)"
              fill="var(--hilal-bg)"
              stroke="var(--hilal-accent)"
              strokeWidth="1.2"
            />
            <circle cx="0" cy="0" r="1.8" fill="var(--hilal-accent)" />
          </g>
        )}
      </svg>
    </div>
  );
};

// =========================================================================
// 3. CALM COVER PARTICLES SYSTEM (MAX 8 PARTICLES, COVER ONLY)
// =========================================================================
const HilalCoverParticles: React.FC<{
  calmMotion: boolean;
  palette: HilalPalette;
}> = ({ calmMotion, palette }) => {
  if (calmMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`hilal-cover-particle-${i}`}
          className="absolute rounded-full"
          style={{
            top: `${15 + ((i * 11) % 70)}%`,
            left: `${10 + ((i * 23) % 80)}%`,
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            background: palette.particles[i % palette.particles.length],
            boxShadow: `0 0 8px ${palette.glow}`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, i % 2 === 0 ? 18 : -18, 0],
            opacity: [0.15, 0.75, 0.15],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4.5 + (i % 4),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
};

// =========================================================================
// 4. GOLDEN TAP BURST EFFECT
// =========================================================================
const GoldBurst: React.FC<{
  active: boolean;
  palette: HilalPalette;
}> = ({ active, palette }) => {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * 360;
        const radius = 60 + Math.random() * 80;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={`gold-burst-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${4 + Math.random() * 4}px`,
              height: `${4 + Math.random() * 4}px`,
              backgroundColor: palette.burstColor,
              boxShadow: `0 0 10px ${palette.burstColor}`,
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

// =========================================================================
// 5. MULTILINGUAL DICTIONARY (UZ with proper U+02BB ʻ, RU, EN)
// =========================================================================
const translations = {
  uz: {
    bismillah: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
    openInvitation: 'TAKLIFNOMANI OCHISH',
    openInvitationSub: 'Taklifnomani ochish uchun muhrni bosing',
    opening: 'OCHILMOQDA...',
    weddingInvitation: 'NIKOH TOʻYI TAKLIFNOMASI',
    weddingTitle: 'NIKOH TOʻYI',
    and: '&',
    quranHeader: "QUR'ONI KARIMDAN OYAT",
    quranArabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    // Aloouddin Mansur semantic translation
    quranTranslation: '«Uning belgilaridan biri — sizlar taskin topishingiz uchun oʻzingizdan juftlar yaratgani va oʻrtangizda muhabbat hamda mehr-shafqat paydo qilganidir.»',
    quranSurah: 'Rum surasi, 21-oyat',
    scheduleTitle: 'KUN TARTIBI',
    scheduleSub: 'Toʻy oqshomi dasturi',
    countdownEyebrow: 'TOʻYGA QADAR',
    countdownTitle: 'SANOQ',
    countdownSub: 'Toʻygacha qolgan vaqt',
    days: 'KUN',
    hours: 'SOAT',
    minutes: 'DAQIQA',
    seconds: 'SONIYA',
    calendarTitle: 'SANA VA VAQT',
    calendarSub: 'Tashrifingizni kutamiz',
    addToCalendar: 'Taqvimga qoʻshish',
    googleCalendar: 'Google Taqvim',
    downloadIcs: 'iCal (.ics) yuklab olish',
    weekdays: ['Dsh', 'Ssh', 'Chsh', 'Psh', 'Jum', 'Shb', 'Yak'],
    galleryTitle: 'SURATLAR VA VIDEOLAR',
    gallerySub: 'Baxtli damlarimizdan lavhalar',
    venueTitle: 'MANZILIMIZ / TOʻYXONA',
    venueSub: 'Tantana oʻtkaziladigan maskan',
    copyAddress: 'Manzilni nusxalash',
    googleMaps: 'Google Maps',
    yandexMaps: 'Yandex Maps',
    duaArabic: 'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    rsvpTitle: 'MAROSIMGA KELASIZMI?',
    rsvpSub: 'Iltimos, tashrifingizni tasdiqlang',
    attendingYes: 'Albatta boraman',
    attendingNo: 'Kela olmayman',
    nameLabel: 'Ismingiz va familiyangiz',
    namePlaceholder: 'Ismingizni kiriting',
    guestsLabel: 'Mehmonlar soni',
    guestsPlaceholder: 'Necha kishi kelasiz?',
    guestsCount: 'kishi',
    wishesLabel: 'Samimiy tilaklaringiz',
    wishesPlaceholder: 'Kelin-kuyovga ezgu niyatlaringiz...',
    submitRsvp: 'Javobni yuborish',
    submitting: 'YUBORILMOQDA...',
    rsvpSuccess: 'TASHRIFINGIZDAN MAMNUNMIZ!',
    rsvpSuccessSub: 'Javobingiz qabul qilindi. Rahmat! ✨',
    giftTitle: 'SOVGʻA UCHUN',
    giftSub: 'Pul koʻrinishidagi sovgʻalar uchun',
    giftCardTitle: 'TOʻY SOVGʻASI KARTASI',
    cardNumber: 'KARTA RAQAMI',
    cardOwner: 'KARTA EGASI',
    copyCard: 'Karta raqamini nusxalash',
    copied: 'Nusxalandi!',
    giftNote: 'Kelin-kuyovga pul koʻrinishida sovgʻa qilmoqchi boʻlsangiz, ushbu karta raqamiga oʻtkazishingiz mumkin.',
    giftCardExampleLabel: 'Namuna karta',
    footerText: 'Bunday taklifnomani siz ham buyurtma bering',
    videoTag: 'VIDEO',
    toggleMusic: 'Musiqani boshqarish',
    changeLang: 'Tilni almashtirish',
    manageSections: 'Sektsiyalarni boshqarish',
    close: 'Yopish',
    sectionNames: {
      hero: 'Asosiy Bosh sahifa (Hero)',
      quran: "Qur'on Oyati & Dua",
      schedule: 'Kun tartibi',
      countdown: 'Sanoq (Countdown)',
      calendar: 'Sana & Kalendar',
      gallery: 'Foto va Video Galereya',
      venue: "To'yxona & Xarita",
      rsvp: 'RSVP (Taklifga javob)',
      gift: "Sovg'a uchun (Karta)",
    },
  },
  ru: {
    bismillah: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
    openInvitation: 'ОТКРЫТЬ ПРИГЛАШЕНИЕ',
    openInvitationSub: 'Нажмите на печать, чтобы открыть приглашение',
    opening: 'ОТКРЫВАЕТСЯ...',
    weddingInvitation: 'СВАДЕБНОЕ ПРИГЛАШЕНИЕ',
    weddingTitle: 'СВАДЕБНОЕ ТОРЖЕСТВО',
    and: '&',
    quranHeader: 'АЯТ ИЗ СВЯЩЕННОГО КОРАНА',
    quranArabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    // Elmir Kuliev semantic translation
    quranTranslation: '«Среди Его знамений — то, что Он сотворил из вас самих жён для вас, чтобы вы находили в них покой, и установил между вами любовь и милосердие.»',
    quranSurah: 'Ар-Рум, 30:21',
    scheduleTitle: 'ПРОГРАММА ВЕЧЕРА',
    scheduleSub: 'Расписание свадебного торжества',
    countdownEyebrow: 'ДО ТОРЖЕСТВА',
    countdownTitle: 'ОТСЧЕТ ВРЕМЕНИ',
    countdownSub: 'Осталось до торжественного дня',
    days: 'ДНЕЙ',
    hours: 'ЧАСОВ',
    minutes: 'МИНУТ',
    seconds: 'СЕКУНД',
    calendarTitle: 'ДАТА И ВРЕМЯ',
    calendarSub: 'Ждем вас с нетерпением',
    addToCalendar: 'Добавить в календарь',
    googleCalendar: 'Google Календарь',
    downloadIcs: 'Скачать .ics (iCal/Outlook)',
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    galleryTitle: 'ГАЛЕРЕЯ ФОТО И ВИДЕО',
    gallerySub: 'Кадры нашей истории',
    venueTitle: 'МЕСТО ПРОВЕДЕНИЯ',
    venueSub: 'Адрес торжественного зала',
    copyAddress: 'Скопировать адрес',
    googleMaps: 'Google Карты',
    yandexMaps: 'Яндекс Карты',
    duaArabic: 'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    rsvpTitle: 'ПОТВЕРЖДЕНИЕ ПРИСУТСТВИЯ',
    rsvpSub: 'Пожалуйста, подтвердите ваше участие',
    attendingYes: 'Я приду',
    attendingNo: 'К сожалению, не смогу',
    nameLabel: 'Ваше имя и фамилия',
    namePlaceholder: 'Введите ваше имя',
    guestsLabel: 'Количество гостей',
    guestsPlaceholder: 'Сколько человек с вами?',
    guestsCount: 'чел.',
    wishesLabel: 'Ваши пожелания',
    wishesPlaceholder: 'Напишите ваши тёплые слова...',
    submitRsvp: 'Отправить ответ',
    submitting: 'ОТПРАВКА...',
    rsvpSuccess: 'МЫ ОЧЕНЬ РАДЫ ВАШЕМУ ОТВЕТУ!',
    rsvpSuccessSub: 'Ваше подтверждение принято. Спасибо! ✨',
    giftTitle: 'ПОДАРОК НА СВАДЬБУ',
    giftSub: 'Для денежных подарков',
    giftCardTitle: 'СВАДЕБНАЯ КАРТА',
    cardNumber: 'НОМЕР КАРТЫ',
    cardOwner: 'ДЕРЖАТЕЛЬ КАРТЫ',
    copyCard: 'Скопировать номер карты',
    copied: 'Скопировано!',
    giftNote: 'Если вы хотите сделать подарок в виде денежного перевода, можете воспользоваться этим номером карты.',
    giftCardExampleLabel: 'Пример карты',
    footerText: 'Создайте такое же красивое приглашение',
    videoTag: 'ВИДЕО',
    toggleMusic: 'Управление музыкой',
    changeLang: 'Сменить язык',
    manageSections: 'Управление секциями',
    close: 'Закрыть',
    sectionNames: {
      hero: 'Главный баннер / Конверт',
      quran: 'Коранический аят / Bismillah',
      schedule: 'Программа вечера',
      countdown: 'Обратный отсчет',
      calendar: 'Дата и время',
      gallery: 'Фотогалерея',
      venue: 'Место проведения',
      rsvp: 'Подтверждение присутствия',
      gift: 'Подарки и карта',
    },
  },
  en: {
    bismillah: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
    openInvitation: 'OPEN INVITATION',
    openInvitationSub: 'Tap the seal to open invitation',
    opening: 'OPENING...',
    weddingInvitation: 'WEDDING INVITATION',
    weddingTitle: 'WEDDING CELEBRATION',
    and: '&',
    quranHeader: 'HOLY QURAN VERSE',
    quranArabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    // Sahih International translation
    quranTranslation: '«And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.»',
    quranSurah: 'Ar-Rum 30:21',
    scheduleTitle: 'WEDDING SCHEDULE',
    scheduleSub: 'Celebration program of the evening',
    countdownEyebrow: 'COUNTDOWN',
    countdownTitle: 'TIME REMAINING',
    countdownSub: 'Until our special day',
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    seconds: 'SECONDS',
    calendarTitle: 'DATE & TIME',
    calendarSub: 'We look forward to seeing you',
    addToCalendar: 'Add to Calendar',
    googleCalendar: 'Google Calendar',
    downloadIcs: 'Download .ics (iCal/Outlook)',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    galleryTitle: 'PHOTO & VIDEO GALLERY',
    gallerySub: 'Moments of our love story',
    venueTitle: 'VENUE LOCATION',
    venueSub: 'Where the ceremony will take place',
    copyAddress: 'Copy Address',
    googleMaps: 'Google Maps',
    yandexMaps: 'Yandex Maps',
    duaArabic: 'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    rsvpTitle: 'WILL YOU ATTEND?',
    rsvpSub: 'Please confirm your attendance',
    attendingYes: 'Yes, I will attend',
    attendingNo: 'Sorry, I cannot attend',
    nameLabel: 'Your Full Name',
    namePlaceholder: 'Enter your name',
    guestsLabel: 'Number of Guests',
    guestsPlaceholder: 'How many guests?',
    guestsCount: 'guest(s)',
    wishesLabel: 'Warm Wishes',
    wishesPlaceholder: 'Leave your wishes for the couple...',
    submitRsvp: 'Send Confirmation',
    submitting: 'SENDING...',
    rsvpSuccess: 'WE ARE DELIGHTED TO HAVE YOU!',
    rsvpSuccessSub: 'Your RSVP response has been received. Thank you! ✨',
    giftTitle: 'WEDDING GIFT',
    giftSub: 'For monetary gifts',
    giftCardTitle: 'WEDDING GIFT CARD',
    cardNumber: 'CARD NUMBER',
    cardOwner: 'CARD HOLDER',
    copyCard: 'Copy Card Number',
    copied: 'Copied!',
    giftNote: 'If you wish to send a monetary gift to the bride and groom, you can use the card number below.',
    giftCardExampleLabel: 'Card example',
    footerText: 'Create a beautiful invitation like this',
    videoTag: 'VIDEO',
    toggleMusic: 'Toggle music',
    changeLang: 'Change language',
    manageSections: 'Manage sections',
    close: 'Close',
    sectionNames: {
      hero: 'Hero Cover / Envelope',
      quran: 'Quranic Verse & Dua',
      schedule: 'Wedding Schedule',
      countdown: 'Countdown',
      calendar: 'Date & Time',
      gallery: 'Photo Gallery',
      venue: 'Venue & Map',
      rsvp: 'RSVP Form',
      gift: 'Gift & Card',
    },
  },
};

// =========================================================================
// 6. MAIN COMPONENT: HILAL WEDDING SITE
// =========================================================================
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
  isCatalogPreview = false,
  visualVariant = 'default',
  onToggleSection,
  onLanguageChange,
}) => {
  // CalmMotion: true when reduced motion is preferred OR in preview mode
  const calmMotion = useCalmMotion(isPreview);

  // Active color palette
  const palette = HILAL_PALETTES[visualVariant] || HILAL_PALETTES.default;

  // Language management
  const [currentLang, setCurrentLang] = useState<'uz' | 'ru' | 'en'>(lang || 'uz');
  useEffect(() => {
    if (lang && (lang === 'uz' || lang === 'ru' || lang === 'en')) {
      setCurrentLang(lang);
    }
  }, [lang]);

  const t = translations[currentLang] || translations.uz;
  const demoContent = getDemoContent(currentLang);

  // Envelope open animation state
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

    window.setTimeout(() => {
      setInternalOpened(true);
      if (onOpenEnvelope) onOpenEnvelope();
    }, 850);
  };

  // Section visibility predicate
  const [localHiddenSections, setLocalHiddenSections] = useState<string[]>(data.hiddenSections || []);
  useEffect(() => {
    if (data.hiddenSections) {
      setLocalHiddenSections(data.hiddenSections);
    }
  }, [data.hiddenSections]);
  const isSectionVisible = createSectionVisibility(data.hiddenSections || localHiddenSections);

  const [showSectionManager, setShowSectionManager] = useState(false);

  // Couple names: raw strings preserved, uppercase applied via CSS
  const groomName = data.groomName?.trim() || (isPreview ? demoContent.groomName : '');
  const brideName = data.brideName?.trim() || (isPreview ? demoContent.brideName : '');
  const groomInitial = groomName ? groomName.charAt(0).toUpperCase() : 'D';
  const brideInitial = brideName ? brideName.charAt(0).toUpperCase() : 'O';

  // Date and Time parsing
  const rawDate = data.date || '2026-07-08';
  const rawTime = data.time || '18:00';
  const formattedEventDate = formatEventDate(rawDate, currentLang);
  const eventDate = useMemo(() => {
    return parseEventDateTime(rawDate, rawTime);
  }, [rawDate, rawTime]);

  const targetYear = eventDate.getFullYear();
  const targetMonth = eventDate.getMonth();
  const targetDay = eventDate.getDate();

  // Venue information
  const venueName = data.venue?.trim() || (isPreview ? demoContent.venue : '');
  const venueAddress = data.address?.trim() || (isPreview ? demoContent.address : '');

  // Calendar event helper
  const calendarEvent: CalendarEvent = useMemo(() => {
    return {
      title: `${groomName} & ${brideName} - ${t.weddingTitle}`,
      start: eventDate,
      durationMinutes: 240,
      location: [venueName, venueAddress].filter(Boolean).join(', '),
      description: t.weddingInvitation,
    };
  }, [groomName, brideName, t.weddingTitle, eventDate, venueName, venueAddress, t.weddingInvitation]);

  const googleCalUrl = useMemo(() => getGoogleCalendarUrl(calendarEvent), [calendarEvent]);
  const handleDownloadIcs = () => downloadIcs(calendarEvent);

  // Venue map navigation URLs
  const googleMapsUrl = useMemo(() => getGoogleMapsUrl(venueName, venueAddress), [venueName, venueAddress]);
  const yandexMapsUrl = useMemo(() => getYandexMapsUrl(venueName, venueAddress), [venueName, venueAddress]);

  // Copy helpers
  const { copied: cardCopied, copy: copyCard } = useCopyToClipboard();
  const { copied: addressCopied, copy: copyAddress } = useCopyToClipboard();

  // Gift Card evaluation
  const rawGiftCardNumber = data.giftCardNumber?.trim() || '';
  const hasRealCard = rawGiftCardNumber.length > 0;
  const giftCardOwner = data.giftCardOwner?.trim() || '';

  // Photos & Media
  const userHeroPhoto = data.photoUrl ? getMediaUrl(data.photoUrl) : '';
  const userHeroVideo = data.videoUrl ? getMediaUrl(data.videoUrl) : '';
  const heroPhoto = userHeroPhoto || (isPreview ? '/wedding_doves.webp' : '');
  const heroVideo = userHeroVideo;

  const hasUserPhotos = Array.isArray(data.photos) && data.photos.length > 0;
  const galleryMedia = useMemo(() => {
    if (hasUserPhotos) {
      return data.photos!.map((p) => getMediaUrl(p));
    }
    if (isPreview) {
      return ['/wedding_doves.webp', '/olive-editorial-hero.webp'];
    }
    return [];
  }, [hasUserPhotos, data.photos, isPreview]);

  // Lightbox modal state with Escape key dismissal
  const [activeModalMedia, setActiveModalMedia] = useState<string | null>(null);
  useEffect(() => {
    if (!activeModalMedia) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalMedia(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalMedia]);

  // Schedule items
  const userSchedule = Array.isArray(data.schedule) && data.schedule.length > 0
    ? data.schedule
    : Array.isArray(data.scheduleItems) && data.scheduleItems.length > 0
      ? data.scheduleItems
      : null;
  const scheduleList = userSchedule || (isPreview ? demoContent.schedule : []);

  // Countdown calculations
  const calculatedTimeLeft = useCountdownTimer(data.date, data.time, timeLeft);

  // Calendar month day grid
  const calendarDays = useMemo(() => {
    const totalDays = new Date(targetYear, targetMonth + 1, 0).getDate();
    const firstDayIndex = new Date(targetYear, targetMonth, 1).getDay();
    const startPadding = (firstDayIndex + 6) % 7;
    const days: (number | null)[] = [];
    for (let i = 0; i < startPadding; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    return days;
  }, [targetYear, targetMonth]);

  // RSVP Form local state
  const [localName, setLocalName] = useState(rsvpState?.name || '');
  const [localGuests, setLocalGuests] = useState(rsvpState?.guestCount || 1);
  const [localAttending, setLocalAttending] = useState<boolean | null>(rsvpState?.attending ?? null);
  const [localWishes, setLocalWishes] = useState(rsvpState?.wishes || '');
  const [localSubmitted, setLocalSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpState?.onSubmit) {
      rsvpState.onSubmit(e);
    } else {
      setLocalSubmitted(true);
    }
  };

  // Root CSS Variables style injection
  const rootStyle: React.CSSProperties = {
    ['--hilal-bg' as any]: palette.bg,
    ['--hilal-panel' as any]: palette.panel,
    ['--hilal-panel-soft' as any]: palette.panelSoft,
    ['--hilal-paper' as any]: palette.paper,
    ['--hilal-ink' as any]: palette.ink,
    ['--hilal-text' as any]: palette.text,
    ['--hilal-muted' as any]: palette.muted,
    ['--hilal-accent' as any]: palette.accent,
    ['--hilal-accent-light' as any]: palette.accentLight,
    ['--hilal-accent-dark' as any]: palette.accentDark,
    ['--hilal-border' as any]: palette.border,
    ['--hilal-border-strong' as any]: palette.borderStrong,
    ['--hilal-glow' as any]: palette.glow,
  };

  return (
    <div
      style={rootStyle}
      className="relative min-h-screen bg-[var(--hilal-bg)] text-[var(--hilal-text)] font-serif overflow-x-hidden selection:bg-[var(--hilal-accent)] selection:text-[var(--hilal-bg)]"
    >
      {/* Floating Audio & Language Controls */}
      {!isCatalogPreview && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {/* Language Switcher */}
          <div className="bg-[var(--hilal-panel)]/90 border border-[var(--hilal-border)] rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-[var(--hilal-accent)] backdrop-blur-md shadow-lg">
            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
            <button
              onClick={() => {
                const nextLang = currentLang === 'uz' ? 'ru' : currentLang === 'ru' ? 'en' : 'uz';
                setCurrentLang(nextLang);
                if (onLanguageChange) onLanguageChange(nextLang);
              }}
              aria-label={t.changeLang}
              className="uppercase font-bold tracking-wider hover:text-white transition-colors"
            >
              {currentLang}
            </button>
          </div>

          {/* Music Toggle */}
          {onToggleAudio && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={onToggleAudio}
              aria-label={t.toggleMusic}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[var(--hilal-panel)]/90 border border-[var(--hilal-border)] flex items-center justify-center text-[var(--hilal-accent)] backdrop-blur-md shadow-lg hover:bg-[var(--hilal-accent)] hover:text-[var(--hilal-bg)] transition-all cursor-pointer"
            >
              {isPlaying ? (
                <motion.div
                  animate={calmMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                >
                  <Volume2 className="w-5 h-5" />
                </motion.div>
              ) : (
                <VolumeX className="w-5 h-5 text-[var(--hilal-muted)]" />
              )}
            </motion.button>
          )}

          {/* Preview Section Manager Toggle */}
          {isPreview && (
            <button
              onClick={() => setShowSectionManager(!showSectionManager)}
              aria-label={t.manageSections}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[var(--hilal-accent)] text-[var(--hilal-bg)] flex items-center justify-center shadow-lg font-sans cursor-pointer hover:bg-[var(--hilal-accent-light)] transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Preview Section Manager Drawer */}
      {isPreview && !isCatalogPreview && showSectionManager && (
        <div className="fixed top-16 right-4 z-50 bg-[var(--hilal-panel)] border border-[var(--hilal-border-strong)] rounded-2xl p-4 w-72 shadow-2xl backdrop-blur-xl text-xs font-sans">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--hilal-border)]">
            <span className="font-bold text-[var(--hilal-accent)] flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> {t.manageSections}
            </span>
            <button
              onClick={() => setShowSectionManager(false)}
              aria-label={t.close}
              className="text-[var(--hilal-muted)] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {[
              { id: 'hero', name: t.sectionNames.hero },
              { id: 'quran', name: t.sectionNames.quran },
              { id: 'schedule', name: t.sectionNames.schedule },
              { id: 'countdown', name: t.sectionNames.countdown },
              { id: 'calendar', name: t.sectionNames.calendar },
              { id: 'gallery', name: t.sectionNames.gallery },
              { id: 'venue', name: t.sectionNames.venue },
              { id: 'rsvp', name: t.sectionNames.rsvp },
              { id: 'gift', name: t.sectionNames.gift },
            ].map((sec) => (
              <label
                key={sec.id}
                className="flex items-center justify-between p-2 rounded-lg bg-[var(--hilal-bg)] border border-white/5 cursor-pointer hover:border-[var(--hilal-border)]"
              >
                <span className="text-[var(--hilal-text)] text-xs">{sec.name}</span>
                <input
                  type="checkbox"
                  checked={isSectionVisible(sec.id)}
                  onChange={() => {
                    if (onToggleSection) {
                      onToggleSection(sec.id);
                    } else {
                      setLocalHiddenSections((prev) =>
                        prev.includes(sec.id) ? prev.filter((s) => s !== sec.id) : [...prev, sec.id]
                      );
                    }
                  }}
                  className="accent-[var(--hilal-accent)] w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. LUXURY ARCH ENVELOPE / OPENING SCREEN                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={
              isOpening
                ? { opacity: [1, 1, 0], scale: [1, 1.03, 1.08] }
                : { opacity: 1, scale: 1 }
            }
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-between p-4 md:p-6 overflow-hidden select-none bg-[radial-gradient(ellipse_at_center,var(--hilal-panel)_0%,var(--hilal-bg)_100%)]"
          >
            {/* Background 8-pointed star Girih pattern (4-6% opacity) */}
            <GirihPattern className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] text-[var(--hilal-accent)]" />

            {/* Calm floating particles on cover only */}
            <HilalCoverParticles calmMotion={calmMotion} palette={palette} />

            {/* Gold particle ripple burst on seal tap */}
            <GoldBurst active={burstActive} palette={palette} />

            {/* Top Header: Islamic Crescent and Arabic Bismillah (Amiri font, RTL, NO tracking) */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="w-full max-w-sm pt-4 sm:pt-6 text-center flex flex-col items-center z-10"
            >
              <div className="w-12 h-12 rounded-full border border-[var(--hilal-border)] bg-[var(--hilal-panel)]/80 flex items-center justify-center mb-2.5 text-[var(--hilal-accent)] shadow-lg shadow-black/40">
                <HilalCrescent className="w-6 h-6 text-[var(--hilal-accent)]" />
              </div>

              <div
                dir="rtl"
                lang="ar"
                className="font-arabic text-2xl sm:text-3xl text-[var(--hilal-accent)] leading-relaxed select-text"
                style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
              >
                {t.bismillah}
              </div>
            </motion.div>

            {/* Center Ornate Islamic Arch Envelope Card */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={isOpening ? { scale: 1.04, y: -10 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative z-20 w-full max-w-xs my-auto"
            >
              <HilalArch
                className="w-full aspect-[3/4.3] shadow-[0_15px_50px_rgba(0,0,0,0.7)]"
                innerClassName="bg-gradient-to-b from-[var(--hilal-panel)] via-[var(--hilal-bg)] to-[var(--hilal-panel)] p-5 flex flex-col items-center justify-between text-center relative"
                ornament
              >
                {/* Top Subtitle */}
                <div className="pt-4 z-10 space-y-1">
                  <span className="block px-2 text-[11px] tracking-[0.25em] leading-relaxed uppercase text-[var(--hilal-accent)] font-sans font-bold">
                    {t.weddingInvitation}
                  </span>
                </div>

                {/* Arch Window for Couple Photo or Typographic Monogram */}
                <div className="relative w-36 aspect-[3/4] my-2">
                  <HilalArch className="w-full h-full shadow-lg" ornament={false}>
                    {heroVideo ? (
                      <video
                        src={heroVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : heroPhoto ? (
                      <img
                        src={heroPhoto}
                        alt={`${groomName} & ${brideName}`}
                        className="w-full h-full object-cover"
                        width={144}
                        height={192}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-[var(--hilal-panel)] to-[var(--hilal-bg)] flex flex-col items-center justify-center p-3 text-center border border-[var(--hilal-border)]">
                        <HilalCrescent className="w-8 h-8 text-[var(--hilal-accent)] mb-1" />
                        <span className="font-serif text-lg tracking-widest text-[var(--hilal-accent-light)] font-bold">
                          {groomInitial} & {brideInitial}
                        </span>
                      </div>
                    )}
                  </HilalArch>
                </div>

                {/* Couple Names & Event Date */}
                <div className="z-10 space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[var(--hilal-accent-light)] via-[var(--hilal-accent)] to-[var(--hilal-accent-dark)]">
                    {groomName} <span className="font-light text-xl text-[var(--hilal-accent)]">&</span> {brideName}
                  </h1>
                  <p className="text-xs text-[var(--hilal-muted)] font-sans font-medium">
                    {formattedEventDate.full || rawDate} • {rawTime}
                  </p>
                </div>

                {/* Wax Seal Button with gentle calm breathing */}
                <div className="relative z-30 pt-1 pb-1 flex flex-col items-center gap-1.5">
                  <motion.button
                    whileHover={{ scale: calmMotion ? 1 : 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    animate={calmMotion ? { scale: 1 } : { scale: [1, 1.03, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    onClick={handleOpenClick}
                    disabled={isOpening}
                    aria-label={t.openInvitation}
                    className="min-w-[44px] min-h-[44px] w-16 h-16 rounded-full bg-gradient-to-br from-[var(--hilal-accent-light)] via-[var(--hilal-accent)] to-[var(--hilal-accent-dark)] p-0.5 shadow-[0_4px_25px_rgba(0,0,0,0.6)] cursor-pointer flex items-center justify-center relative z-10 group"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--hilal-panel)] via-[var(--hilal-bg)] to-[var(--hilal-panel)] border border-[var(--hilal-accent-light)]/60 flex items-center justify-center text-[var(--hilal-accent)] shadow-inner">
                      <span className="text-xs font-serif font-extrabold tracking-widest text-[var(--hilal-accent-light)] text-center leading-none group-hover:scale-105 transition-transform">
                        {groomInitial} & {brideInitial}
                      </span>
                    </div>
                  </motion.button>
                </div>

                <p className="text-xs text-[var(--hilal-muted)] font-sans font-light italic z-10 pb-2">
                  {t.openInvitationSub}
                </p>
              </HilalArch>
            </motion.div>

            {/* Bottom Invitation Button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full max-w-xs pb-4 z-20"
            >
              <button
                onClick={handleOpenClick}
                disabled={isOpening}
                aria-label={t.openInvitation}
                className="group relative w-full min-h-[48px] px-6 border border-[var(--hilal-border-strong)] bg-gradient-to-r from-[var(--hilal-panel)] via-[var(--hilal-bg)] to-[var(--hilal-panel)] text-[var(--hilal-accent-light)] font-sans font-bold tracking-[0.16em] text-xs uppercase shadow-lg shadow-black/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <HilalCrescent className="w-4 h-4 text-[var(--hilal-accent)] shrink-0 transition-transform group-hover:-rotate-12" />
                <span>{isOpening ? t.opening : t.openInvitation}</span>
                <HilalCrescent className="w-4 h-4 text-[var(--hilal-accent)] shrink-0 transition-transform group-hover:rotate-12" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. MAIN INVITATION CONTENT                                                */}
      {/* ========================================================================= */}
      <div className="w-full max-w-md mx-auto px-4 py-8 space-y-12">
        {/* SECTION 1: HERO HEADER & COUPLE ARCH SHOWCASE */}
        {isSectionVisible('hero') && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center pt-4 space-y-6"
          >
            <div className="space-y-1.5">
              <div
                dir="rtl"
                lang="ar"
                className="font-arabic text-2xl sm:text-3xl text-[var(--hilal-accent)] select-text"
                style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
              >
                {t.bismillah}
              </div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--hilal-accent)] font-sans font-semibold">
                {t.weddingInvitation}
              </p>
            </div>

            {/* Arch Framed Photo / Video Showcase */}
            <div className="relative mx-auto w-64 max-w-full aspect-[3/4]">
              <HilalArch
                className="w-full h-full shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                innerClassName="bg-[var(--hilal-panel)]"
                ornament
              >
                {heroVideo ? (
                  <video
                    src={heroVideo}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : heroPhoto ? (
                  <img
                    src={heroPhoto}
                    alt={`${groomName} & ${brideName}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    width={256}
                    height={341}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-[var(--hilal-panel)] to-[var(--hilal-bg)] flex flex-col items-center justify-center p-6 text-center border border-[var(--hilal-border)]">
                    <HilalCrescent className="w-12 h-12 text-[var(--hilal-accent)] mb-3" />
                    <span className="font-serif text-2xl tracking-widest text-[var(--hilal-accent-light)] font-bold">
                      {groomInitial} & {brideInitial}
                    </span>
                  </div>
                )}
              </HilalArch>
            </div>

            {/* Couple Names Header */}
            <div className="space-y-2 pt-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[var(--hilal-accent-light)] via-[var(--hilal-accent)] to-[var(--hilal-accent-dark)]">
                {groomName}
              </h2>
              <div className="text-2xl font-light text-[var(--hilal-accent)] italic font-serif">
                {t.and}
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[var(--hilal-accent-light)] via-[var(--hilal-accent)] to-[var(--hilal-accent-dark)]">
                {brideName}
              </h2>
            </div>

            {/* Date & Time Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[var(--hilal-panel)] border border-[var(--hilal-border)] shadow-md text-sm text-[var(--hilal-accent)] font-sans font-medium">
              <Calendar className="w-4 h-4 text-[var(--hilal-accent)]" />
              <span>{formattedEventDate.full || rawDate}</span>
              <span className="text-[var(--hilal-muted)]/50">•</span>
              <Clock className="w-4 h-4 text-[var(--hilal-accent)]" />
              <span>{rawTime}</span>
            </div>
          </motion.section>
        )}

        {/* SECTION 2: QURANIC VERSE (AR-RUM 30:21) & AMIRI TYPOGRAPHY */}
        {isSectionVisible('quran') && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative p-6 sm:p-8 rounded-3xl bg-[var(--hilal-panel)] border border-[var(--hilal-border)] shadow-xl text-center space-y-4 overflow-hidden"
          >
            <div className="flex justify-center text-[var(--hilal-accent)]">
              <HilalCrescent className="w-6 h-6" />
            </div>

            <div className="text-xs uppercase tracking-widest text-[var(--hilal-accent)] font-sans font-semibold">
              {t.quranHeader}
            </div>

            {/* Arabic Quranic Verse: Amiri font, RTL, 26-30px, leading-[2], NO tracking, NO glowing drop shadow */}
            <div
              dir="rtl"
              lang="ar"
              className="font-arabic text-2xl sm:text-[28px] md:text-[30px] leading-[2] text-[var(--hilal-accent-light)] px-2 py-1 select-text"
              style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
            >
              {t.quranArabic}
            </div>

            {/* Precise localized translation */}
            <p className="text-sm sm:text-base text-[var(--hilal-text)]/90 font-light italic leading-relaxed px-2">
              {t.quranTranslation}
            </p>

            {/* Verified Surah and Verse Source */}
            <div className="text-xs text-[var(--hilal-accent)] font-sans font-medium uppercase tracking-wider">
              {t.quranSurah}
            </div>
          </motion.section>
        )}

        {/* SECTION 3: PROGRAM SCHEDULE ("KUN TARTIBI") */}
        {isSectionVisible('schedule') && scheduleList.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 sm:p-7 rounded-3xl bg-[var(--hilal-panel)] border border-[var(--hilal-border)] shadow-xl text-center space-y-5 font-sans relative"
          >
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--hilal-accent)] font-bold">
                {t.scheduleTitle}
              </span>
              <h3 className="text-2xl font-serif text-[var(--hilal-accent-light)] font-normal">
                {t.scheduleSub}
              </h3>
            </div>

            <div className="flex flex-col gap-4 text-left pt-2 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-[1px] before:bg-[var(--hilal-border)]">
              {scheduleList.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-4 relative z-10">
                  <div className="w-11 h-11 rounded-full bg-[var(--hilal-bg)] border border-[var(--hilal-border-strong)] flex items-center justify-center text-[var(--hilal-accent)] font-bold text-xs shrink-0 shadow-md">
                    {item.time}
                  </div>
                  <div className="flex flex-col pt-1">
                    <h4 className="text-sm font-bold text-[var(--hilal-accent-light)]">
                      {item.title || item.label}
                    </h4>
                    {item.desc && (
                      <p className="text-xs text-[var(--hilal-muted)] mt-0.5">{item.desc}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION 4: COUNTDOWN TIMER ("SANOQ") */}
        {isSectionVisible('countdown') && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-5"
          >
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--hilal-accent)] font-sans font-bold">
                {t.countdownEyebrow}
              </span>
              <h3 className="text-2xl font-serif text-[var(--hilal-accent-light)] font-normal">
                {t.countdownTitle}
              </h3>
              <p className="text-xs text-[var(--hilal-muted)] font-light font-sans">
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
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[var(--hilal-panel)] border border-[var(--hilal-border)] shadow-lg"
                >
                  <span className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[var(--hilal-accent-light)] to-[var(--hilal-accent)]">
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-[var(--hilal-muted)] mt-1 font-semibold">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION 5: INTERACTIVE CALENDAR & "ADD TO CALENDAR" */}
        {isSectionVisible('calendar') && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 sm:p-7 rounded-3xl bg-[var(--hilal-panel)] border border-[var(--hilal-border)] shadow-xl space-y-5 font-sans text-center"
          >
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--hilal-accent)] font-semibold">
                {t.calendarTitle}
              </span>
              <h4 className="text-2xl font-serif text-[var(--hilal-accent-light)] capitalize">
                {formattedEventDate.month} {targetYear}
              </h4>
              <p className="text-xs text-[var(--hilal-muted)]">{t.calendarSub}</p>
            </div>

            <div className="pt-2">
              <div className="grid grid-cols-7 text-center text-xs text-[var(--hilal-accent)] font-bold mb-2">
                {t.weekdays.map((wd, i) => (
                  <div key={i}>{wd}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center text-xs gap-y-2 text-[var(--hilal-text)]">
                {calendarDays.map((d, i) => {
                  const isWeddingDay = d === targetDay;
                  return (
                    <div key={i} className="h-8 flex items-center justify-center">
                      {d && (
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-medium ${
                            isWeddingDay
                              ? 'bg-gradient-to-r from-[var(--hilal-accent)] to-[var(--hilal-accent-dark)] text-[var(--hilal-bg)] font-bold shadow-md scale-110'
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

            {/* "Add to Calendar" Actions (Google Calendar & .ics Download) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-[var(--hilal-border)]">
              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] py-2.5 px-4 rounded-xl bg-[var(--hilal-bg)] border border-[var(--hilal-border)] text-[var(--hilal-accent)] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--hilal-accent)] hover:text-[var(--hilal-bg)] transition-all shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.googleCalendar}</span>
              </a>
              <button
                type="button"
                onClick={handleDownloadIcs}
                className="min-h-[44px] py-2.5 px-4 rounded-xl bg-[var(--hilal-bg)] border border-[var(--hilal-border)] text-[var(--hilal-accent)] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--hilal-accent)] hover:text-[var(--hilal-bg)] transition-all shadow-sm cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>{t.downloadIcs}</span>
              </button>
            </div>
          </motion.section>
        )}

        {/* SECTION 6: PHOTO & VIDEO GALLERY (NO UNSPLASH STOCK PHOTOS) */}
        {isSectionVisible('gallery') && galleryMedia.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4 text-center"
          >
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--hilal-accent)] font-sans font-semibold">
                {t.galleryTitle}
              </span>
              <p className="text-xs text-[var(--hilal-muted)] font-light font-sans">
                {t.gallerySub}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {galleryMedia.map((url, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveModalMedia(url)}
                  className="relative aspect-square rounded-2xl border border-[var(--hilal-border)] overflow-hidden bg-[var(--hilal-panel)] cursor-pointer shadow-lg group"
                >
                  {url.endsWith('.mp4') || url.includes('video') ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                      <video src={url} className="w-full h-full object-cover opacity-85" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play className="w-8 h-8 text-[var(--hilal-accent)] fill-[var(--hilal-accent)]" />
                      </div>
                      <span className="absolute bottom-2 right-2 text-xs bg-[var(--hilal-bg)]/80 text-[var(--hilal-accent)] px-2 py-0.5 rounded font-sans font-bold">
                        {t.videoTag}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={`Gallery media ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width={200}
                      height={200}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                    <Maximize2 className="w-4 h-4 text-[var(--hilal-accent)]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION 7: VENUE LOCATION & DUAL MAP LINKS */}
        {isSectionVisible('venue') && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 sm:p-7 rounded-3xl bg-[var(--hilal-panel)] border border-[var(--hilal-border)] shadow-xl text-center space-y-4 font-sans"
          >
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--hilal-accent)] font-semibold">
                {t.venueTitle}
              </span>
              <h3 className="text-2xl font-serif text-[var(--hilal-accent-light)] font-normal">
                {venueName}
              </h3>
              <p className="text-xs text-[var(--hilal-muted)] font-light flex items-center justify-center gap-1.5 px-4">
                <MapPin className="w-3.5 h-3.5 text-[var(--hilal-accent)] shrink-0" />
                <span>{venueAddress}</span>
              </p>
            </div>

            {/* Copy Address Button */}
            {venueAddress && (
              <button
                type="button"
                onClick={() => copyAddress(venueAddress)}
                aria-label={t.copyAddress}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--hilal-accent)] hover:underline py-1 cursor-pointer"
              >
                {addressCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{addressCopied ? t.copied : t.copyAddress}</span>
              </button>
            )}

            {/* Dual Maps Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] py-3 px-4 rounded-xl bg-[var(--hilal-bg)] border border-[var(--hilal-border)] text-[var(--hilal-accent)] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--hilal-accent)] hover:text-[var(--hilal-bg)] transition-all shadow-md cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                {t.googleMaps}
              </a>
              <a
                href={yandexMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] py-3 px-4 rounded-xl bg-[var(--hilal-bg)] border border-[var(--hilal-border)] text-[var(--hilal-accent)] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--hilal-accent)] hover:text-[var(--hilal-bg)] transition-all shadow-md cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                {t.yandexMaps}
              </a>
            </div>

            {/* Islamic Wedding Dua: Amiri font, RTL */}
            <div
              dir="rtl"
              lang="ar"
              className="pt-3 font-arabic text-base sm:text-lg text-[var(--hilal-accent-light)] leading-relaxed select-text border-t border-[var(--hilal-border)]/50"
              style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
            >
              {t.duaArabic}
            </div>
          </motion.section>
        )}

        {/* SECTION 8: INTERACTIVE RSVP FORM */}
        {isSectionVisible('rsvp') && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 sm:p-7 rounded-3xl bg-[var(--hilal-panel)] border border-[var(--hilal-border)] shadow-xl space-y-5 font-sans"
          >
            <div className="text-center space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--hilal-accent)] font-semibold">
                {t.rsvpTitle}
              </span>
              <p className="text-xs text-[var(--hilal-muted)] font-light">{t.rsvpSub}</p>
            </div>

            {rsvpState?.isSuccess || (!rsvpState && localSubmitted) ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-[var(--hilal-bg)] border border-[var(--hilal-accent)] text-center space-y-3"
              >
                <CheckCircle2 className="w-12 h-12 text-[var(--hilal-accent)] mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-[var(--hilal-accent-light)] font-serif">
                  {t.rsvpSuccess}
                </h4>
                <p className="text-xs text-[var(--hilal-text)]/90">{t.rsvpSuccessSub}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs">
                {/* Attending Selection */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLocalAttending(true);
                      rsvpState?.setAttending(true);
                    }}
                    className={`min-h-[44px] py-3 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      (rsvpState ? rsvpState.attending === true : localAttending === true)
                        ? 'bg-gradient-to-r from-[var(--hilal-accent)] to-[var(--hilal-accent-dark)] text-[var(--hilal-bg)] shadow-md'
                        : 'bg-[var(--hilal-bg)] border border-white/10 text-[var(--hilal-muted)] hover:border-[var(--hilal-border)]'
                    }`}
                  >
                    <Check className="w-4 h-4" /> {t.attendingYes}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalAttending(false);
                      rsvpState?.setAttending(false);
                    }}
                    className={`min-h-[44px] py-3 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      (rsvpState ? rsvpState.attending === false : localAttending === false)
                        ? 'bg-rose-950/80 border border-rose-500 text-rose-200'
                        : 'bg-[var(--hilal-bg)] border border-white/10 text-[var(--hilal-muted)] hover:border-[var(--hilal-border)]'
                    }`}
                  >
                    <X className="w-4 h-4" /> {t.attendingNo}
                  </button>
                </div>

                {/* Guest Name */}
                <div className="space-y-1">
                  <label htmlFor="hilal-rsvp-name" className="text-[var(--hilal-text)] font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[var(--hilal-accent)]" /> {t.nameLabel}
                  </label>
                  <input
                    id="hilal-rsvp-name"
                    type="text"
                    required
                    value={rsvpState ? rsvpState.name : localName}
                    onChange={(e) => {
                      setLocalName(e.target.value);
                      rsvpState?.setName(e.target.value);
                    }}
                    placeholder={t.namePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--hilal-bg)] border border-white/15 text-white placeholder-[var(--hilal-muted)]/50 focus:outline-none focus:border-[var(--hilal-accent)] transition-colors text-xs"
                  />
                </div>

                {/* Guest Count */}
                {(rsvpState ? rsvpState.attending !== false : localAttending !== false) && (
                  <div className="space-y-1">
                    <label htmlFor="hilal-rsvp-guests" className="text-[var(--hilal-text)] font-medium flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[var(--hilal-accent)]" /> {t.guestsLabel}
                    </label>
                    <select
                      id="hilal-rsvp-guests"
                      value={rsvpState ? rsvpState.guestCount : localGuests}
                      onChange={(e) => {
                        const count = Number(e.target.value);
                        setLocalGuests(count);
                        rsvpState?.setGuestCount(count);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--hilal-bg)] border border-white/15 text-white focus:outline-none focus:border-[var(--hilal-accent)] transition-colors text-xs cursor-pointer"
                    >
                      <option value="1">1 {t.guestsCount}</option>
                      <option value="2">2 {t.guestsCount}</option>
                      <option value="3">3 {t.guestsCount}</option>
                      <option value="4">4+ {t.guestsCount}</option>
                    </select>
                  </div>
                )}

                {/* Wishes Textarea */}
                <div className="space-y-1">
                  <label htmlFor="hilal-rsvp-wishes" className="text-[var(--hilal-text)] font-medium flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[var(--hilal-accent)]" /> {t.wishesLabel}
                  </label>
                  <textarea
                    id="hilal-rsvp-wishes"
                    rows={3}
                    value={rsvpState ? rsvpState.wishes : localWishes}
                    onChange={(e) => {
                      setLocalWishes(e.target.value);
                      rsvpState?.setWishes(e.target.value);
                    }}
                    placeholder={t.wishesPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--hilal-bg)] border border-white/15 text-white placeholder-[var(--hilal-muted)]/50 focus:outline-none focus:border-[var(--hilal-accent)] transition-colors text-xs resize-none"
                  />
                </div>

                <PrivacyConsentCheckbox lang={currentLang} />

                <button
                  type="submit"
                  disabled={
                    rsvpState?.isSubmitting ||
                    !(rsvpState ? rsvpState.name.trim() : localName.trim()) ||
                    (rsvpState ? rsvpState.attending === null : localAttending === null)
                  }
                  className="min-h-[44px] w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[var(--hilal-accent)] via-[var(--hilal-accent-light)] to-[var(--hilal-accent-dark)] text-[var(--hilal-bg)] font-bold text-xs uppercase tracking-widest shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {rsvpState?.isSubmitting ? t.submitting : t.submitRsvp}
                </button>
              </form>
            )}
          </motion.section>
        )}

        {/* SECTION 9: WEDDING GIFT PAPER CARD (NO GLASSMORPHISM) */}
        {isSectionVisible('gift') && (hasRealCard || isPreview) && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4 text-center font-sans"
          >
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--hilal-accent)] font-semibold">
                {t.giftTitle}
              </span>
              <p className="text-xs text-[var(--hilal-muted)] font-light">{t.giftSub}</p>
            </div>

            {/* Paper card with fine golden double border */}
            <div className="relative p-6 sm:p-7 rounded-2xl bg-[var(--hilal-paper)] border border-[var(--hilal-border)] shadow-xl text-left space-y-5 overflow-hidden">
              {/* Inner subtle decorative border frame */}
              <div className="absolute inset-2 border border-[var(--hilal-border)]/40 rounded-xl pointer-events-none" />

              <div className="flex justify-between items-center relative z-10">
                <span className="text-xs font-serif font-bold text-[var(--hilal-accent)] tracking-widest uppercase">
                  {t.giftCardTitle}
                </span>
                <Gift className="w-5 h-5 text-[var(--hilal-accent)]" />
              </div>

              <div className="space-y-1 relative z-10">
                <span className="text-[11px] uppercase tracking-wider text-[var(--hilal-muted)] font-mono">
                  {t.cardNumber}
                </span>
                <div className="text-xl sm:text-2xl font-mono tabular-nums font-bold tracking-widest text-[var(--hilal-accent-light)]">
                  {hasRealCard ? formatCardNumber(rawGiftCardNumber) : maskCardExample()}
                </div>
              </div>

              <div className="flex items-end justify-between pt-1 relative z-10">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[var(--hilal-muted)] block font-mono">
                    {t.cardOwner}
                  </span>
                  <span className="text-xs font-semibold text-[var(--hilal-text)] tracking-wider uppercase font-mono">
                    {giftCardOwner || (isPreview ? (currentLang === 'uz' ? 'Kelin-kuyov hisobi' : currentLang === 'ru' ? 'Счёт молодожёнов' : 'Couple account') : '')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => copyCard(hasRealCard ? rawGiftCardNumber : '8600000000000000')}
                  aria-label={t.copyCard}
                  className="min-h-[44px] py-2.5 px-4 rounded-xl bg-[var(--hilal-accent)] text-[var(--hilal-bg)] text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-[var(--hilal-accent-light)] transition-colors cursor-pointer"
                >
                  {cardCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{cardCopied ? t.copied : t.copyCard}</span>
                </button>
              </div>

              {!hasRealCard && isPreview && (
                <div className="relative z-10 pt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-sans font-medium bg-[var(--hilal-border)]/20 text-[var(--hilal-accent)] border border-[var(--hilal-border)]/40">
                    {t.giftCardExampleLabel}
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-[var(--hilal-muted)] font-light px-4 italic leading-relaxed">
              {t.giftNote}
            </p>
          </motion.section>
        )}

        {/* FOOTER */}
        <footer className="text-center pt-8 pb-12 space-y-3 border-t border-[var(--hilal-border)] font-sans">
          <h5 className="text-2xl font-serif uppercase tracking-wider text-[var(--hilal-accent)]">
            {groomName} & {brideName}
          </h5>
          <p className="text-xs text-[var(--hilal-muted)] font-light">{t.footerText}</p>
        </footer>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL WITH ESC KEY DISMISSAL & ARIA */}
      <AnimatePresence>
        {activeModalMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalMedia(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              onClick={() => setActiveModalMedia(null)}
              aria-label={t.close}
              className="min-w-[44px] min-h-[44px] absolute top-6 right-6 text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-[var(--hilal-border)]"
              onClick={(e) => e.stopPropagation()}
            >
              {activeModalMedia.endsWith('.mp4') || activeModalMedia.includes('video') ? (
                <video
                  src={activeModalMedia}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] object-contain"
                />
              ) : (
                <img
                  src={activeModalMedia}
                  alt="Enlarged media"
                  className="max-w-full max-h-[80vh] object-contain"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
