import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService, MoodSession } from '../../core/services/session.service';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { PlaylistService } from '../../core/services/playlist.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class HistoryComponent {
  readonly sessionService = inject(SessionService);
  readonly audioService = inject(AudioPlayerService);
  readonly playlistService = inject(PlaylistService);

  replaySession(session: MoodSession): void {
    const matched = this.playlistService.getByMood(session.mood);
    if (matched.length > 0) {
      this.audioService.playPlaylist(matched[0]);
    } else {
      this.audioService.playPlaylist(this.playlistService.playlists()[0]);
    }
  }

  clearAll(): void {
    if (confirm('Are you sure you want to clear your listening history log?')) {
      this.sessionService.clear();
    }
  }
}