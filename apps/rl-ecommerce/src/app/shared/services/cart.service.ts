import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserAccountService } from '../../features/user/user-account/services/user-account.service';
import { ICart } from '../models/cart.interface';
import { map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl + 'cart';
  private http = inject(HttpClient);
  private userService = inject(UserAccountService);
  cartSignal = signal<ICart | null>(null);
  constructor() {}

  getCart() {
    const user = this.userService.user;
    return this.cartSignal()
      ? of(this.cartSignal())
      : this.http
          .get<ICart>(`${this.apiUrl}/${user()?.id}`)
          .pipe(tap((res) => this.cartSignal.set(res)));
  }

  addToCart(data: { userId: string; unit: number; productId: string }) {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  updateCartItem(data: { itemId: string; unit: number; productPrice: number }) {
    return this.http.patch(`${this.apiUrl}/${data.itemId}/update`, {
      unit: data.unit,
      productPrice: data.productPrice,
    });
  }
}
