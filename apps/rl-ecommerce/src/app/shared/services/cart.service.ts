import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { UserAccountService } from '../../features/user/user-account/services/user-account.service';
import { ICart, ICartItems } from '../models/cart.interface';
import { Observable, of, retry, tap } from 'rxjs';
import { IProduct } from '../../features/products/model/product.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { MergeCartAlertDialogComponent } from '../components/merge-cart-alert-dialog/merge-cart-alert-dialog.component';
import { AuthService } from '../../features/auth/services/auth.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl + 'cart';
  private http = inject(HttpClient);
  private userService = inject(UserAccountService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  user = this.userService.user;
  cartSignal = signal<ICart | null>(null);
  cartTotal = signal<number | null>(null);
  guestCart!: ICart;
  GUEST_CART_KEY = 'hd30jlsncjefysakhs';
  CART_KEY = 'sjshdy382nsj02shk02s';
  cart = signal<ICart | null>(null);
  constructor() {
    const guestCart = JSON.parse(localStorage.getItem(this.GUEST_CART_KEY)!);
    if (guestCart) {
      this.guestCart = guestCart;
    } else {
      this.createGuestCart();
    }

    const cart = JSON.parse(localStorage.getItem(this.CART_KEY)!);
    if (cart && this.user()) {
      this.cart.set(cart);
    }
  }

  getCart(): Observable<any> {
    if (this.user()) {
      return this.cart()!
        ? of(this.cart()!)
        : this.http.get<ICart>(`${this.apiUrl}/${this.user()?.id}`).pipe(
            retry(3),
            tap(() => {
              const newSignIn = sessionStorage.getItem(
                this.authService.NEW_SIGNUP_KEY,
              );
              console.log(2);
              if (newSignIn) {
                this.mergeCart().subscribe((res) =>
                  sessionStorage.removeItem(this.authService.NEW_SIGNUP_KEY),
                );
              } else {
                this.onShowMergeCartDialog();
              }
            }),
          );
    } else {
      return of(this.guestCart);
    }
    // if (this.user()) {
    //   return this.cartSignal()
    //     ? of(this.cartSignal())
    //     : this.http.get<ICart>(`${this.apiUrl}/${this.user()?.id}`).pipe(
    //         retry(3),
    //         tap((res) => {
    //           this.cartSignal.set(res);
    //           this.cartTotal.set(res.cartItems.length);
    //           const newSignIn = sessionStorage.getItem(
    //             this.authService.NEW_SIGNUP_KEY,
    //           );
    //           if (newSignIn) {
    //             this.mergeCart().subscribe((res) =>
    //               sessionStorage.removeItem(this.authService.NEW_SIGNUP_KEY),
    //             );
    //           } else {
    //             this.onShowMergeCartDialog();
    //           }
    //           localStorage.setItem(this.CART_KEY, JSON.stringify(res));
    //         }),
    //       );
    // } else {
    //   this.cartTotal.set(this.guestCart.cartItems!.length);
    //   this.cartSignal.set(this.guestCart as ICart);
    //   return of(this.guestCart as ICart);
    // }
  }

  createGuestCart() {
    this.guestCart = {
      id: uuidv4(),
      cartItems: [],
      createdAt: new Date().toString(),
      subTotal: 0,
      shippingCost: 0,
      updatedAt: new Date().toString(),
      userId: uuidv4(),
    };
  }

  addToCart(data: { unit: number; product: IProduct }): Observable<ICartItems> {
    if (this.user()) {
      return this.http.post<ICartItems>(`${this.apiUrl}/add`, {
        userId: this.user()?.id,
        unit: data.unit,
        productId: data.product.id,
        productPrice: data.product.price,
      });
    } else {
      console.log(this.guestCart);

      return of({
        total: data.product.price * data.unit,
        unit: data.unit,
        cartId: this.guestCart.id,
        shippingCost: 100,
        product: data.product,
        id: uuidv4(),
        productId: data.product.id,
        updatedAt: new Date().toString(),
        createdAt: new Date().toString(),
      });
    }
    // if (this.user()) {
    //   return this.http.post<ICartItems>(`${this.apiUrl}/add`, {
    //     userId: this.user()?.id,
    //     unit: data.unit,
    //     productId: data.product.id,
    //     productPrice: data.product.price,
    //   });
    // } else {
    //   const guestCartItem: Partial<ICartItems> = {
    //     total: data.product.price * data.unit,
    //     unit: data.unit,
    //     shippingCost: 100,
    //     product: data.product,
    //     id: this.generateRandomId(),
    //     productId: data.product.id,
    //   };

    // this.guestCart.cartItems?.push(guestCartItem as ICartItems);
    // localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.guestCart));
    // this.cartSignal.set(old);
    // return of(guestCartItem);
  }

  updateCartItem(data: { itemId: string; unit: number; product: IProduct }) {
    if (this.user()) {
      return this.http.patch<ICartItems>(
        `${this.apiUrl}/${data.itemId}/update`,
        {
          unit: data.unit,
          productPrice: data.product.price,
        },
      );
    } else {
      const updatedItem: ICartItems = {
        ...this.guestCart?.cartItems?.find((item) => item.id === data.itemId)!,
      };

      if (updatedItem) {
        updatedItem.unit = data.unit;
        updatedItem.total = data.unit * data.product.price;
        updatedItem.updatedAt = new Date().toString();
      }
      return of(updatedItem);
    }
    // if (this.user()) {
    //   return this.http.patch(`${this.apiUrl}/${data.itemId}/update`, {
    //     unit: data.unit,
    //     productPrice: data.productPrice,
    //   });
    // } else {
    //   this.guestCart.cartItems = this.guestCart.cartItems?.map((item) => {
    //     if (item.id == data.itemId) {
    //       item.unit = data.unit;
    //       item.total = data.unit * item.product.price;
    //     }
    //     return item as ICartItems;
    //   });
    //   this.cartSignal.set(this.guestCart as ICart);
    //   localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.guestCart));
    //   return of(this.guestCart);
    // }
  }

  deleteCartItem(id: string) {
    if (this.user()) {
      return this.http.delete<ICartItems>(`${this.apiUrl}/${id}/delete`);
    } else {
      const cartItem: ICartItems = {
        ...this.guestCart.cartItems?.find((item) => item.id === id)!,
      };
      return of(cartItem);
    }
    // if (this.user()) {
    // } else {
    //   this.guestCart.cartItems = this.guestCart.cartItems?.filter(
    //     (item) => item.id !== id,
    //   );
    //   this.cartSignal.set(this.guestCart as ICart);
    //   localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.guestCart));
    //   return of(this.guestCart);
    // }
  }

  onShowMergeCartDialog() {
    if (this.guestCart.cartItems?.length) {
      this.dialogService.open(MergeCartAlertDialogComponent, {
        width: '25rem',
        breakpoints: {
          '450px': '90vw',
        },
        focusOnShow: false,
      });
    }
  }

  mergeCart() {
    return this.http
      .post<ICart>(`${this.apiUrl}/${this.user()?.id}/merge`, this.guestCart)
      .pipe(
        tap((res) => {
          localStorage.removeItem(this.GUEST_CART_KEY);
          localStorage.setItem(this.CART_KEY, JSON.stringify(res));
          this.cartSignal.set(res);
          this.cartTotal.set(res.cartItems.length);
          this.guestCart.cartItems = [];
        }),
      );
  }

  generateRandomId(length: number = 10): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }
}
