import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Playlist, Track } from '../models/playlist.model';
import { environment } from '../../../environments/environment.development';

export interface RecommendationResponseDto {
  mood: string;
  query: string;
  playlist_title: string;
  description: string;
  videos: {
    video_id: string;
    title: string;
    thumbnail: string;
    channel_title: string;
    description?: string;
    duration?: string;
    bpm?: number;
    audio_freq?: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  generateRecommendation(mood: string, intensity = 5, task = 'Coding'): Observable<Playlist> {
    const token = localStorage.getItem('mood_playlist_token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
    return this.http.post<RecommendationResponseDto>(`${this.baseUrl}/recommendations/generate`, {
      mood,
      intensity,
      task
    }, { headers }).pipe(
      map(res => this.transformToPlaylist(res)),
      catchError(err => {
        console.warn('Backend recommendation API unreachable, using fallback transformer.', err);
        return of(this.getFallbackPlaylist(mood));
      })
    );
  }

  searchYouTube(query: string, mood = 'focused'): Observable<any> {
    return this.http.get(`${this.baseUrl}/youtube/search`, {
      params: { query, mood }
    }).pipe(
      catchError(() => of({ videos: [] }))
    );
  }

  private transformToPlaylist(dto: RecommendationResponseDto): Playlist {
    const tracksList: Track[] = (dto.videos || []).map((v, idx) => ({
      id: v.video_id,
      title: v.title,
      artist: v.channel_title || 'YouTube Music',
      duration: v.duration || '3:45',
      mood: dto.mood,
      bpm: v.bpm || 72,
      audioFreq: v.audio_freq || 220
    }));

    return {
      id: `rec-${dto.mood.toLowerCase()}-${Date.now()}`,
      title: dto.playlist_title || `${dto.mood} Flow`,
      mood: dto.mood,
      genre: 'YouTube Mix',
      description: dto.description || `Curated YouTube music for ${dto.mood} coding session.`,
      tracks: tracksList.length,
      duration: `${tracksList.length * 4}m`,
      accent: this.getAccentForMood(dto.mood),
      coverColor: this.getCoverColorForMood(dto.mood),
      tags: [dto.mood, 'YouTube', 'Coding'],
      tracksList
    };
  }

  private getFallbackPlaylist(mood: string): Playlist {
    const cleanMood = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase();
    return {
      id: `fallback-${cleanMood.toLowerCase()}`,
      title: `${cleanMood} Coding Stream`,
      mood: cleanMood,
      genre: 'Lo-Fi',
      description: `Curated ${cleanMood} music stream for developer focus.`,
      tracks: 5,
      duration: '22m',
      accent: this.getAccentForMood(mood),
      coverColor: this.getCoverColorForMood(mood),
      tags: [cleanMood, 'Lo-Fi', 'Developer'],
      tracksList: [
        { id: 'fb-1', title: 'Lofi Hip Hop Radio', artist: 'Lofi Girl', duration: '3:45', mood: cleanMood, bpm: 70, audioFreq: 220 },
        { id: 'fb-2', title: 'Midnight Terminal', artist: 'LoFi Coder', duration: '4:12', mood: cleanMood, bpm: 72, audioFreq: 230 }
      ]
    };
  }

  private getAccentForMood(mood: string): string {
    const m = mood.toLowerCase();
    if (m.includes('focus')) return 'focus';
    if (m.includes('happy')) return 'happy';
    if (m.includes('relax') || m.includes('calm')) return 'calm';
    if (m.includes('energ')) return 'energy';
    if (m.includes('sad')) return 'night';
    if (m.includes('stress')) return 'stress';
    return 'focus';
  }

  private getCoverColorForMood(mood: string): string {
    const m = mood.toLowerCase();
    if (m.includes('happy')) return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
    if (m.includes('relax')) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    if (m.includes('energ')) return 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)';
    if (m.includes('sad')) return 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)';
    if (m.includes('stress')) return 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)';
    return 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)';
  }
}
