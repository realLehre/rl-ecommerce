import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
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
  selectedAddress!: IAddress;
  isLoading = signal(true);
  selectedAddressEmit = output<IAddress>();

  ngOnInit() {
    this.addressService.getAddress().subscribe((res) => {
      this.isLoading.set(false);
      this.addresses = res;
      this.selectedAddress = res.find((address) => address.isDefault)!;
      this.selectedAddressEmit.emit(this.selectedAddress);
    });
  }

  onEditAddress(address: IAddress) {
    this.addressService.activeAddress.set(address);
  }

  onSelectAddress() {
    this.selectedAddressEmit.emit(this.selectedAddress);
  }
}
