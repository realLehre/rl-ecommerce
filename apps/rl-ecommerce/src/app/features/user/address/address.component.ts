import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { AddressService } from './services/address.service';
import { AddressCardComponent } from './address-card/address-card.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { CanComponentDeactivate } from '../../../shared/guards/has-unsaved-changes.guard';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    AddressCardComponent,
    AddressFormComponent,
    RouterLink,
    SkeletonModule,
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent implements CanComponentDeactivate {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private addressService = inject(AddressService);
  isAddingAddress: boolean = false;
  addressFormMode: string = 'add';
  isLoading = signal(true);
  refreshTrigger = signal(0);
  addresses = toSignal(
    toObservable(this.refreshTrigger).pipe(
      switchMap(() =>
        this.addressService.getAddress().pipe(
          tap(() => {
            this.isLoading.set(false);
          }),
        ),
      ),
    ),
  );

  isAddressTouched = false;

  constructor() {
    this.checkRoute();
  }

  onCloseForm() {
    this.isAddingAddress = false;
    this.refreshTrigger.update((count) => count + 1);
    this.router.navigateByUrl('/user/address-management');
  }

  onReloadAddress() {
    this.refreshTrigger.update((count) => count + 1);
  }

  checkRoute() {
    this.route.queryParams.subscribe((param) => {
      if (param['edit'] || param['add']) {
        this.isAddingAddress = true;
      }

      this.addressFormMode = Object.keys(param)[0];
    });
  }

  canDeactivate(): boolean {
    if (this.isAddressTouched) {
      return confirm(
        'You have unsaved changes, are you sure you want to quit?',
      );
    } else {
      return true;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = true;
    }
  }
}
