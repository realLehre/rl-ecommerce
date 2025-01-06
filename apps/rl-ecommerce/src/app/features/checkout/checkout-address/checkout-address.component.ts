import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { AddressService } from '../../user/address/services/address.service';
import { IAddress } from '../../user/models/address.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-checkout-address',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    RouterLink,
    SkeletonModule,
  ],
  templateUrl: './checkout-address.component.html',
  styleUrl: './checkout-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent {
  private addressService = inject(AddressService);
  isLoading = signal(true);
  selectedAddress!: IAddress;
  addresses = toSignal<IAddress[]>(
    this.addressService.getAddress().pipe(
      tap((res) => {
        this.isLoading.set(false);
        this.selectedAddress = res.find((address) => address.isDefault)!;
        this.addressService.checkoutAddress.set(this.selectedAddress);
      }),
    ),
  );

  onEditAddress(address: IAddress) {
    this.addressService.activeAddress.set(address);
  }

  onSelectAddress() {
    this.addressService.checkoutAddress.set(this.selectedAddress);
  }
}
