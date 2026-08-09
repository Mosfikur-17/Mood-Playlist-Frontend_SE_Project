import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MoodCardComponent } from '../../shared/mood-card/mood-card';
import { PlaylistCardComponent } from '../../shared/playlist-card/playlist-card';
import { PlaylistService } from '../../core/services/playlist.service';
import { AudioPlayerService, AmbientSoundType } from '../../core/services/audio-player.service';
import { SessionService } from '../../core/services/session.service';
import { Playlist } from '../../core/models/playlist.model';

@Component({
  selector: 'app-mood-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MoodCardComponent,
    PlaylistCardComponent
  ],
  templateUrl: './mood-analysis.html',
  styleUrl: './mood-analysis.scss'
})
export class MoodAnalysisComponent {
  readonly playlistService = inject(PlaylistService);
  readonly audioService = inject(AudioPlayerService);
  readonly sessionService = inject(SessionService);
  readonly router = inject(Router);

  selectedMood = 'Focused';
  energyLevel: 'low' | 'medium' | 'high' = 'medium';
  taskType = 'Coding';
  selectedAmbient: AmbientSoundType = 'off';

  recommendedPlaylist: Playlist | null = null;
  isAnalyzing = false;
  analysisDone = false;

  moods = [
    { name: 'Focused', icon: '◎', description: 'Ready for deep concentration & complex logic.' },
    { name: 'Happy', icon: '☀', description: 'Upbeat and positive coding energy.' },
    { name: 'Relaxed', icon: '☁', description: 'Smooth, peaceful and comfortable pace.' },
    { name: 'Energetic', icon: '⚡', description: 'High output, fast refactoring energy.' },
    { name: 'Sad', icon: '☂', description: 'Quiet late night acoustic reflection.' },
    { name: 'Stressed', icon: '🧘', description: 'Need tension relief & gentle focus.' }
  ];

  tasks = ['Coding', 'Debugging', 'System Design', 'Writing Docs', 'Learning'];

  selectMood(mood: string): void {
    this.selectedMood = mood;
  }

  setEnergy(level: 'low' | 'medium' | 'high'): void {
    this.energyLevel = level;
  }

  setTask(task: string): void {
    this.taskType = task;
  }

  setAmbient(type: AmbientSoundType): void {
    this.selectedAmbient = type;
  }

  runAnalysis(): void {
    this.isAnalyzing = true;
    this.analysisDone = false;

    setTimeout(() => {
      const matched = this.playlistService.getByMood(this.selectedMood);
      this.recommendedPlaylist = matched.length > 0 ? matched[0] : this.playlistService.playlists()[0];
      this.isAnalyzing = false;
      this.analysisDone = true;
    }, 600);
  }

  startSession(): void {
    if (this.recommendedPlaylist) {
      this.audioService.setAmbientSound(this.selectedAmbient);
      this.audioService.playPlaylist(this.recommendedPlaylist);
      this.sessionService.addSession(this.selectedMood, this.recommendedPlaylist.title, '45 min');
      this.router.navigate(['/dashboard']);
    }
  }
}