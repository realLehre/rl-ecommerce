import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { IOrder } from '../../../../../shared/models/order.interface';

@Component({
  selector: 'app-admin-order-summary',
  standalone: true,
  imports: [NgTemplateOutlet, CurrencyPipe],
  templateUrl: './admin-order-summary.component.html',
  styleUrl: './admin-order-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderSummaryComponent {
  order: IOrder = JSON.parse(localStorage.getItem('testorder')!);
  ngOnInit() {
    console.log(this.order);
  }
}
