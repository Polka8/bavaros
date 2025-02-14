import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private loggedInSubject: BehaviorSubject<boolean>;
  private redirectUrl: string | null = null;

  constructor() {
    this.loggedInSubject = new BehaviorSubject<boolean>(this.checkInitialAuthState());
  }

  private checkInitialAuthState(): boolean {
    return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  login(token: string): void {
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    this.loggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.loggedInSubject.next(false);
    this.redirectUrl = null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }
}