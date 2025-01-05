import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { OverviewFormComponent } from './overview-form/overview-form.component';
import { AsyncPipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { AddressService } from '../../address/services/address.service';
import { IAddress } from '../../models/address.interface';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectUserState } from '../../../../state/state';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [OverviewFormComponent, AsyncPipe, SkeletonModule],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewComponent {
  isEditingProfile = signal(false);
  private addressService = inject(AddressService);
  private router = inject(Router);
  private store = inject(Store);
  user = toSignal(this.store.select(selectUserState));
  address$ = this.addressService.getAddress();

  onCancelProfileEdit() {
    this.isEditingProfile.set(false);
  }

  onEditAddress(address: IAddress) {
    this.addressService.activeAddress.set(address);
    this.router.navigate(['/', 'user', 'address-management'], {
      queryParams: { edit: true },
    });
  }
}
