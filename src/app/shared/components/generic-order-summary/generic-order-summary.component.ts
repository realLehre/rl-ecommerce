import { Component, input } from '@angular/core';

@Component({
  selector: 'app-generic-order-summary',
  standalone: true,
  imports: [],
  templateUrl: './generic-order-summary.component.html',
  styleUrl: './generic-order-summary.component.scss',
})
export class GenericOrderSummaryComponent {
  paymentMethod = input<string>();
}
