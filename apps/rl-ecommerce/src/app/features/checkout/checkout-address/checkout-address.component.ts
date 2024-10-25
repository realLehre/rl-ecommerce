import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AddressService } from '../../user/address/services/address.service';
import { IAddress } from '../../user/models/address.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    RouterLink,
    AsyncPipe,
    SkeletonModule,
  ],
  templateUrl: './checkout-address.component.html',
  styleUrl: './checkout-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent implements OnInit {
  private addressService = inject(AddressService);
  addresses!: IAddress[];
  test = toSignal(this.addressService.getAddress(), { initialValue: [] });
  selectedAddress!: IAddress;
  isLoading = signal(true);

  ngOnInit() {
    this.addressService.getAddress().subscribe((res) => {
      this.isLoading.set(false);
      this.addresses = res;
      this.selectedAddress = res.find((address) => address.isDefault)!;
    });
  }

  onEditAddress(address: IAddress) {
    this.addressService.activeAddress.set(address);
  }

  onSelectAddress() {
    console.log(this.selectedAddress);
  }
}
