import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.component';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioniService {
  private apiUrl = environment.apiUrl;  // ad esempio: http://localhost:3000/api

  constructor(private http: HttpClient) {}

  // Prenotazione "solo posti"
  effettuaPrenotazione(prenotazione: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/prenotazioni`, prenotazione);
  }

  // Prenotazione con menu (inserisce prenotazione e dettagli prenotazione)
  effettuaPrenotazioneConMenu(prenotazione: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/prenotazioni/menu`, prenotazione);
  }
  
  // Altri metodi per recuperare storico, annullare prenotazioni, ecc.
}
