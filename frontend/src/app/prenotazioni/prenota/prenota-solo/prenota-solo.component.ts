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
      <label>Numero Posti:</label>
      <input type="number" [(ngModel)]="numeroPosti" name="numeroPosti" required />
      
      <label>Note aggiuntive:</label>
      <textarea [(ngModel)]="note" name="note"></textarea>
      
      <button type="submit">Prenota</button>
    </form>
  `,
  styles: [`
    form {
      max-width: 400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
    }
    label {
      margin-top: 10px;
    }
    input, textarea {
      padding: 5px;
      margin-top: 5px;
    }
    button {
      margin-top: 15px;
      padding: 10px;
    }
  `]
})
export class PrenotaSoloComponent {
  numeroPosti: number = 1;
  note: string = '';

  constructor(private prenotazioniService: PrenotazioniService) {}

  effettuaPrenotazione() {
    const prenotazione = {
      numero_posti: this.numeroPosti,
      note_aggiuntive: this.note,
      // Altri campi necessari, ad es. data prenotata, id_utente, etc.
    };

    this.prenotazioniService.effettuaPrenotazione(prenotazione).subscribe(
      response => console.log('Prenotazione effettuata', response),
      error => console.error('Errore nella prenotazione', error)
    );
  }
}
