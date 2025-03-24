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
  
  // Funzione per creare gli headers con il token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Prenotazione "solo posti"
  effettuaPrenotazione(prenotazione: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/prenotazioni`, prenotazione, { headers });
  }

  // Prenotazione con menu
  effettuaPrenotazioneConMenu(prenotazione: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/prenotazioni/menu`, prenotazione, { headers });
  }

  // Recupera lo storico delle prenotazioni dell'utente
  getPrenotazioniStorico(userId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/prenotazioni/storico/${userId}`, { headers });
  }

  // (Opzionale) Cancella una prenotazione attiva (devi aver implementato l'endpoint nel backend)
  cancelPrenotazione(prenotazioneId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/prenotazioni/${prenotazioneId}`, { headers });
  }
}
