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
    return this.http.post(`${environment.apiUrl}/register`, userData).pipe(
      tap(() => console.log('Registrazione avvenuta con successo')),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${environment.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('[DEBUG] Login avvenuto:', response);
        this.loggedIn.next(true);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[DEBUG] Errore Login:', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    this.loggedIn.next(false);
  }
}
