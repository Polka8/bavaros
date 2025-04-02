// profilo.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { PrenotazioniService } from '../shared/services/prenotazioni.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container" *ngIf="user; else loadingTemplate">
      <h2>Profilo Utente</h2>
      <p><strong>Nome:</strong> {{ user.nome }}</p>
      <p><strong>Cognome:</strong> {{ user.cognome }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Data di registrazione:</strong> {{ user.creato_il | date:'medium' }}</p>
      <div class="sections-row">
        <div class="section-box" (click)="setSection('active')">
          <h3>Prenotazioni Attive</h3>
        </div>
        <div class="section-box" (click)="setSection('all')">
          <h3>Tutte le Prenotazioni</h3>
        </div>
      </div>
      <div class="reservations-container" *ngIf="activeSection === 'active'">
        <h4>Prenotazioni Attive</h4>
        <div *ngFor="let prenotazione of prenotazioniAttive">
          <p>
            <strong>ID:</strong> {{ prenotazione.id_prenotazione }} -
            <strong>Data:</strong> {{ prenotazione.data_prenotata | date:'short' }} -
            <strong>Stato:</strong> {{ prenotazione.stato }}
          </p>
          <button (click)="cancelReservation(prenotazione.id_prenotazione)">Annulla</button>
        </div>
      </div>
      <div class="reservations-container" *ngIf="activeSection === 'all'">
        <h4>Tutte le Prenotazioni</h4>
        <!-- Filtro -->
        <div class="filters">
          <input type="date" [(ngModel)]="filterDate" (change)="applyFilter()" />
          <div>
            <label><input type="checkbox" [(ngModel)]="filterStatus.attiva" (change)="applyFilter()" /> Attiva</label>
            <label><input type="checkbox" [(ngModel)]="filterStatus.annullata" (change)="applyFilter()" /> Annullata</label>
          </div>
          <select [(ngModel)]="sortOrder" (change)="applyFilter()">
            <option value="recent">Più recenti</option>
            <option value="oldest">Più vecchie</option>
          </select>
        </div>
        <div *ngFor="let prenotazione of filteredReservations">
          <p>
            <strong>ID:</strong> {{ prenotazione.id_prenotazione }} -
            <strong>Data:</strong> {{ prenotazione.data_prenotata | date:'short' }} -
            <strong>Stato:</strong> {{ prenotazione.stato }}
          </p>
        </div>
      </div>
    </div>
    <ng-template #loadingTemplate>
      <p>Caricamento dati in corso...</p>
    </ng-template>
  `,
  styles: [`
    .profile-container { margin: 20px; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background: #f9f9f9; }
    .sections-row { display: flex; justify-content: center; margin: 20px 0; }
    .section-box { width: 200px; height: 100px; background-color: #eee; margin: 0 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; }
    .section-box:hover { background-color: #ddd; }
    .reservations-container { margin-top: 20px; padding: 10px; border: 1px solid #ccc; }
    .filters { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
    input[type="date"] { padding: 5px; }
    select { padding: 5px; border-radius: 4px; }
  `]
})
export class ProfileComponent implements OnInit {
  user: any;
  activeSection: 'active' | 'all' = 'active';
  prenotazioniAttive: any[] = [];
  prenotazioniAll: any[] = [];
  filteredReservations: any[] = [];
  filterDate: string = '';
  filterStatus = { attiva: true, annullata: true };
  sortOrder: 'recent' | 'oldest' = 'recent';

  constructor(private authService: AuthService, private prenotazioniService: PrenotazioniService) {}

  ngOnInit(): void {
    this.user = this.authService.getUserInfo();
    if (this.user) {
      this.loadPrenotazioni();
    }
  }

  loadPrenotazioni(): void {
    const userId = Number(this.user.id);
    this.prenotazioniService.getPrenotazioniStorico(userId).subscribe({
      next: data => {
        this.prenotazioniAll = data;
        this.prenotazioniAttive = this.prenotazioniAll.filter(p => p.stato.toLowerCase() === 'attiva');
        this.filteredReservations = [...this.prenotazioniAll];
      },
      error: err => console.error('Errore nel recupero delle prenotazioni', err)
    });
  }

  setSection(section: 'active' | 'all'): void {
    this.activeSection = section;
    if (section === 'all') {
      this.filteredReservations = [...this.prenotazioniAll];
    }
  }

  applyFilter(): void {
    let filtered = [...this.prenotazioniAll];

    if (this.filterDate) {
      const filterDateObj = new Date(this.filterDate);
      filtered = filtered.filter(p => {
        const prenotazioneDate = new Date(p.data_prenotata);
        return prenotazioneDate.toDateString() === filterDateObj.toDateString();
      });
    }

    if (!this.filterStatus.attiva) {
      filtered = filtered.filter(p => p.stato.toLowerCase() !== 'attiva');
    }

    if (!this.filterStatus.annullata) {
      filtered = filtered.filter(p => p.stato.toLowerCase() !== 'annullata');
    }

    filtered.sort(this.getSortFunction());
    this.filteredReservations = filtered;
  }

  getSortFunction(): (a: any, b: any) => number {
    return this.sortOrder === 'recent'
      ? (a, b) => new Date(b.data_prenotata).getTime() - new Date(a.data_prenotata).getTime()
      : (a, b) => new Date(a.data_prenotata).getTime() - new Date(b.data_prenotata).getTime();
  }

  cancelReservation(prenotazioneId: number): void {
    this.prenotazioniService.cancelPrenotazione(prenotazioneId).subscribe({
      next: response => {
        console.log('Prenotazione annullata', response);
        this.loadPrenotazioni();
      },
      error: err => console.error('Errore nell\'annullamento della prenotazione', err)
    });
  }
}
