import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FaqItem {
  id: number;
  q: string;
  a: string;
  open?: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss'
})
export class FaqComponent {
  searchQuery = '';

  faqs: FaqItem[] = [
    {
      id: 1,
      q: 'How does the Mood Matrix analysis work?',
      a: 'You can manually select your mood, energy level, programming task, and background noise. The audio engine synthesizes multi-oscillator binaural tones and lo-fi chord progressions matching your mental state.',
      open: true
    },
    {
      id: 2,
      q: 'Does this frontend play real music audio in the browser?',
      a: 'Yes! We built a Web Audio API synthesizer directly into the frontend. When you click Play, harmonic frequencies and pink noise ambient layers (Rain, Ocean, White Noise) play in real time.',
      open: false
    },
    {
      id: 3,
      q: 'Are user profiles and history saved persistently?',
      a: 'Yes. Profile changes, custom playlists created in Admin, saved favorites, and listening session history are synchronized with browser LocalStorage.',
      open: false
    },
    {
      id: 4,
      q: 'Can ML emotion detection or Spotify Web API be integrated?',
      a: 'Absolutely. The frontend architecture separates AudioPlayerService and SessionService cleanly so a Python/FastAPI backend or Spotify OAuth service can easily plug in.',
      open: false
    },
    {
      id: 5,
      q: 'Can I add custom playlists to the catalog?',
      a: 'Yes! Navigate to the Admin Panel from the profile menu to create custom playlists with title, mood, genre, and track count.',
      open: false
    }
  ];

  get filteredFaqs(): FaqItem[] {
    if (!this.searchQuery.trim()) return this.faqs;
    const q = this.searchQuery.toLowerCase().trim();
    return this.faqs.filter(item =>
      item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }

  toggle(item: FaqItem): void {
    item.open = !item.open;
  }
}
