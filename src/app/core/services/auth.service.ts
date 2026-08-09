import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment.development';

export interface TokenResponseDto {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    favorite_mood?: string;
    favorite_genre?: string;
    bio?: string;
    joined_date?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly storageKey = 'mood_playlist_user';
  private readonly tokenKey = 'mood_playlist_token';

  private readonly userSignal = signal<User | null>(this.loadUser());

  readonly user = computed(() => this.userSignal());
  readonly isLoggedIn = computed(() => !!this.userSignal());

  login(email: string, password: string): boolean {
    if (!email || !password || password.length < 4) return false;

    // Instant optimistic update with demo user fallback
    const name = email.split('@')[0] || 'Demo User';
    const fallbackUser: User = {
      id: 'usr-demo-1',
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      favoriteMood: 'Focused',
      favoriteGenre: 'Lo-Fi',
      bio: 'Coding enthusiast & synth wave listener.',
      joinedDate: 'August 2026'
    };
    this.setUserSession(fallbackUser);

    // Call FastAPI auth endpoint
    this.http.post<TokenResponseDto>(`${this.baseUrl}/auth/login`, { email, password }).pipe(
      catchError(err => {
        console.warn('Backend login fallback: using local session', err);
        return of(null);
      })
    ).subscribe(res => {
      if (res && res.user) {
        localStorage.setItem(this.tokenKey, res.access_token);
        const mappedUser: User = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          username: res.user.name.toLowerCase().replace(/\s+/g, '_'),
          favoriteMood: res.user.favorite_mood || 'Focused',
          favoriteGenre: res.user.favorite_genre || 'Lo-Fi',
          bio: res.user.bio || 'Music-powered developer.',
          joinedDate: res.user.joined_date || 'August 2026'
        };
        this.setUserSession(mappedUser);
      }
    });

    return true;
  }

  loginAsDemo(): void {
    this.login('alex@moodplaylist.dev', 'password123');
  }

  register(name: string, email: string, password: string): boolean {
    if (!name || !email || password.length < 4) return false;

    const fallbackUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      favoriteMood: 'Focused',
      favoriteGenre: 'Lo-Fi',
      bio: 'Music-powered developer.',
      joinedDate: 'August 2026'
    };
    this.setUserSession(fallbackUser);

    this.http.post<TokenResponseDto>(`${this.baseUrl}/auth/register`, { name, email, password }).pipe(
      catchError(err => {
        console.warn('Backend register fallback: using local session', err);
        return of(null);
      })
    ).subscribe(res => {
      if (res && res.user) {
        localStorage.setItem(this.tokenKey, res.access_token);
        const mappedUser: User = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          username: res.user.name.toLowerCase().replace(/\s+/g, '_'),
          favoriteMood: res.user.favorite_mood || 'Focused',
          favoriteGenre: res.user.favorite_genre || 'Lo-Fi',
          bio: res.user.bio || 'Music-powered developer.',
          joinedDate: res.user.joined_date || 'August 2026'
        };
        this.setUserSession(mappedUser);
      }
    });

    return true;
  }

  updateProfile(changes: Partial<User>): void {
    const current = this.userSignal();
    if (!current) return;
    const updated = { ...current, ...changes };
    this.setUserSession(updated);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.tokenKey);
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setUserSession(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.userSignal.set(user);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) return JSON.parse(raw) as User;
      const defaultUser: User = {
        id: 'usr-demo-1',
        name: 'Alex Rivera',
        email: 'alex@moodplaylist.dev',
        username: 'alex_coder',
        favoriteMood: 'Focused',
        favoriteGenre: 'Lo-Fi',
        bio: 'Fullstack engineer coding with ambient & lofi beats.',
        joinedDate: 'August 2026'
      };
      localStorage.setItem(this.storageKey, JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return null;
    }
  }
}
