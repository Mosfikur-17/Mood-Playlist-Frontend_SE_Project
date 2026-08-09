import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {
  name = '';
  email = '';
  subject = 'General Feedback';
  message = '';
  sent = false;

  subjects = ['General Feedback', 'Feature Request', 'Playlist Suggestion', 'Bug Report', 'API Integration'];

  submit(): void {
    if (!this.name.trim() || !this.email.trim() || !this.message.trim()) return;
    this.sent = true;
    setTimeout(() => {
      this.name = '';
      this.email = '';
      this.message = '';
      this.sent = false;
    }, 4000);
  }
}
