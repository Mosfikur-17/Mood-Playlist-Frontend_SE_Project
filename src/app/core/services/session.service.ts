import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface MoodSession {
  id: string;
  date: string;
  mood: string;
  playlist: string;
  duration: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly key = 'mood_playlist_sessions';
  readonly sessions = signal<MoodSession[]>(this.load());

  readonly totalSessions = computed(() => this.sessions().length);
  readonly topMood = computed(() => {
    const list = this.sessions();
    if (list.length === 0) return 'Focused';
    const counts: Record<string, number> = {};
    list.forEach(s => counts[s.mood] = (counts[s.mood] || 0) + 1);
    let top = 'Focused';
    let max = 0;
    for (const m in counts) {
      if (counts[m] > max) {
        max = counts[m];
        top = m;
      }
    }
    return top;
  });

  addSession(mood: string, playlist: string, durationStr = '45 min'): void {
    const item: MoodSession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood,
      playlist,
      duration: durationStr
    };
    const next = [item, ...this.sessions()];
    this.sessions.set(next);
    localStorage.setItem(this.key, JSON.stringify(next));

    const token = localStorage.getItem('mood_playlist_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    this.http.post(`${this.baseUrl}/moods`, {
      mood,
      playlist,
      duration: durationStr,
      intensity: 5
    }, { headers }).pipe(catchError(() => of(null))).subscribe();
  }

  clear(): void {
    this.sessions.set([]);
    localStorage.removeItem(this.key);
  }

  private load(): MoodSession[] {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw) return JSON.parse(raw);
      // Demo initial sessions
      const initial: MoodSession[] = [
        {
          id: 'sess-1',
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
          mood: 'Focused',
          playlist: 'Deep Focus',
          duration: '52 min'
        },
        {
          id: 'sess-2',
          date: new Date(Date.now() - 3600000 * 26).toISOString(),
          mood: 'Relaxed',
          playlist: 'Calm Code',
          duration: '1h 12m'
        },
        {
          id: 'sess-3',
          date: new Date(Date.now() - 3600000 * 50).toISOString(),
          mood: 'Energetic',
          playlist: 'Energy Mode',
          duration: '45 min'
        }
      ];
      localStorage.setItem(this.key, JSON.stringify(initial));
      return initial;
    } catch {
      return [];
    }
  }
}
