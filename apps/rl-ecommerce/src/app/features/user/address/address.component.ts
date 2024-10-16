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

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [AddressCardComponent, AddressFormComponent, RouterLink],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private addressService = inject(AddressService);
  addresses: IAddress[] = this.addressService.addresses;
  isAddingAddress: boolean = false;
  addressFormMode: string = 'add';

  constructor() {
    this.checkRoute();
  }

  ngOnInit() {}

  checkRoute() {
    this.route.queryParams.subscribe((param) => {
      if (param['edit'] || param['add']) {
        this.isAddingAddress = true;
      }

      this.addressFormMode = Object.keys(param)[0];
    });
  }
}
