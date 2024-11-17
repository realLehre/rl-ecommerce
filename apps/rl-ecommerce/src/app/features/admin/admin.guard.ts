import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.user;
  if (user()?.id !== '8133ae62-c817-4339-a62d-dc718ce99568') {
    router.navigate(['/', 'homepage']);
    return false;
  }
  return true;
};
