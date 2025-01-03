import { Component, inject, signal } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CartService } from '../../services/cart.service';
import { LoaderComponent } from '../loader/loader.component';
import { ToastService } from '../../services/toast.service';

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
  isMerging = signal(false);

  onMergeCarts() {
    this.isMerging.set(true);
    this.cartService.mergeCart().subscribe({
      next: (res) => {
        this.isMerging.set(false);
        this.toast.showToast({
          type: 'success',
          message: 'Carts merged successfully!',
        });
        this.ref.close();
      },
      error: (err) => {
        this.isMerging.set(false);
        this.toast.showToast({
          type: 'error',
          message: err.error.message,
        });
      },
    });
  }
  onCloseDialog() {
    localStorage.removeItem(this.cartService.GUEST_CART_KEY);
    this.cartService.guestCart.cartItems = [];
    this.ref.close();
  }
}
