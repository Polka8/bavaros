import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrenotazioniService } from '../../../shared/services/prenotazioni.service';
import { Router } from '@angular/router';

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
      
      <button type="submit"
      [disabled]="isSubmitting"
  [class.disabled]="isSubmitting">
  {{ isSubmitting ? 'Prenotazione in corso...' : 'Prenota' }}</button>
      <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
  `,
  styles: [`
    form { max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; }
    .error { color: red; margin-top: 10px; }
     .success { color: green; margin-top: 10px; }
  .error { color: red; margin-top: 10px; }
  .disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  `]
})
export class PrenotaSoloComponent {
  dataPrenotata: string = '';
  numeroPosti: number = 1;
  note: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  constructor(
    private prenotazioniService: PrenotazioniService,
    private router: Router // Aggiungi Router qui
  ) {}


  effettuaPrenotazione() {
    const prenotazioneDate = new Date(this.dataPrenotata);
    const now = new Date();
    if (prenotazioneDate < now) {  
      this.errorMessage = 'La data e ora prenotata non possono essere antecedente all\'ora attuale';
      return;
    }
    const prenotazione = {
      data_prenotata: this.dataPrenotata,
      numero_posti: this.numeroPosti,
      note_aggiuntive: this.note
    };
    if (this.isSubmitting) return; // Blocca click multipli
  
    this.isSubmitting = true; // Disabilita il pulsante

    this.prenotazioniService.effettuaPrenotazione(prenotazione).subscribe({
      next: response => {
        console.log('Prenotazione effettuata', response);
        this.errorMessage = '';
        this.successMessage = 'Prenotazione effettuata con successo'; // Aggiungi
        setTimeout(() => {
          this.router.navigateByUrl('/profilo'); 
          this.isSubmitting = false;
        }, 2000);
      },
      error: err => {
        console.error('Errore nella prenotazione', err);
        this.errorMessage = err.error.message || 'Errore durante la prenotazione';
        this.isSubmitting = false;
      }
    });
  }
}
