import { Injectable, signal } from '@angular/core';
import { Playlist, Track } from '../models/playlist.model';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  readonly playlists = signal<Playlist[]>([
    {
      id: 'deep-focus',
      title: 'Deep Focus',
      mood: 'Focused',
      genre: 'Lo-Fi',
      description: 'Minimal beats and calm textures for long coding sessions.',
      tracks: 12,
      duration: '2h 18m',
      accent: 'focus',
      coverColor: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      tags: ['Focus', 'Lo-Fi', 'Instrumental'],
      tracksList: [
        { id: 'df-1', title: 'Midnight Terminal', artist: 'LoFi Coder', duration: '3:45', mood: 'Focused', bpm: 70, audioFreq: 220 },
        { id: 'df-2', title: 'Compiler Pass', artist: 'Async Waves', duration: '4:10', mood: 'Focused', bpm: 72, audioFreq: 240 },
        { id: 'df-3', title: 'Binary Stream', artist: 'SynthPulse', duration: '3:20', mood: 'Focused', bpm: 68, audioFreq: 210 },
        { id: 'df-4', title: 'Stack Overflow Serenade', artist: 'DevHarmonics', duration: '3:55', mood: 'Focused', bpm: 74, audioFreq: 230 },
        { id: 'df-5', title: 'Coffee & Algorithms', artist: 'Byte Beats', duration: '4:30', mood: 'Focused', bpm: 75, audioFreq: 250 }
      ]
    },
    {
      id: 'happy-flow',
      title: 'Happy Flow',
      mood: 'Happy',
      genre: 'Indie Pop',
      description: 'Bright, upbeat tracks to keep your coding energy high.',
      tracks: 14,
      duration: '1h 52m',
      accent: 'happy',
      coverColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #feada6 100%)',
      tags: ['Happy', 'Upbeat', 'Indie'],
      tracksList: [
        { id: 'hf-1', title: 'Sunlit Refactor', artist: 'Bright Code', duration: '3:15', mood: 'Happy', bpm: 110, audioFreq: 294 },
        { id: 'hf-2', title: 'First Deployment', artist: 'Sunny Side', duration: '3:40', mood: 'Happy', bpm: 115, audioFreq: 310 },
        { id: 'hf-3', title: 'PR Approved', artist: 'Pixel Joy', duration: '2:58', mood: 'Happy', bpm: 120, audioFreq: 330 },
        { id: 'hf-4', title: 'Frontend Magic', artist: 'UI Groove', duration: '3:25', mood: 'Happy', bpm: 112, audioFreq: 300 }
      ]
    },
    {
      id: 'calm-code',
      title: 'Calm Code',
      mood: 'Relaxed',
      genre: 'Ambient',
      description: 'Soft ambient soundscapes for peaceful and steady work.',
      tracks: 10,
      duration: '2h 05m',
      accent: 'calm',
      coverColor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      tags: ['Relaxed', 'Ambient', 'Chill'],
      tracksList: [
        { id: 'cc-1', title: 'Oceanic Drift', artist: 'Calm Horizon', duration: '5:10', mood: 'Relaxed', bpm: 60, audioFreq: 196 },
        { id: 'cc-2', title: 'Soft Rain on Glass', artist: 'Nature Tones', duration: '4:45', mood: 'Relaxed', bpm: 58, audioFreq: 185 },
        { id: 'cc-3', title: 'Zen Meditation', artist: 'Mindful State', duration: '6:00', mood: 'Relaxed', bpm: 55, audioFreq: 175 }
      ]
    },
    {
      id: 'energy-mode',
      title: 'Energy Mode',
      mood: 'Energetic',
      genre: 'Electronic',
      description: 'Driving electronic tracks for high-output development.',
      tracks: 16,
      duration: '2h 34m',
      accent: 'energy',
      coverColor: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
      tags: ['Energy', 'Electronic', 'Workout'],
      tracksList: [
        { id: 'em-1', title: 'Cyberpunk Sprint', artist: 'Neon Rush', duration: '3:50', mood: 'Energetic', bpm: 128, audioFreq: 330 },
        { id: 'em-2', title: 'Turbo Release', artist: 'Overclock', duration: '3:30', mood: 'Energetic', bpm: 132, audioFreq: 350 },
        { id: 'em-3', title: 'Hyperloop Coding', artist: 'Vapor Drive', duration: '4:00', mood: 'Energetic', bpm: 130, audioFreq: 340 }
      ]
    },
    {
      id: 'stress-relief',
      title: 'Stress Relief',
      mood: 'Stressed',
      genre: 'Chill',
      description: 'Gentle tracks to reduce distraction and bring you back to flow.',
      tracks: 11,
      duration: '1h 36m',
      accent: 'stress',
      coverColor: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
      tags: ['Stress Relief', 'Chill', 'Piano'],
      tracksList: [
        { id: 'sr-1', title: 'Breathe & Reset', artist: 'Peaceful Mind', duration: '4:15', mood: 'Stressed', bpm: 62, audioFreq: 200 },
        { id: 'sr-2', title: 'Soft Piano Sanctuary', artist: 'Acoustic Soul', duration: '3:50', mood: 'Stressed', bpm: 60, audioFreq: 190 },
        { id: 'sr-3', title: 'Warm Tea', artist: 'Gentle Waves', duration: '4:20', mood: 'Stressed', bpm: 65, audioFreq: 210 }
      ]
    },
    {
      id: 'late-night',
      title: 'Late Night Code',
      mood: 'Sad',
      genre: 'Acoustic',
      description: 'Warm acoustic and piano tracks for quiet coding nights.',
      tracks: 12,
      duration: '1h 58m',
      accent: 'night',
      coverColor: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
      tags: ['Acoustic', 'Piano', 'Night'],
      tracksList: [
        { id: 'ln-1', title: 'Midnight Echoes', artist: 'Nocturne', duration: '4:05', mood: 'Sad', bpm: 64, audioFreq: 175 },
        { id: 'ln-2', title: 'Empty Office Lights', artist: 'City Lights', duration: '3:48', mood: 'Sad', bpm: 66, audioFreq: 180 },
        { id: 'ln-3', title: '3 AM Refactor', artist: 'Solitude Beats', duration: '4:30', mood: 'Sad', bpm: 60, audioFreq: 170 }
      ]
    }
  ]);

  favorites = signal<string[]>(this.loadFavorites());

  toggleFavorite(id: string): void {
    const current = this.favorites();
    const next = current.includes(id)
      ? current.filter(item => item !== id)
      : [...current, id];
    this.favorites.set(next);
    localStorage.setItem('mood_playlist_favorites', JSON.stringify(next));
  }

  isFavorite(id: string): boolean {
    return this.favorites().includes(id);
  }

  getByMood(mood: string): Playlist[] {
    if (!mood || mood.toLowerCase() === 'all') return this.playlists();
    return this.playlists().filter(p => p.mood.toLowerCase() === mood.toLowerCase());
  }

  getById(id: string): Playlist | undefined {
    return this.playlists().find(p => p.id === id);
  }

  addPlaylist(newPl: Partial<Playlist>): Playlist {
    const created: Playlist = {
      id: newPl.id || `pl-${Date.now()}`,
      title: newPl.title || 'Custom Playlist',
      mood: newPl.mood || 'Focused',
      genre: newPl.genre || 'Lo-Fi',
      description: newPl.description || 'Custom user generated coding playlist.',
      tracks: newPl.tracks || 10,
      duration: newPl.duration || '1h 20m',
      accent: newPl.accent || 'focus',
      coverColor: newPl.coverColor || 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      tags: newPl.tags || [newPl.mood || 'Focus', newPl.genre || 'Lo-Fi'],
      tracksList: [
        {
          id: `trk-${Date.now()}-1`,
          title: `${newPl.title || 'Track'} One`,
          artist: 'Custom Artist',
          duration: '3:30',
          mood: newPl.mood || 'Focused',
          bpm: 75,
          audioFreq: 220
        },
        {
          id: `trk-${Date.now()}-2`,
          title: `${newPl.title || 'Track'} Two`,
          artist: 'Custom Artist',
          duration: '4:00',
          mood: newPl.mood || 'Focused',
          bpm: 78,
          audioFreq: 240
        }
      ]
    };
    this.playlists.set([created, ...this.playlists()]);
    return created;
  }

  private loadFavorites(): string[] {
    try {
      const raw = localStorage.getItem('mood_playlist_favorites');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
