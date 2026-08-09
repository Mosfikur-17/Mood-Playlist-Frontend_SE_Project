import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioPlayerService, AmbientSoundType } from '../../core/services/audio-player.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.scss'
})
export class AudioPlayerComponent {
  readonly audioService = inject(AudioPlayerService);

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  onSeekChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.audioService.seek(val);
  }

  onVolumeChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.audioService.setVolume(val);
  }

  setAmbient(type: AmbientSoundType): void {
    this.audioService.setAmbientSound(type);
  }
}
