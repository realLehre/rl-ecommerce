import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService, IUser } from '../../features/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem(authService.USER_AUTH_TOKEN_KEY);

  let request = req;
  if (token) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(request);
};
