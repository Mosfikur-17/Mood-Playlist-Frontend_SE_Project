import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = 'alex@moodplaylist.dev';
  password = 'password123';
  error = '';

  submit(): void {
    this.error = '';
    if (!this.auth.login(this.email.trim(), this.password)) {
      this.error = 'Please enter a valid email and a password with at least 4 characters.';
      return;
    }
    this.router.navigate(['/dashboard']);
  }

  loginAsDemo(): void {
    this.auth.loginAsDemo();
    this.router.navigate(['/dashboard']);
  }
}
