import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Playlist } from '../../core/models/playlist.model';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { PlaylistService } from '../../core/services/playlist.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-playlist-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist-card.html',
  styleUrl: './playlist-card.scss'
})
export class PlaylistCardComponent {
  readonly audioService = inject(AudioPlayerService);
  readonly playlistService = inject(PlaylistService);
  readonly sessionService = inject(SessionService);

  @Input() playlist?: Playlist;
  @Input() title = '';
  @Input() mood = '';
  @Input() description = '';
  @Input() songCount = 0;

  @Output() favoriteChange = new EventEmitter<string>();
  @Output() viewTracks = new EventEmitter<Playlist>();

  get isCurrentPlaylistPlaying(): boolean {
    const current = this.audioService.currentPlaylist();
    const targetTitle = this.playlist?.title || this.title;
    return !!current && current.title === targetTitle && this.audioService.isPlaying();
  }

  get isFav(): boolean {
    if (this.playlist) {
      return this.playlistService.isFavorite(this.playlist.id);
    }
    return false;
  }

  togglePlay(event?: MouseEvent): void {
    if (event) event.stopPropagation();

    let targetPl = this.playlist;
    if (!targetPl) {
      targetPl = this.playlistService.playlists().find(p => p.title === this.title) || {
        id: `pl-${Date.now()}`,
        title: this.title || 'Coding Beats',
        mood: this.mood || 'Focused',
        genre: 'Lo-Fi',
        description: this.description || 'Coding playlist',
        tracks: this.songCount || 10,
        duration: '1h 30m',
        accent: 'focus',
        tags: [this.mood || 'Focus']
      };
    }

    if (this.isCurrentPlaylistPlaying) {
      this.audioService.togglePlay();
    } else {
      this.audioService.playPlaylist(targetPl);
      this.sessionService.addSession(targetPl.mood, targetPl.title, '45 min');
    }
  }

  toggleFav(event: MouseEvent): void {
    event.stopPropagation();
    if (this.playlist) {
      this.playlistService.toggleFavorite(this.playlist.id);
      this.favoriteChange.emit(this.playlist.id);
    }
  }

  onCardClick(): void {
    if (this.playlist) {
      this.viewTracks.emit(this.playlist);
    } else {
      this.togglePlay();
    }
  }
}