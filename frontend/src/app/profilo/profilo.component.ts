import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container" *ngIf="user; else noData">
      <h2>Profilo Utente</h2>
      <p><strong>Nome:</strong> {{ user.nome }}</p>
      <p><strong>Cognome:</strong> {{ user.cognome }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Data Creazione:</strong> {{ user.creato_il | date:'medium' }}</p>
    </div>
    <ng-template #noData>
      <p>Caricamento dati in corso...</p>
    </ng-template>
  `,
  styles: [`
    .profile-container {
      margin: 20px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background: #f9f9f9;
    }
    h2 {
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.1rem;
      margin: 0.5rem 0;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    
    this.user = this.authService.getUserInfo();
  }
}

