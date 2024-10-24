import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserAccountService } from '../../features/user/user-account/services/user-account.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl + 'cart';
  private http = inject(HttpClient);
  private userService = inject(UserAccountService);
  constructor() {}

  getCart() {
    const user = this.userService.user;
    return this.http.get(`${this.apiUrl}/${user()?.id}`);
  }

  addToCart(data: { userId: string; unit: number; productId: string }) {
    return this.http.post(`${this.apiUrl}/add`, data);
  }
}
