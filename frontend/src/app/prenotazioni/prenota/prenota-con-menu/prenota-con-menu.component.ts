import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrenotazioniService } from '../../../shared/services/prenotazioni.service';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-prenota-con-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3>Seleziona i Piatti dal Menù</h3>
    <div *ngFor="let piatto of menu">
      <p>{{ piatto.nome }} - {{ piatto.prezzo | currency }}</p>
      <label>Quantità:</label>
      <input type="number" [(ngModel)]="piatto.quantita" name="quantita{{piatto.id}}" min="0" />
    </div>
    <hr />
    <form (ngSubmit)="effettuaPrenotazione()">
      <label>Numero Posti:</label>
      <input type="number" [(ngModel)]="numeroPosti" name="numeroPosti" required />
      
      <label>Note aggiuntive:</label>
      <textarea [(ngModel)]="note" name="note"></textarea>
      
      <button type="submit">Prenota con Menu</button>
    </form>
  `,
  styles: [`
    div { margin-bottom: 10px; }
    form {
      max-width: 400px;
      margin: 20px auto;
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
export class PrenotaConMenuComponent {
  menu: any[] = []; // Sarà caricato dal MenuService
  numeroPosti: number = 1;
  note: string = '';

  constructor(
    private menuService: MenuService,
    private prenotazioniService: PrenotazioniService
  ) {}

  ngOnInit(): void {
    this.caricaMenu();
  }

  caricaMenu(): void {
    this.menuService.getMenu().subscribe(
      data => {
        // Assumi che ogni piatto non abbia quantità iniziale
        this.menu = data.map(piatto => ({ ...piatto, quantita: 0 }));
      },
      error => console.error('Errore nel caricamento del menù', error)
    );
  }

  effettuaPrenotazione(): void {
    // Filtra i piatti scelti (quantità > 0)
    const piattiSelezionati = this.menu.filter(p => p.quantita > 0);
    const prenotazione = {
      numero_posti: this.numeroPosti,
      note_aggiuntive: this.note,
      piatti: piattiSelezionati
    };

    this.prenotazioniService.effettuaPrenotazioneConMenu(prenotazione).subscribe(
      response => console.log('Prenotazione con menu effettuata', response),
      error => console.error('Errore nella prenotazione con menu', error)
    );
  }
}
