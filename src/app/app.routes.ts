import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full',
  },
  {
    path: 'homepage',
    loadComponent: () =>
      import('./features/homepage/homepage.component').then(
        (c) => c.HomepageComponent,
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import(
        './features/products/product-details/product-details.component'
      ).then((c) => c.ProductDetailsComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then((c) => c.CartComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/page-not-found/page-not-found.component').then(
        (c) => c.PageNotFoundComponent,
      ),
  },
];
