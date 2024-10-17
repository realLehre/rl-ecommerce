import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { IAddress } from '../../models/address.interface';
import { Router, RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { AddressService } from '../services/address.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-address-card',
  standalone: true,
  imports: [RouterLink, DialogModule, LoaderComponent],
  templateUrl: './address-card.component.html',
  styleUrl: './address-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressCardComponent {
  private addressService = inject(AddressService);
  private toast = inject(ToastService);
  private router = inject(Router);
  address = input.required<IAddress>();
  showDeleteDialog = signal(false);
  isLoading = signal(false);
  reloadAddress = output<void>();

  onEditAddress() {
    this.addressService.activeAddress.set(this.address());
    this.router.navigate(['/', 'user', 'address-management'], {
      queryParams: { edit: true },
    });
  }

  onDeleteAddress() {
    this.isLoading.set(true);
    this.addressService.deleteAddress(this.address().id!).subscribe({
      next: (res) => {
        this.toast.showToast({
          type: 'success',
          message: 'Address deleted!',
        });
        this.isLoading.set(false);
        this.reloadAddress.emit();
        this.showDeleteDialog.set(false);
      },
      error: (err) => {
        this.toast.showToast({
          type: 'error',
          message: err.error.message,
        });
        this.isLoading.set(false);
      },
    });
  }
  onDeleteDialogAction(action?: string) {
    if (action === 'close') {
      this.showDeleteDialog.set(false);

      return;
    }
    this.showDeleteDialog.set(true);
  }
}
