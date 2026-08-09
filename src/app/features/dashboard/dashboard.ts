import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PlaylistService } from '../../core/services/playlist.service';
import { SessionService } from '../../core/services/session.service';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { PlaylistCardComponent } from '../../shared/playlist-card/playlist-card';
import { Playlist } from '../../core/models/playlist.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PlaylistCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  readonly auth = inject(AuthService);
  readonly playlistService = inject(PlaylistService);
  readonly sessionService = inject(SessionService);
  readonly audioService = inject(AudioPlayerService);

  get favoritePlaylists(): Playlist[] {
    const favIds = this.playlistService.favorites();
    return this.playlistService.playlists().filter(p => favIds.includes(p.id));
  }

  playPlaylist(pl: Playlist): void {
    this.audioService.playPlaylist(pl);
    this.sessionService.addSession(pl.mood, pl.title);
  }
}
