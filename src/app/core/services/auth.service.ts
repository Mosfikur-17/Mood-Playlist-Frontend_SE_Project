import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'mood_playlist_user';
  private readonly userSignal = signal<User | null>(this.loadUser());

  readonly user = computed(() => this.userSignal());
  readonly isLoggedIn = computed(() => !!this.userSignal());

  login(email: string, password: string): boolean {
    if (!email || !password || password.length < 4) return false;

    const existing = this.loadUser();
    const name = email.split('@')[0] || 'Demo User';
    const user: User = existing ?? {
      id: crypto.randomUUID(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      favoriteMood: 'Focused',
      favoriteGenre: 'Lo-Fi',
      bio: 'Coding enthusiast & synth wave listener.',
      joinedDate: 'August 2026'
    };

    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.userSignal.set(user);
    return true;
  }

  loginAsDemo(): void {
    this.login('demo@moodplaylist.dev', 'password123');
  }

  register(name: string, email: string, password: string): boolean {
    if (!name || !email || password.length < 4) return false;

    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      favoriteMood: 'Focused',
      favoriteGenre: 'Lo-Fi',
      bio: 'Music-powered developer.',
      joinedDate: 'August 2026'
    };

    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.userSignal.set(user);
    return true;
  }

  updateProfile(changes: Partial<User>): void {
    const current = this.userSignal();
    if (!current) return;
    const updated = { ...current, ...changes };
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    this.userSignal.set(updated);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.userSignal.set(null);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) return JSON.parse(raw) as User;
      // Default demo user for seamless out-of-the-box experience
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
