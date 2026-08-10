export interface MusicTrack {
  id: string;
  title: string;
  category: 'wedding' | 'oriental' | 'romantic' | 'classical' | 'birthday';
  url: string;
}

export const PRESET_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'wedding_march',
    title: 'Марш Мендельсона (Классический свадебный)',
    category: 'wedding',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Felix_Mendelssohn_-_Wedding_March.mp3'
  },
  {
    id: 'canon_in_d',
    title: 'Канон в Ре мажор (Пахельбель / Скрипка & Фортепиано)',
    category: 'romantic',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Pachelbel_Canon_in_D_Major.mp3'
  },
  {
    id: 'romantic_air',
    title: 'Ария на струне Со (И.С. Бах / Нежная романтика)',
    category: 'romantic',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Johann_Sebastian_Bach_-_Air_on_the_G_String.mp3'
  },
  {
    id: 'tchaikovsky_waltz',
    title: 'Вальс Цветов (Чайковский / Торжественная мелодия)',
    category: 'classical',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Tchaikovsky_Waltz_of_the_Flowers.mp3'
  },
  {
    id: 'mozart_night_music',
    title: 'Маленькая ночная серенада (Моцарт / Струнная классика)',
    category: 'classical',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Mozart_-_Eine_kleine_Nachtmusik_-_1._Allegro.mp3'
  },
  {
    id: 'festive_hornpipe',
    title: 'Праздничный марш (Гендель / Торжество & День рождения)',
    category: 'birthday',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Handel_-_water_music_-_suite_no._1_in_f_major_hwv_348_-_08_hornpipe.mp3'
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
