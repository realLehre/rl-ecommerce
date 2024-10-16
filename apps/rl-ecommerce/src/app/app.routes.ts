import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/components/main-content/main-content.component').then(
        (c) => c.MainContentComponent
      ),
    children: [
      {
        path: 'homepage',
        loadComponent: () =>
          import('./features/homepage/homepage.component').then(
            (c) => c.HomepageComponent
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
        path: 'checkout',
        loadComponent: () =>
          import('./features/checkout/checkout.component').then(
            (c) => c.CheckoutComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/user/user-orders/user-orders.component').then(
            (c) => c.UserOrdersComponent
          ),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import(
            './features/user/user-orders/user-order-details/user-order-details.component'
          ).then((c) => c.UserOrderDetailsComponent),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./features/user/user.routes').then((c) => c.userRoutes),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((c) => c.authRoutes),
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/page-not-found/page-not-found.component').then(
        (c) => c.PageNotFoundComponent
      ),
  },
];
