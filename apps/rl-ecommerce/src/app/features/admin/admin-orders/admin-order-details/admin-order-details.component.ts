import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminOrderSummaryComponent } from './admin-order-summary/admin-order-summary.component';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [RouterLink, AdminOrderSummaryComponent],
  templateUrl: './admin-order-details.component.html',
  styleUrl: './admin-order-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderDetailsComponent {}
