import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrenotazioniService } from '../../../shared/services/prenotazioni.service';

@Component({
  selector: 'app-prenota-solo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="effettuaPrenotazione()">
      <label>Data Prenotata:</label>
      <input type="datetime-local" [(ngModel)]="dataPrenotata" name="dataPrenotata" required />
      
      <label>Numero Posti:</label>
      <input type="number" [(ngModel)]="numeroPosti" name="numeroPosti" required min="1" />
      
      <label>Note aggiuntive:</label>
      <textarea [(ngModel)]="note" name="note"></textarea>
      
      <button type="submit">Prenota</button>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
  `,
  styles: [`
    form { max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; }
    .error { color: red; margin-top: 10px; }
  `]
})
export class PrenotaSoloComponent {
  dataPrenotata: string = '';
  numeroPosti: number = 1;
  note: string = '';
  errorMessage: string = '';

  constructor(private prenotazioniService: PrenotazioniService) {}

  effettuaPrenotazione() {
    const prenotazione = {
      data_prenotata: this.dataPrenotata,
      numero_posti: this.numeroPosti,
      note_aggiuntive: this.note
    };

    this.prenotazioniService.effettuaPrenotazione(prenotazione).subscribe({
      next: response => {
        console.log('Prenotazione effettuata', response);
        this.errorMessage = '';
      },
      error: err => {
        console.error('Errore nella prenotazione', err);
        this.errorMessage = err.error.message || 'Errore durante la prenotazione';
      }
    });
  }
}
