export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  mood: string;
  bpm: number;
  audioFreq?: number;
}

export interface Playlist {
  id: string;
  title: string;
  mood: string;
  genre: string;
  description: string;
  tracks: number;
  duration: string;
  accent: string;
  tags: string[];
  coverColor?: string;
  tracksList?: Track[];
}

