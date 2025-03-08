import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule  // Importa il modulo per MatSnackBar
  ],
  template: `
   <mat-sidenav-container class="sidenav-container">
  <mat-sidenav #sidenav mode="over" class="sidenav">
    <mat-nav-list>
    
        <a mat-list-item routerLink="/login">
          <mat-icon>login</mat-icon>
          <span>Login</span>
        </a>
        <a mat-list-item routerLink="/register">
          <mat-icon>person_add</mat-icon>
          <span>Registrati</span>
        </a>
  

      <ng-template #loggedInMenu>
      
          <a mat-list-item routerLink="/profilo">
            <mat-icon>account_circle</mat-icon>
           
          </a>
          
        
            <a mat-list-item routerLink="/admin/calendario">
              <mat-icon>calendar_today</mat-icon>
              <span>Calendario</span>
            </a>
            <a mat-list-item routerLink="/admin/gestione-menu">
              <mat-icon>restaurant_menu</mat-icon>
              <span>Gestione Menu</span>
            </a>
            <a mat-list-item routerLink="/admin/newsletter">
              <mat-icon>list_alt</mat-icon>
              <span>Newsletter</span>
            </a>
          
       
      </ng-template>

      <a mat-list-item (click)="navigateToPrenota()">
        <mat-icon>event</mat-icon>
        <span>Prenota</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>
          
      
      
      <!-- Contenuto principale -->
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Home</span>
        </mat-toolbar>
        
        <section class="hero-section">
          <div class="hero-content">
            <h1>Benvenuti in Bavaros</h1>
            <button mat-raised-button color="primary">Esplora ora</button>
          </div>
        </section>
      
        <mat-grid-list cols="3" rowHeight="350px" class="features-grid">
          <mat-grid-tile *ngFor="let feature of features">
            <mat-card class="feature-card">
              <mat-icon class="feature-icon" color="primary">{{feature.icon}}</mat-icon>
              <mat-card-title>{{feature.title}}</mat-card-title>
              <mat-card-content>{{feature.description}}</mat-card-content>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    .sidenav {
      width: 250px;
      background: linear-gradient(
        rgba(158, 28, 28, 0.9), 
        rgba(158, 28, 28, 0.7)
      );
      color: white;
    }
    .hero-section {
      background: linear-gradient(
         rgba(158, 28, 28, 0.9), 
        rgba(158, 28, 28, 0.7)
      );
      height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-align: center;
      padding: 1rem;
    }
    .features-grid {
      padding: 4rem 2rem;
      background: #f5f5f5;
    }
    .feature-card {
      padding: 2rem;
      text-align: center;
      width: 90%;
      height: 90%;
    }
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .cta-section {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
    }
    @media (max-width: 768px) {
      .hero-section {
        height: 50vh;
      }
      .features-grid {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class HomeComponent {
  constructor(
    private router: Router, 
    private authService: AuthService,
    private snackBar: MatSnackBar  
  ) {}

  navigateToPrenota() {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Devi effettuare il login per prenotare!', 'Chiudi', {
        duration: 3000
      });
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/prenota']);
    }
  }
  navigateToRegistration() {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Devi essere loggato per prenotare!', 'Chiudi', {
        duration: 3000
      });
      this.router.navigateByUrl('/login'); 
    } else {
      this.router.navigateByUrl('/prenota');
    }
  }
  features = [
    { icon: 'star', title: 'Glovo', Image: '/assets/images/glovo.png', description: 'Consegna in 24/48 ore' },
    { icon: 'verified_user', title: 'Pagamenti Sicuri', description: 'Transazioni criptate' },
    { icon: 'support_agent', title: 'Assistenza 24/7', description: 'Supporto dedicato' }
  ];
}
