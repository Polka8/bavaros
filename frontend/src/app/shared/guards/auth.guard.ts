import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.setRedirectUrl(state.url);

  return authService.isLoggedIn$.pipe(
    map(isAuthenticated => isAuthenticated ? true : router.parseUrl('/login'))
  );
};