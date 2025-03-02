import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router,RouterModule } from '@angular/router';
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
    MatToolbarModule
  ],
  template: `
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

    <section class="cta-section">
      <h2>Pronto a iniziare?</h2>
      <button mat-stroked-button color="accent" (click)="navigateToRegistration()">
  Registrati ora
</button>
    </section>
  `,
  styles: [`
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
      mat-card-title {
        font-size: 1.2rem;
        margin: 1rem 0;
      }
    }

    .feature-icon {
      font-size: 3rem;
      height: 3rem;
      width: 3rem;
      margin-bottom: 1rem;
    }

    .cta-section {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      
      button {
        margin-top: 1.5rem;
        padding: 0 2rem;
      }
    }

    @media (max-width: 768px) {
      .features-grid {
        padding: 2rem 1rem;
        
        mat-grid-list {
          cols: 1;
        }
      }

      .hero-section {
        height: 50vh;
        
        h1 {
          font-size: 1.8rem;
        }
      }
    }
  `]
})
export class HomeComponent {
constructor(private router: Router) {}
navigateToRegistration() {
  this.router.navigateByUrl('/register');
}
  features = [
    { icon: 'star', title: 'Glovo', Image:'/assets/images/glovo.png', description: 'Consegna in 24/48 ore' },
    { icon: 'verified_user', title: 'Pagamenti Sicuri', description: 'Transazioni criptate' },
    { icon: 'support_agent', title: 'Assistenza 24/7', description: 'Supporto dedicato' }
  ];
}
