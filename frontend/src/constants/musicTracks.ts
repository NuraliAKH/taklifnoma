export interface MusicTrack {
  id: string;
  title: string;
  category: 'wedding' | 'oriental' | 'romantic' | 'classical' | 'birthday';
  url: string;
}

// All URLs are verified public domain / CC0 audio from Pixabay (no CORS restrictions)
export const PRESET_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'canon_in_d',
    title: 'Канон в Ре мажор (Романтическая классика)',
    category: 'romantic',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/23/audio_d16737dc28.mp3'
  },
  {
    id: 'romantic_piano',
    title: 'Романтическое фортепиано (Нежная мелодия)',
    category: 'romantic',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3'
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
