import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IAddress } from '../../models/address.interface';

@Component({
  selector: 'app-address-card',
  standalone: true,
  imports: [],
  templateUrl: './address-card.component.html',
  styleUrl: './address-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressCardComponent {
  address = input.required<IAddress>();
}
