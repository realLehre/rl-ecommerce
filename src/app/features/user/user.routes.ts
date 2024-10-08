import { Routes } from '@angular/router';
import { UserAccountComponent } from './user-account/user-account.component';

export const userRoutes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: '',
    component: UserAccountComponent,
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import(
            '../user/user-account/account-overview/account-overview.component'
          ).then((c) => c.AccountOverviewComponent),
      },
    ],
  },
];
