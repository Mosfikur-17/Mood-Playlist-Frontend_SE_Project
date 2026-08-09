import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaylistCardComponent } from "../../shared/playlist-card/playlist-card";
import { PlaylistService } from '../../core/services/playlist.service';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { SessionService } from '../../core/services/session.service';
import { Playlist, Track } from '../../core/models/playlist.model';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, FormsModule, PlaylistCardComponent],
  templateUrl: './playlists.html',
  styleUrl: './playlists.scss'
})
export class PlaylistsComponent {
  readonly playlistService = inject(PlaylistService);
  readonly audioService = inject(AudioPlayerService);
  readonly sessionService = inject(SessionService);

  searchQuery = '';
  selectedMood = 'All';
  showFavoritesOnly = false;

  selectedPlaylistForTracks: Playlist | null = null;

  moodFilters = ['All', 'Focused', 'Happy', 'Relaxed', 'Energetic', 'Sad', 'Stressed'];

  get filteredPlaylists(): Playlist[] {
    let list = this.playlistService.playlists();

    if (this.selectedMood !== 'All') {
      list = list.filter(p => p.mood.toLowerCase() === this.selectedMood.toLowerCase());
    }

    if (this.showFavoritesOnly) {
      list = list.filter(p => this.playlistService.isFavorite(p.id));
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.genre.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  }

  setMoodFilter(mood: string): void {
    this.selectedMood = mood;
  }

  toggleFavoritesOnly(): void {
    this.showFavoritesOnly = !this.showFavoritesOnly;
  }

  openTracksModal(pl: Playlist): void {
    this.selectedPlaylistForTracks = pl;
  }

  closeTracksModal(): void {
    this.selectedPlaylistForTracks = null;
  }

  playTrackFromModal(track: Track, playlist: Playlist, index: number): void {
    this.audioService.playTrack(track, playlist, index);
    this.sessionService.addSession(playlist.mood, `${playlist.title}: ${track.title}`);
  }
}