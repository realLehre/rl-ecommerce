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
  addresses = toSignal(
    this.addressService.getAddress().pipe(
      tap((res) => {
        this.isLoading.set(false);
        this.selectedAddress = res.find((address) => address.isDefault)!;
        this.selectedAddressEmit.emit(this.selectedAddress);
      }),
    ),
  );
  selectedAddress!: IAddress;
  selectedAddressEmit = output<IAddress>();

  onEditAddress(address: IAddress) {
    this.addressService.activeAddress.set(address);
  }

  onSelectAddress() {
    this.selectedAddressEmit.emit(this.selectedAddress);
  }
}
