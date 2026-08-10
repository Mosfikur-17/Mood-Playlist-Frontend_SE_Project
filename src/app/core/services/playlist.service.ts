import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { Playlist, Track } from '../models/playlist.model';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  readonly playlists = signal<Playlist[]>([
    {
      id: 'deep-focus',
      title: 'Deep Focus',
      mood: 'Focused',
      genre: 'Lo-Fi',
      description: 'Minimal beats and calm textures for long coding sessions.',
      tracks: 5,
      duration: '18m',
      accent: 'focus',
      coverColor: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      tags: ['Focus', 'Lo-Fi', 'Instrumental'],
      tracksList: [
        { id: 'jfKfPfyJRdk', title: 'Midnight Terminal', artist: 'LoFi Coder', duration: '3:45', mood: 'Focused', bpm: 70, audioFreq: 220 },
        { id: '5qap5aO4i9A', title: 'Compiler Pass', artist: 'Async Waves', duration: '4:10', mood: 'Focused', bpm: 72, audioFreq: 240 },
        { id: 'DWcJFNfaw9c', title: 'Binary Stream', artist: 'SynthPulse', duration: '3:20', mood: 'Focused', bpm: 68, audioFreq: 210 },
        { id: 'WPni755-Krg', title: 'Stack Overflow Serenade', artist: 'DevHarmonics', duration: '3:55', mood: 'Focused', bpm: 74, audioFreq: 230 }
      ]
    },
    {
      id: 'happy-flow',
      title: 'Happy Flow',
      mood: 'Happy',
      genre: 'Indie Pop',
      description: 'Bright, upbeat tracks to keep your coding energy high.',
      tracks: 4,
      duration: '15m',
      accent: 'happy',
      coverColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #feada6 100%)',
      tags: ['Happy', 'Upbeat', 'Indie'],
      tracksList: [
        { id: '36YnV9STBkc', title: 'Sunlit Refactor', artist: 'Bright Code', duration: '3:15', mood: 'Happy', bpm: 110, audioFreq: 294 },
        { id: 'lP26UCnoH9s', title: 'First Deployment', artist: 'Sunny Side', duration: '3:40', mood: 'Happy', bpm: 115, audioFreq: 310 },
        { id: 'tGj85jK_V7Q', title: 'PR Approved', artist: 'Pixel Joy', duration: '2:58', mood: 'Happy', bpm: 120, audioFreq: 330 }
      ]
    },
    {
      id: 'calm-code',
      title: 'Calm Code',
      mood: 'Relaxed',
      genre: 'Ambient',
      description: 'Soft ambient soundscapes for peaceful and steady work.',
      tracks: 3,
      duration: '14m',
      accent: 'calm',
      coverColor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      tags: ['Relaxed', 'Ambient', 'Chill'],
      tracksList: [
        { id: '1tE-0CSt6aY', title: 'Oceanic Drift', artist: 'Calm Horizon', duration: '5:10', mood: 'Relaxed', bpm: 60, audioFreq: 196 },
        { id: '2OEL4P1rub0', title: 'Soft Rain on Glass', artist: 'Nature Tones', duration: '4:45', mood: 'Relaxed', bpm: 58, audioFreq: 185 }
      ]
    },
    {
      id: 'energy-mode',
      title: 'Energy Mode',
      mood: 'Energetic',
      genre: 'Electronic',
      description: 'Driving electronic tracks for high-output development.',
      tracks: 3,
      duration: '12m',
      accent: 'energy',
      coverColor: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
      tags: ['Energy', 'Electronic', 'Workout'],
      tracksList: [
        { id: 'N3oCS85HmgY', title: 'Cyberpunk Sprint', artist: 'Neon Rush', duration: '3:50', mood: 'Energetic', bpm: 128, audioFreq: 330 },
        { id: '4xDzrJKXOOY', title: 'Turbo Release', artist: 'Overclock', duration: '3:30', mood: 'Energetic', bpm: 132, audioFreq: 350 }
      ]
    },
    {
      id: 'stress-relief',
      title: 'Stress Relief',
      mood: 'Stressed',
      genre: 'Chill',
      description: 'Gentle tracks to reduce distraction and bring you back to flow.',
      tracks: 3,
      duration: '12m',
      accent: 'stress',
      coverColor: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
      tags: ['Stress Relief', 'Chill', 'Piano'],
      tracksList: [
        { id: 'M5QY2_8704o', title: 'Breathe & Reset', artist: 'Peaceful Mind', duration: '4:15', mood: 'Stressed', bpm: 62, audioFreq: 200 },
        { id: 'lTRiuFIWV54', title: 'Soft Piano Sanctuary', artist: 'Acoustic Soul', duration: '3:50', mood: 'Stressed', bpm: 60, audioFreq: 190 }
      ]
    },
    {
      id: 'late-night',
      title: 'Late Night Code',
      mood: 'Sad',
      genre: 'Acoustic',
      description: 'Warm acoustic and piano tracks for quiet coding nights.',
      tracks: 3,
      duration: '12m',
      accent: 'night',
      coverColor: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
      tags: ['Acoustic', 'Piano', 'Night'],
      tracksList: [
        { id: 'S_MOd40zlYU', title: 'Midnight Echoes', artist: 'Nocturne', duration: '4:05', mood: 'Sad', bpm: 64, audioFreq: 175 },
        { id: '77ZozI0rw7w', title: 'Empty Office Lights', artist: 'City Lights', duration: '3:48', mood: 'Sad', bpm: 66, audioFreq: 180 }
      ]
    }
  ]);

  favorites = signal<string[]>(this.loadFavorites());

  constructor() {
    this.syncPlaylistsWithBackend();
  }

  syncPlaylistsWithBackend(): void {
    const headers = this.authHeaders();
    this.http.get<any[]>(`${this.baseUrl}/playlists`, { headers }).pipe(
      catchError(() => of([]))
    ).subscribe(remotePlaylists => {
      if (remotePlaylists && remotePlaylists.length > 0) {
        const transformed: Playlist[] = remotePlaylists.map(p => this.transformBackendPlaylist(p));
        // Merge remote playlists with defaults avoiding duplicates
        const current = this.playlists();
        const merged = [...transformed];
        current.forEach(c => {
          if (!merged.some(m => m.id === c.id)) {
            merged.push(c);
          }
        });
        this.playlists.set(merged);
      }
    });
  }

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
      tracks: newPl.tracksList ? newPl.tracksList.length : (newPl.tracks || 4),
      duration: newPl.duration || '16m',
      accent: newPl.accent || 'focus',
      coverColor: newPl.coverColor || 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      tags: newPl.tags || [newPl.mood || 'Focus', newPl.genre || 'Lo-Fi'],
      tracksList: newPl.tracksList || [
        {
          id: `trk-${Date.now()}-1`,
          title: `${newPl.title || 'Track'} One`,
          artist: 'LoFi Coder',
          duration: '3:30',
          mood: newPl.mood || 'Focused',
          bpm: 75,
          audioFreq: 220
        }
      ]
    };

    this.playlists.set([created, ...this.playlists()]);

    // Async save to backend MongoDB
    const headers = this.authHeaders();
    this.http.post<any>(`${this.baseUrl}/playlists`, {
      title: created.title,
      mood: created.mood.toLowerCase(),
      genre: created.genre,
      description: created.description,
      accent: created.accent,
      cover_color: created.coverColor,
      tags: created.tags,
      videos: (created.tracksList || []).map(t => ({
        video_id: t.id,
        title: t.title,
        thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
        channel_title: t.artist,
        description: t.title,
        duration: t.duration,
        bpm: t.bpm || 72,
        audio_freq: t.audioFreq || 220
      }))
    }, { headers }).pipe(
      catchError(err => {
        console.warn('Playlist save fallback: offline or connection error', err);
        return of(null);
      })
    ).subscribe(saved => {
      if (saved && saved.id) {
        created.id = saved.id;
      }
    });

    return created;
  }

  deletePlaylist(id: string): void {
    this.playlists.set(this.playlists().filter(p => p.id !== id));
    const headers = this.authHeaders();
    this.http.delete(`${this.baseUrl}/playlists/${id}`, { headers }).pipe(
      catchError(() => of(null))
    ).subscribe();
  }

  private transformBackendPlaylist(dto: any): Playlist {
    const videos = dto.videos || [];
    const tracksList: Track[] = videos.map((v: any) => ({
      id: v.video_id || `v-${Math.random()}`,
      title: v.title || 'Coding Track',
      artist: v.channel_title || 'YouTube Music',
      duration: v.duration || '3:45',
      mood: dto.mood || 'Focused',
      bpm: v.bpm || 72,
      audioFreq: v.audio_freq || 220
    }));

    return {
      id: dto.id || `pl-${Math.random()}`,
      title: dto.title || 'Saved Playlist',
      mood: dto.mood || 'Focused',
      genre: dto.genre || 'Lo-Fi',
      description: dto.description || 'Saved coding playlist.',
      tracks: dto.tracks || tracksList.length,
      duration: dto.duration || '16m',
      accent: dto.accent || 'focus',
      coverColor: dto.cover_color || 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      tags: dto.tags || [dto.mood || 'Focused'],
      tracksList
    };
  }

  private loadFavorites(): string[] {
    try {
      const raw = localStorage.getItem('mood_playlist_favorites');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('mood_playlist_token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
