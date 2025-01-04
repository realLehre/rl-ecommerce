import { inject, Injectable } from '@angular/core';
import { ProductsService } from '../../features/products/services/products.service';
import { ProductOptionsService } from '../../features/product-options/services/product-options.service';
import { UserAccountService } from '../../features/user/user-account/services/user-account.service';
import { OrderService } from './order.service';
import { AddressService } from '../../features/user/address/services/address.service';

@Injectable({
  providedIn: 'root',
})
export class StateAuthService {
  private productService = inject(ProductsService);
  private userAccountService = inject(UserAccountService);
  private orderService = inject(OrderService);
  private productOptionsService = inject(ProductOptionsService);
  private addressService = inject(AddressService);

  constructor() {}

  resetState() {
    this.userAccountService.userSignal.set(null);
    this.orderService.orderSignal.set(null);
    this.productOptionsService.categoriesSignal.set(null);
    this.productService.productSignal.set(null);
    this.addressService.addressSignal.set(null);
  }
}
