export interface MusicTrack {
  id: string;
  title: string;
  category: 'wedding' | 'romantic' | 'oriental' | 'classical' | 'birthday';
  url: string;
}

export const PRESET_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'wedding_march',
    title: 'Марш Мендельсона (Классический свадебный)',
    category: 'wedding',
    url: 'https://www.mfiles.co.uk/mp3-downloads/mendelssohn-wedding-march.mp3'
  },
  {
    id: 'canon_in_d',
    title: 'Канон в Ре мажор (Пахельбель / Скрипка & Фортепиано)',
    category: 'romantic',
    url: 'https://www.mfiles.co.uk/mp3-downloads/pachelbel-canon-in-d.mp3'
  },
  {
    id: 'romantic_air',
    title: 'Ария на струне Со (И.С. Бах / Нежная романтика)',
    category: 'romantic',
    url: 'https://www.mfiles.co.uk/mp3-downloads/bach-air-on-the-g-string.mp3'
  },
  {
    id: 'tchaikovsky_waltz',
    title: 'Вальс Цветов (Чайковский / Торжественная мелодия)',
    category: 'classical',
    url: 'https://www.mfiles.co.uk/mp3-downloads/tchaikovsky-waltz-of-the-flowers.mp3'
  },
  {
    id: 'mozart_night_music',
    title: 'Маленькая ночная серенада (Моцарт / Струнная классика)',
    category: 'classical',
    url: 'https://www.mfiles.co.uk/mp3-downloads/mozart-eine-kleine-nachtmusik-1st-movement.mp3'
  },
  {
    id: 'festive_hornpipe',
    title: 'Праздничный марш (Гендель / Торжество & День рождения)',
    category: 'birthday',
    url: 'https://www.mfiles.co.uk/mp3-downloads/handel-water-music-hornpipe.mp3'
  }
];

export const DEFAULT_MUSIC_TRACK = PRESET_MUSIC_TRACKS[0];

export function getMusicTrackTitle(url?: string): string {
  if (!url) return DEFAULT_MUSIC_TRACK.title;
  const found = PRESET_MUSIC_TRACKS.find(t => t.url === url);
  if (found) return found.title;
  if (url.includes('/') || url.includes('\\')) {
    const filename = url.split(/[/\\]/).pop();
    return filename ? `Загруженный трек: ${filename}` : 'Пользовательский трек';
  }
  return 'Фоновая мелодия';
}
