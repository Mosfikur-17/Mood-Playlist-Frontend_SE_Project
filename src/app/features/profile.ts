import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {
  readonly auth = inject(AuthService);

  editing = false;
  savedToast = false;

  // Editable fields
  name = this.auth.user()?.name || '';
  email = this.auth.user()?.email || '';
  username = this.auth.user()?.username || '';
  favoriteMood = this.auth.user()?.favoriteMood || 'Focused';
  favoriteGenre = this.auth.user()?.favoriteGenre || 'Lo-Fi';
  bio = this.auth.user()?.bio || 'Fullstack developer coding with music.';

  moodOptions = ['Focused', 'Happy', 'Relaxed', 'Energetic', 'Sad', 'Stressed'];
  genreOptions = ['Lo-Fi', 'Ambient', 'Indie Pop', 'Electronic', 'Acoustic', 'Chill'];

  toggleEdit(): void {
    if (this.editing) {
      // Save changes
      this.auth.updateProfile({
        name: this.name,
        email: this.email,
        username: this.username,
        favoriteMood: this.favoriteMood,
        favoriteGenre: this.favoriteGenre,
        bio: this.bio
      });
      this.savedToast = true;
      setTimeout(() => this.savedToast = false, 3000);
    }
    this.editing = !this.editing;
  }
}