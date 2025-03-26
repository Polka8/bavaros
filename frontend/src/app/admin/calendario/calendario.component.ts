import { Component, NgModule, OnInit } from '@angular/core';
import { PrenotazioniService } from '../../shared/services/prenotazioni.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, DatePipe,FormsModule],
  template: `
    <div class="calendario-container">
  <!-- ... controlli di navigazione ... -->

  <!-- Eventi del calendario -->
  <div class="events">
    <div *ngFor="let prenotazione of prenotazioni" class="event-item">
      <strong>{{ prenotazione.utente }}</strong> 
      <small>Data: {{ prenotazione.data | date:'dd/MM/yyyy' }}</small>
      <div>
        <span>Posti: {{ prenotazione.numero_posti }}</span> | 
        <span>Stato: {{ prenotazione.stato }}</span>
      </div>
      <div *ngIf="prenotazione.note">Note: {{ prenotazione.note }}</div>
    </div>
  </div>
</div>
  `,
  styles: [`
    .calendario-container { padding: 20px; }
    .controls { margin-bottom: 20px; }
    .filters { margin-bottom: 20px; }
    .event-item { background: #f0f0f0; padding: 10px; margin: 5px 0; border-radius: 4px; }
  `]
})
export class CalendarioComponent implements OnInit {
  prenotazioni: any[] = [];
  vista: 'mese' | 'settimana' | 'giorno' = 'mese';
  anno: number | null = null;
  mese: number | null = null;
  giorno: number | null = null;
  events: any[] = [];  // ✅ Inizializzato come array vuoto
  constructor(private prenotazioniService: PrenotazioniService) {}

  ngOnInit(): void {
    this.loadPrenotazioni();
  }

  loadPrenotazioni(): void {
    this.prenotazioniService.getPrenotazioniCalendario(
      this.vista,
      this.anno ?? undefined,
      this.mese ?? undefined,
      this.giorno ?? undefined
    )
      .subscribe({
        next: data => this.prenotazioni = data,
        error: err => console.error('Errore:', err)
      });
  }

  changeView(view: 'mese' | 'settimana' | 'giorno'): void {
    this.vista = view;
    this.loadPrenotazioni();
  }

  applyFilters(): void {
    this.loadPrenotazioni();
  }
}