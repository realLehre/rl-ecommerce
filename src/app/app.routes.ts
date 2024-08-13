import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    loadChildren: () =>
      import('./features/landing-page/landing-page.route').then(
        (m) => m.landingPageRoute,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/page-not-found/page-not-found.component').then(
        (c) => c.PageNotFoundComponent,
      ),
  },
];
