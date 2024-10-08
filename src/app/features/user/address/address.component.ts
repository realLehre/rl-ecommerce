import { Component, inject } from '@angular/core';
import { AddressService } from './services/address.service';
import { IAddress } from '../models/address.interface';
import { AddressCardComponent } from './address-card/address-card.component';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [AddressCardComponent],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent {
  private addressService = inject(AddressService);
  addresses: IAddress[] = this.addressService.addresses;
}
