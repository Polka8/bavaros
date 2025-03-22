// prenotazioni.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.component';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioniService {
  private apiUrl = environment.apiUrl;  // ad esempio: http://localhost:3000/api

  constructor(private http: HttpClient) {}

  effettuaPrenotazione(prenotazione: any, headers?: HttpHeaders): Observable<any> {
    return this.http.post(`${this.apiUrl}/prenotazioni`, prenotazione, { headers });
  }

  effettuaPrenotazioneConMenu(prenotazione: any, headers?: HttpHeaders): Observable<any> {
    return this.http.post(`${this.apiUrl}/prenotazioni/menu`, prenotazione, { headers });
  }
  
  // Altri metodi...
}
