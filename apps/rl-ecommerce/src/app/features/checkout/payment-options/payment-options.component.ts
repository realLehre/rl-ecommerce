import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-options',
  standalone: true,
  imports: [RadioButtonModule, CommonModule, FormsModule],
  templateUrl: './payment-options.component.html',
  styleUrl: './payment-options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentOptionsComponent {
  paymentOption!: string;
  paymentOptionSelected = output<string>();

  onSelectPaymentMethod() {
    this.paymentOptionSelected.emit(this.paymentOption);
  }
}
