import { Routes } from '@angular/router';
import { hasUnsavedChangesGuard } from '../../shared/guards/has-unsaved-changes.guard';

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./admin.component').then((c) => c.AdminComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin-dashboard/admin-dashboard.component').then(
            (c) => c.AdminDashboardComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin-users/admin-users.component').then(
            (c) => c.AdminUsersComponent,
          ),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import(
            './admin-users/admin-user-details/admin-user-details.component'
          ).then((c) => c.AdminUserDetailsComponent),
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
        canDeactivate: [hasUnsavedChangesGuard],
      },
      {
        path: 'products/:id',
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
        path: 'orders/:id',
        loadComponent: () =>
          import(
            './admin-orders/admin-order-details/admin-order-details.component'
          ).then((c) => c.AdminOrderDetailsComponent),
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
        path: 'categories/:id',
        loadComponent: () =>
          import(
            './admin-categories/admin-category-details/admin-category-details.component'
          ).then((c) => c.AdminCategoryDetailsComponent),
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
