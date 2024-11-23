import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./admin.component').then((c) => c.AdminComponent),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./admin-users/admin-users.component').then(
            (c) => c.AdminUsersComponent,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./admin-products/admin-products.component').then(
            (c) => c.AdminProductsComponent,
          ),
      },
      {
        path: 'add-product',
        loadComponent: () =>
          import(
            './admin-products/admin-add-product/admin-add-product.component'
          ).then((c) => c.AdminAddProductComponent),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import(
            './admin-products/admin-product-details/admin-product-details.component'
          ).then((c) => c.AdminProductDetailsComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin-orders/admin-orders.component').then(
            (c) => c.AdminOrdersComponent,
          ),
      },
      {
        path: 'orders/pending',
        loadComponent: () =>
          import('./admin-pending-orders/admin-pending-orders.component').then(
            (c) => c.AdminPendingOrdersComponent,
          ),
      },
      {
        path: 'orders/completed',
        loadComponent: () =>
          import(
            './admin-completed-orders/admin-completed-orders.component'
          ).then((c) => c.AdminCompletedOrdersComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./admin-categories/admin-categories.component').then(
            (c) => c.AdminCategoriesComponent,
          ),
      },
      {
        path: 'add-category',
        loadComponent: () =>
          import(
            './admin-categories/admin-add-category/admin-add-category.component'
          ).then((c) => c.AdminAddCategoryComponent),
      },
    ],
  },
];
