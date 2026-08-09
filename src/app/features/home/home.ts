import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MoodCardComponent } from '../../shared/mood-card/mood-card';
import { PlaylistCardComponent } from '../../shared/playlist-card/playlist-card';
import { PlaylistService } from '../../core/services/playlist.service';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { SessionService } from '../../core/services/session.service';
import { Playlist } from '../../core/models/playlist.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MoodCardComponent, PlaylistCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  readonly playlistService = inject(PlaylistService);
  readonly audioService = inject(AudioPlayerService);
  readonly sessionService = inject(SessionService);
  readonly router = inject(Router);

  selectedMood = 'Focused';

  moods = [
    { name: 'Focused', icon: '◎', description: 'Deep focus beats for complex programming.' },
    { name: 'Happy', icon: '☀', description: 'Upbeat tracks for bug fixing & high morale.' },
    { name: 'Relaxed', icon: '☁', description: 'Chill lo-fi for calm, steady progress.' },
    { name: 'Energetic', icon: '⚡', description: 'Fast synthwave for late sprint pushes.' },
    { name: 'Sad', icon: '☂', description: 'Warm acoustic & piano for quiet nights.' },
    { name: 'Stressed', icon: '🧘', description: 'Calming sounds to clear your head.' }
  ];

  selectMood(moodName: string): void {
    this.selectedMood = moodName;
    const matching = this.playlistService.getByMood(moodName);
    if (matching.length > 0) {
      this.audioService.playPlaylist(matching[0]);
      this.sessionService.addSession(moodName, matching[0].title);
    }
  }

  playPlaylist(pl: Playlist): void {
    this.audioService.playPlaylist(pl);
    this.sessionService.addSession(pl.mood, pl.title);
  }

  goToMatrix(): void {
    this.router.navigate(['/mood-analysis']);
  }
}
