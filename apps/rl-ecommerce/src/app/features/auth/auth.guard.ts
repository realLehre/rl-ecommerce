import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const user = inject(AuthService).user;
  const router = inject(Router);
  if (!user()) {
    router.navigate(['/', 'auth', 'sign-in'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
  return true;
};
