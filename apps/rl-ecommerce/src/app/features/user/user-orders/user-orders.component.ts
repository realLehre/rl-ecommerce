import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { UserOrdersTableComponent } from './user-orders-table/user-orders-table.component';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [BreadcrumbComponent, UserOrdersTableComponent],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrdersComponent {}
