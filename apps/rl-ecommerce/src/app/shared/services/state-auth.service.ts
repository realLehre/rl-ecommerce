import { inject, Injectable } from '@angular/core';
import { ProductsService } from '../../features/products/services/products.service';
import { ProductOptionsService } from '../../features/product-options/services/product-options.service';
import { CartService } from './cart.service';
import { UserAccountService } from '../../features/user/user-account/services/user-account.service';
import { ReviewService } from './review.service';
import { OrderService } from './order.service';
import { AddressService } from '../../features/user/address/services/address.service';

@Injectable({
  providedIn: 'root',
})
export class StateAuthService {
  private productService = inject(ProductsService);
  private optionsService = inject(ProductOptionsService);
  private cartService = inject(CartService);
  private userAccountService = inject(UserAccountService);
  private reviewService = inject(ReviewService);
  private orderService = inject(OrderService);
  private productOptionsService = inject(ProductOptionsService);
  private addressService = inject(AddressService);

  constructor() {}

  resetState() {
    this.cartService.cartSignal.set(null);
    this.cartService.cartTotal.set(null);
    this.userAccountService.userSignal.set(null);
    this.reviewService.pendingReviewsSignal.set(null);
    this.orderService.orderSignal.set(null);
    this.productOptionsService.categoriesSignal.set(null);
    this.productService.productSignal.set(null);
    this.addressService.addressSignal.set(null);
  }
}
