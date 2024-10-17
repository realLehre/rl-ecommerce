import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const user = authService.user;
  const router = inject(Router);
  if (!user()) {
    router.navigate(['/', 'auth', 'sign-in'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
  return true;
};
