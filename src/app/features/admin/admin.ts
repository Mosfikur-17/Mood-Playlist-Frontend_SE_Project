import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaylistService } from '../../core/services/playlist.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent {
  readonly playlistService = inject(PlaylistService);
  readonly sessionService = inject(SessionService);

  newTitle = '';
  newMood = 'Focused';
  newGenre = 'Lo-Fi';
  newDescription = '';
  newTracks = 12;
  coverColor = 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)';

  message = '';

  moodOptions = ['Focused', 'Happy', 'Relaxed', 'Energetic', 'Sad', 'Stressed'];
  genreOptions = ['Lo-Fi', 'Ambient', 'Indie Pop', 'Electronic', 'Acoustic', 'Chill'];

  addPlaylist(): void {
    if (!this.newTitle.trim()) {
      this.message = 'Please enter a playlist title.';
      return;
    }

    const created = this.playlistService.addPlaylist({
      title: this.newTitle.trim(),
      mood: this.newMood,
      genre: this.newGenre,
      description: this.newDescription.trim() || 'Custom synthesized developer soundtrack.',
      tracks: this.newTracks,
      coverColor: this.coverColor
    });

    this.message = `🎉 Playlist "${created.title}" successfully created and added to global catalog!`;
    this.newTitle = '';
    this.newDescription = '';
    setTimeout(() => this.message = '', 4000);
  }
}
