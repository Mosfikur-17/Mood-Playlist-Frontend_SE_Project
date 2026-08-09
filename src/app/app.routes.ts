import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

import { HomeComponent } from './features/home/home';
import { LoginComponent } from './features/login/login';
import { RegisterComponent } from './features/register/register';
import { DashboardComponent } from './features/dashboard/dashboard';
import { PlaylistsComponent } from './features/playlists/playlists';
import { MoodAnalysisComponent } from './features/mood-analysis/mood-analysis';
import { HistoryComponent } from './features/history/history';
import { ProfileComponent } from './features/profile';
import { SettingsComponent } from './features/settings/settings';
import { ContactComponent } from './features/contact/contact';
import { FaqComponent } from './features/faq/faq';
import { AdminComponent } from './features/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'playlists', component: PlaylistsComponent },
  { path: 'mood-analysis', component: MoodAnalysisComponent },
  { path: 'history', component: HistoryComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'home' }
];
