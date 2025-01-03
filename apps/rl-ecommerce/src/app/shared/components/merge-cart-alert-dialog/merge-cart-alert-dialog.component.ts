import { Component, inject } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CartService } from '../../services/cart.service';
import { LoaderComponent } from '../loader/loader.component';
import { ToastService } from '../../services/toast.service';
import { Store } from '@ngrx/store';
import { mergeCart } from '../../../state/cart/cart.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectCartState } from '../../../state/state';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-merge-cart-alert-dialog',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './merge-cart-alert-dialog.component.html',
  styleUrl: './merge-cart-alert-dialog.component.scss',
})
export class MergeCartAlertDialogComponent {
  private ref = inject(DynamicDialogRef);
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  private store = inject(Store);
  isMerging = toSignal(
    this.store.select(selectCartState).pipe(
      tap((res) => {
        if (res.merge.error) {
          this.toast.showToast({
            type: 'error',
            message: res.merge.error,
          });
        } else if (res.merge.status == 'success') {
          this.toast.showToast({
            type: 'success',
            message: 'Carts merged successfully!',
          });
          this.ref.close();
        }
      }),
      map((res) => (res.merge.error ? false : res.merge.status == 'loading')),
    ),
  );

  onMergeCarts() {
    this.store.dispatch(mergeCart());
  }
  onCloseDialog() {
    localStorage.removeItem(this.cartService.GUEST_CART_KEY);
    this.cartService.guestCart.cartItems = [];
    this.ref.close();
  }
}
