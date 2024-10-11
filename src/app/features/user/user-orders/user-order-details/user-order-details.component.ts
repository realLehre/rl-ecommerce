import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { ActivatedRoute } from '@angular/router';
import { OrderTrackerComponent } from './order-tracker/order-tracker.component';

@Component({
  selector: 'app-user-order-details',
  standalone: true,
  imports: [BreadcrumbComponent, OrderTrackerComponent],
  templateUrl: './user-order-details.component.html',
  styleUrl: './user-order-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrderDetailsComponent {
  private route = inject(ActivatedRoute);
  id: string = '';
  constructor() {
    this.route.params.subscribe((param) => (this.id = param['id']));
  }
}
