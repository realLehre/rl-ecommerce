import { Routes } from '@angular/router';
import { authGuard } from './features/auth/auth.guard';
import { adminGuard } from './features/admin/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((r) => r.adminRoutes),
    canActivate: [adminGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/components/main-content/main-content.component').then(
        (c) => c.MainContentComponent,
      ),
    children: [
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
        path: 'checkout',
        loadComponent: () =>
          import('./features/checkout/checkout.component').then(
            (c) => c.CheckoutComponent,
          ),
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/user/user-orders/user-orders.component').then(
            (c) => c.UserOrdersComponent,
          ),
        canActivate: [authGuard],
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import(
            './features/user/user-orders/user-order-details/user-order-details.component'
          ).then((c) => c.UserOrderDetailsComponent),
        canActivate: [authGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./features/user/user.routes').then((c) => c.userRoutes),
        canActivate: [authGuard],
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
        (c) => c.PageNotFoundComponent,
      ),
  },
];
