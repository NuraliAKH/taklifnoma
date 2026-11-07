import { parseEventDateTime } from '../../../utils/timer';

export interface FormattedDate {
  day: string;
  month: string;
  monthShort: string;
  year: string;
  weekday: string;
  full: string;
}

const UZ_MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
] as const;

const UZ_MONTHS_SHORT = [
  'yan',
  'fev',
  'mar',
  'apr',
  'may',
  'iyn',
  'iyl',
  'avg',
  'sen',
  'okt',
  'noy',
  'dek',
] as const;

// 0: yakshanba (Sunday), 1: dushanba (Monday) ... 6: shanba (Saturday)
const UZ_WEEKDAYS = [
  'yakshanba',
  'dushanba',
  'seshanba',
  'chorshanba',
  'payshanba',
  'juma',
  'shanba',
] as const;

/**
 * Formats event date into structured parts and localized full string.
 * Uses manual Latin arrays for Uzbek because Android Intl often outputs Cyrillic or English.
 */
export function formatEventDate(date: string, lang: 'ru' | 'uz' | 'en' = 'ru'): FormattedDate {
  const d = parseEventDateTime(date);
  const day = String(d.getDate()).padStart(2, '0');
  const year = String(d.getFullYear());

  if (lang === 'uz') {
    const month = UZ_MONTHS[d.getMonth()] || '';
    const monthShort = UZ_MONTHS_SHORT[d.getMonth()] || '';
    const weekday = UZ_WEEKDAYS[d.getDay()] || '';
    const full = `${d.getDate()}-${month} ${year}-yil, ${weekday}`;
    return { day, month, monthShort, year, weekday, full };
  }

  if (lang === 'en') {
    const month = d.toLocaleDateString('en-GB', { month: 'long' });
    const monthShort = d.toLocaleDateString('en-GB', { month: 'short' });
    const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
    const full = `${weekday}, ${d.getDate()} ${month} ${year}`;
    return { day, month, monthShort, year, weekday, full };
  }

  // ru
  const month = d.toLocaleDateString('ru-RU', { month: 'long' });
  const monthShort = d.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '');
  const weekday = d.toLocaleDateString('ru-RU', { weekday: 'long' });
  const full = `${d.getDate()} ${month} ${year} года, ${weekday}`;
  return { day, month, monthShort, year, weekday, full };
}

/**
 * Formats a raw card number string into 4-digit groups (e.g. 8600 1234 5678 9012).
 */
export function formatCardNumber(raw?: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/**
 * Returns placeholder masked card number for editor / preview mode.
 */
export function maskCardExample(): string {
  return '8600 •••• •••• ••••';
}
