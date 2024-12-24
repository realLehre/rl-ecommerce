import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService, IUser } from '../../features/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.user;

  let request = req;

  if (request.url.includes('paystack.co')) {
    return next(request);
  }
  if (user()) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${user()?.id}` },
    });
  }
  return next(request);
};
