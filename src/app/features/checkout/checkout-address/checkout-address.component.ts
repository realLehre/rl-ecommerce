import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AddressService } from '../../user/address/services/address.service';
import { IAddress } from '../../user/models/address.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RadioButtonModule, RouterLink],
  templateUrl: './checkout-address.component.html',
  styleUrl: './checkout-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent implements OnInit {
  private addressService = inject(AddressService);
  addresses: IAddress[] = this.addressService.addresses;
  selectedAddress!: IAddress;

  ngOnInit() {
    this.selectedAddress = this.addresses.find((address) => address.isDefault)!;
  }

  onSelectAddress() {
    console.log(this.selectedAddress);
  }
}
