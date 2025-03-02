import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environment/environment.component';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private loggedIn = new BehaviorSubject<boolean>(false);
  private redirectUrl: string | null = null;

  isLoggedIn$ = this.loggedIn.asObservable();

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }
register(userData: any) {
  console.log('[DEBUG] Endpoint:', `${environment.apiUrl}/register`);
  console.log('[DEBUG] Dati inviati:', userData);
  
  return this.http.post(`${environment.apiUrl}/register`, userData).pipe(
    tap((response: any) => console.log('[DEBUG] Risposta API:', response)),
    catchError((error: HttpErrorResponse) => {
      console.error('[DEBUG] Errore API:', error);
      return throwError(() => error);
    })
  );
}
}