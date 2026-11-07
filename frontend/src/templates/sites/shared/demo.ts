export interface DemoScheduleItem {
  time: string;
  title: string;
}

export interface DemoContent {
  groomName: string;
  brideName: string;
  coupleNames: string;
  venue: string;
  address: string;
  groomParents: string;
  brideParents: string;
  loveStory: string;
  schedule: DemoScheduleItem[];
  giftCardExampleLabel: string;
}

export const DEMO_CONTENT: Record<'ru' | 'uz' | 'en', DemoContent> = {
  ru: {
    groomName: 'Jasur',
    brideName: 'Madina',
    coupleNames: 'Jasur & Madina',
    venue: 'Navroʻz saroyi',
    address: 'г. Ташкент, ул. Алишера Навои, 15',
    groomParents: 'Рустам и Дильноза',
    brideParents: 'Анвар и Шахло',
    loveStory:
      'Мы познакомились весенним солнечным днём в Ташкенте и сразу поняли, что это судьба. За прошедшие годы мы разделили множество счастливых моментов и решили соединить наши жизни навсегда. Будем рады видеть вас на нашем празднике любви!',
    schedule: [
      { time: '18:00', title: 'Сбор гостей' },
      { time: '19:00', title: 'Торжественная церемония' },
      { time: '20:00', title: 'Свадебный ужин' },
      { time: '22:30', title: 'Свадебный торт' },
    ],
    giftCardExampleLabel: 'Пример карты',
  },
  uz: {
    groomName: 'Jasur',
    brideName: 'Madina',
    coupleNames: 'Jasur & Madina',
    venue: 'Navroʻz saroyi',
    address: 'Toshkent sh., Alisher Navoiy koʻchasi, 15-uy',
    groomParents: 'Rustam va Dilnoza',
    brideParents: 'Anvar va Shahlo',
    loveStory:
      'Biz bahorning iliq quyoshli kunida Toshkentda uchrashdik va qalbimiz bir ekanini angladik. Yillar davomida quvonchli damlarni birga baham koʻrib, hayotimizni bir umrga bogʻlashga qaror qildik. Ushbu unutilmas kunimizda sizni quvonchimizga sherik boʻlishga chorlaymiz!',
    schedule: [
      { time: '18:00', title: 'Mehmonlar tashrifi' },
      { time: '19:00', title: 'Nikoh tantanasi' },
      { time: '20:00', title: 'Toʻy oqshomi' },
      { time: '22:30', title: 'Toʻy torti' },
    ],
    giftCardExampleLabel: 'Namuna karta',
  },
  en: {
    groomName: 'Jasur',
    brideName: 'Madina',
    coupleNames: 'Jasur & Madina',
    venue: 'Navroʻz saroyi',
    address: '15 Alisher Navoi Street, Tashkent',
    groomParents: 'Rustam & Dilnoza',
    brideParents: 'Anvar & Shahlo',
    loveStory:
      'We met on a sunny spring day in Tashkent and instantly felt we were destined for each other. Over the years we shared countless cherished moments and decided to unite our paths forever. We would be honored to celebrate this special day with you!',
    schedule: [
      { time: '18:00', title: 'Welcome & Gathering' },
      { time: '19:00', title: 'Wedding Ceremony' },
      { time: '20:00', title: 'Gala Dinner' },
      { time: '22:30', title: 'Cake Cutting' },
    ],
    giftCardExampleLabel: 'Card example',
  },
};

/**
 * Returns localized demo content (defaults to 'uz').
 */
export function getDemoContent(lang: 'ru' | 'uz' | 'en' = 'uz'): DemoContent {
  return DEMO_CONTENT[lang] || DEMO_CONTENT.uz;
}

/**
 * Resolves user value or demo fallback:
 * - If userValue is non-empty, returns userValue (both in preview and live site)
 * - If userValue is empty/undefined and isPreview is true, returns demoFallback
 * - If userValue is empty/undefined and isPreview is false, returns undefined (so section stays hidden)
 */
export function isDemo<T>(
  isPreview: boolean | undefined,
  userValue: T | undefined | null,
  demoFallback?: T
): T | undefined {
  if (userValue !== undefined && userValue !== null) {
    if (typeof userValue === 'string') {
      if (userValue.trim().length > 0) return userValue;
    } else if (Array.isArray(userValue)) {
      if (userValue.length > 0) return userValue;
    } else {
      return userValue;
    }
  }

  if (isPreview && demoFallback !== undefined) {
    return demoFallback;
  }

  return undefined;
}
