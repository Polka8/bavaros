import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.setRedirectUrl(state.url);
  
  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => isLoggedIn || router.createUrlTree(['/login']))
  );
};