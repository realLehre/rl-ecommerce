import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AddressService } from './services/address.service';
import { IAddress } from '../models/address.interface';
import { AddressCardComponent } from './address-card/address-card.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { CanComponentDeactivate } from '../../../shared/guards/has-unsaved-changes.guard';
import { DialogService } from 'primeng/dynamicdialog';
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    AddressCardComponent,
    AddressFormComponent,
    RouterLink,
    AsyncPipe,
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
  addresses$ = this.addressService.getAddress();
  isAddressTouched = false;

  constructor() {
    this.checkRoute();
  }

  onCloseForm() {
    this.isAddingAddress = false;
    this.router.navigateByUrl('/user/address-management');
  }

  onReloadAddress() {
    this.addresses$ = this.addressService.getAddress();
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
