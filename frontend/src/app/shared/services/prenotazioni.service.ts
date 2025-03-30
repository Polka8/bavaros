// prenotazioni.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environment/environment.component';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioniService {
  private apiUrl = environment.apiUrl;  // ad esempio: http://localhost:3000/api
  
  constructor(private http: HttpClient) {}
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Si è verificato un errore!';
    
    if (error.error instanceof ErrorEvent) {
      // Errore lato client
      errorMessage = `Errore: ${error.error.message}`;
    } else {
      // Errore lato server
      errorMessage = `Codice errore: ${error.status}\nMessaggio: ${error.message}`;
      
      // Gestione specifica per diversi status code
      switch (error.status) {
        case 0:
          errorMessage = 'Connessione al server non riuscita';
          break;
        case 401:
          errorMessage = 'Non autorizzato - Effettua il login';
          break;
        case 403:
          errorMessage = 'Accesso negato - Permessi insufficienti';
          break;
        case 404:
          errorMessage = 'Risorsa non trovata';
          break;
        case 500:
          errorMessage = 'Errore interno del server';
          break;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
  
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
  
  getPrenotazioniCalendario(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  
    return this.http.get(`${this.apiUrl}/calendario`, {
      params,
      headers
    }).pipe(
      catchError(this.handleError)
    );
  }
}


