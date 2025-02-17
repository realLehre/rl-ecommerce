import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./auth.component').then((c) => c.AuthComponent),
    children: [
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./login/login.component').then((c) => c.LoginComponent),
        data: { animation: 'sign-in' },
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./sign-up/sign-up.component').then((c) => c.SignUpComponent),
        data: { animation: 'sign-up' },
      },
    ],
  },
];
