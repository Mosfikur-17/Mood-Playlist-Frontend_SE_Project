import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';

  // Survey State
  showSurvey = false;
  surveyStep = 1;
  preferredLanguage = 'JavaScript/TypeScript';
  preferredGenre = 'Lo-Fi';
  preferredIntensity = 'Medium';

  languages = ['JavaScript/TypeScript', 'Python', 'Go/Rust', 'C++/C#', 'Java', 'Other'];
  genres = ['Lo-Fi', 'Ambient', 'Indie Pop', 'Electronic', 'Acoustic', 'Chill'];
  intensities = ['Low', 'Medium', 'High'];

  submit(): void {
    this.error = '';
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    if (!this.auth.register(this.name.trim(), this.email.trim(), this.password)) {
      this.error = 'Please provide a name, valid email and a password with at least 4 characters.';
      return;
    }
    // Success: enter survey instead of navigating immediately
    this.showSurvey = true;
  }

  nextStep(): void {
    if (this.surveyStep < 3) {
      this.surveyStep++;
    } else {
      this.finishSurvey();
    }
  }

  finishSurvey(): void {
    const favoriteMood = this.preferredIntensity === 'High' ? 'Energetic' : this.preferredIntensity === 'Low' ? 'Relaxed' : 'Focused';
    this.auth.updateProfile({
      favoriteMood: favoriteMood,
      favoriteGenre: this.preferredGenre,
      bio: `Coding in ${this.preferredLanguage}. Vibe: ${this.preferredIntensity} intensity ${this.preferredGenre}.`
    });
    this.router.navigate(['/dashboard']);
  }
}
