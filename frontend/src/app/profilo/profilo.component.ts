import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  // Importa i moduli necessari per *ngIf, *ngFor e [(ngModel)]
  imports: [CommonModule, FormsModule],
  // Template inline
  template: `
    <div class="profile-container" *ngIf="user; else noData">
      <h2>Profilo Utente</h2>
      <p><strong>Nome:</strong> {{ user.nome }}</p>
      <p><strong>Cognome:</strong> {{ user.cognome }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Data Creazione:</strong> {{ user.created_at | date:'medium' }}</p>
    </div>
    <ng-template #noData>
      <p>Caricamento dati in corso...</p>
    </ng-template>
    
    <!-- Sezioni cliccabili -->
    <div class="sections-row">
      <div class="section-box" (click)="showActiveSection()">
        <h3>Prenotazioni Attive</h3>
      </div>
      <div class="section-box" (click)="showAllSection()">
        <h3>Tutte le Prenotazioni</h3>
      </div>
    </div>
    
    <!-- Contenuto dinamico a seconda della sezione selezionata -->
    <div class="reservations-container" *ngIf="activeSection === 'active'">
      <h4>Prenotazioni Attive</h4>
      <!-- Qui mostrerai la lista delle prenotazioni attive -->
      <div *ngFor="let prenotazione of prenotazioniAttive">
        <p>ID: {{ prenotazione.id }} - Data: {{ prenotazione.data }} - ...</p>
      </div>
    </div>
    
    <div class="reservations-container" *ngIf="activeSection === 'all'">
      <h4>Tutte le Prenotazioni</h4>
      <!-- Barra di ricerca / filtro -->
      <input type="text" placeholder="Filtra prenotazioni..." [(ngModel)]="filtro" (input)="filtraPrenotazioni()" />
      
      <div *ngFor="let prenotazione of prenotazioniFiltrate">
        <p>ID: {{ prenotazione.id }} - Data: {{ prenotazione.data }} - ...</p>
      </div>
    </div>
  `,
  // Stili inline
  styles: [`
    .profile-container {
      margin: 20px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background: #f9f9f9;
    }
    .sections-row {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }
    .section-box {
      width: 200px;
      height: 100px;
      background-color: #eee;
      margin: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 4px;
    }
    .section-box:hover {
      background-color: #ddd;
    }
    .reservations-container {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid #ccc;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any;

  // Variabili per gestire la sezione attiva
  activeSection: 'active' | 'all' | null = null;

  // Prenotazioni
  prenotazioniAttive: any[] = [];
  prenotazioniTutte: any[] = [];

  // Per il filtro
  filtro: string = '';
  prenotazioniFiltrate: any[] = [];
constructor(private authService: AuthService) { }
  ngOnInit(): void {
    // Esempio: user mock
    this.user = this.authService.getUserInfo();

    // Esempio di prenotazioni
    this.prenotazioniAttive = [
      { id: 1, data: '2025-03-14', stato: 'attiva' },
      { id: 2, data: '2025-03-20', stato: 'attiva' }
    ];
    this.prenotazioniTutte = [
      ...this.prenotazioniAttive,
      { id: 3, data: '2025-02-28', stato: 'completata' },
      { id: 4, data: '2025-01-10', stato: 'annullata' }
    ];

    // All'inizio, copiamo tutte le prenotazioni
    this.prenotazioniFiltrate = [...this.prenotazioniTutte];
  }

  // Se clicco sulla sezione di sinistra
  showActiveSection() {
    this.activeSection = 'active';
  }

  // Se clicco sulla sezione di destra
  showAllSection() {
    this.activeSection = 'all';
  }

  // Funzione per filtrare le prenotazioni in base a "filtro"
  filtraPrenotazioni() {
    if (!this.filtro) {
      this.prenotazioniFiltrate = [...this.prenotazioniTutte];
    } else {
      this.prenotazioniFiltrate = this.prenotazioniTutte.filter(p =>
        // Filtra come preferisci: per data, stato, id, etc.
        p.data.includes(this.filtro) || p.stato.includes(this.filtro)
      );
    }
  }
}
