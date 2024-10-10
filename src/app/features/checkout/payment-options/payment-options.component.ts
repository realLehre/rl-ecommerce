import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-options',
  standalone: true,
  imports: [RadioButtonModule, CommonModule],
  templateUrl: './payment-options.component.html',
  styleUrl: './payment-options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentOptionsComponent {}
