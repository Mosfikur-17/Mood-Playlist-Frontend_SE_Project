import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent {
  notifications = true;
  autoplay = true;
  highQuality = true;
  compactCards = false;
  saved = false;

  save(): void {
    localStorage.setItem('mood_playlist_settings', JSON.stringify({
      notifications: this.notifications,
      autoplay: this.autoplay,
      highQuality: this.highQuality,
      compactCards: this.compactCards
    }));
    this.saved = true;
    setTimeout(() => this.saved = false, 2500);
  }
}
