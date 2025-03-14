import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PrenotaComponent } from './prenotazioni/prenota/prenota.component';
import { CalendarioComponent } from './admin/calendario/calendario.component';
import { NewsletterComponent } from './admin/newsletter/newsletter.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profilo/profilo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profilo', component: ProfileComponent,canActivate: [authGuard] },
  { 
    path: 'prenota', 
    component: PrenotaComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: 'calendario', component: CalendarioComponent },
      { path: 'newsletter', component: NewsletterComponent }
    ]
  }
];
