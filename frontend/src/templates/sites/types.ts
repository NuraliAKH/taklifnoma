import React from 'react';

export interface SiteData {
  groomName?: string;
  brideName?: string;
  date?: string;
  time?: string;
  venue?: string;
  address?: string;
  loveStory?: string;
  phone?: string;
  giftCardNumber?: string;
  giftCardOwner?: string;
  photoUrl?: string;
  photos?: string[];
  videoUrl?: string;
  hiddenSections?: string[];
  showHeroPhoto?: boolean;
  showGallery?: boolean;
  showVideo?: boolean;
  showLoveStory?: boolean;
  showSchedule?: boolean;
  showDressCode?: boolean;
  showCountdown?: boolean;
  showGiftCard?: boolean;
  showRsvp?: boolean;
  showPhone?: boolean;
  [key: string]: any;
}

export interface CustomField {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export interface RsvpState {
  name: string;
  setName: (val: string) => void;
  attending: boolean | null;
  setAttending: (val: boolean | null) => void;
  wishes: string;
  setWishes: (val: string) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export interface WebsiteTemplateProps {
  data: SiteData;
  customFields?: CustomField[];
  lang?: 'ru' | 'uz' | 'en';
  isOpened?: boolean;
  onOpenEnvelope?: () => void;
  isPlaying?: boolean;
  onToggleAudio?: () => void;
  timeLeft?: TimeLeft;
  rsvpState?: RsvpState;
  isPreview?: boolean;
  onToggleSection?: (sectionKey: string) => void;
  onLanguageChange?: (newLang: 'ru' | 'uz' | 'en') => void;
}

