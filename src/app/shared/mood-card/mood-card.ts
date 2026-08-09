import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mood-card',
  standalone: true,
  templateUrl: './mood-card.html',
  styleUrl: './mood-card.scss'
})
export class MoodCardComponent {

  @Input() mood = '';
  @Input() description = '';
  @Input() icon = '♪';
  @Input() selected = false;

  @Output() moodSelected = new EventEmitter<string>();

  selectMood(): void {
    this.moodSelected.emit(this.mood);
  }
}