import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AddressService } from './services/address.service';
import { IAddress } from '../models/address.interface';
import { AddressCardComponent } from './address-card/address-card.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

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
export class AddressComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private addressService = inject(AddressService);
  isAddingAddress: boolean = false;
  addressFormMode: string = 'add';
  addresses$ = this.addressService.getAddress();

  constructor() {
    this.checkRoute();
  }

  ngOnInit() {
    this.addressService.getAddress();
  }

  checkRoute() {
    this.route.queryParams.subscribe((param) => {
      if (param['edit'] || param['add']) {
        this.isAddingAddress = true;
      }

      this.addressFormMode = Object.keys(param)[0];
    });
  }
}
