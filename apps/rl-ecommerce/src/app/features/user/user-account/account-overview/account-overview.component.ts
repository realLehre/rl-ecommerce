import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { OverviewFormComponent } from './overview-form/overview-form.component';
import { UserAccountService } from '../services/user-account.service';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { AddressService } from '../../address/services/address.service';
import { IAddress } from '../../models/address.interface';

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
  private userAccountService = inject(UserAccountService);
  private addressService = inject(AddressService);
  private router = inject(Router);
  address$ = this.addressService.getAddress();
  user$ = this.userAccountService.getUser('sfsjf');

  onCancelProfileEdit() {
    this.isEditingProfile.set(false);
    // this.user$ = of(this.userAccountService.userSignal());
  }

  onEditAddress(address: IAddress) {
    this.addressService.activeAddress.set(address);
    this.router.navigate(['/', 'user', 'address-management'], {
      queryParams: { edit: true },
    });
  }
}
