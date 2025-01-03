import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartService } from '../../shared/services/cart.service';
import { Store } from '@ngrx/store';
import {
  addToCart,
  cartItemAdded,
  cartItemRemoved,
  cartItemUpdated,
  cartOperationError,
  loadCart,
  loadCartFailure,
  loadCartSuccess,
  mergeCart,
  mergeCartFailure,
  mergeCartSuccess,
  removeItemFromCart,
  resetOperations,
  updateCartItem,
} from './cart.actions';
import {
  catchError,
  concatMap,
  debounceTime,
  delay,
  from,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { selectCartLoadingOperations, selectCartState } from '../state';
import { ToastService } from '../../shared/services/toast.service';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  private store = inject(Store);

  loadCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCart),
      switchMap(() =>
        this.cartService.getCart().pipe(
          map((res) => loadCartSuccess({ cart: res! })),
          catchError((err) =>
            of(loadCartFailure({ error: err.error.message })),
          ),
        ),
      ),
    );
  });

  mergeCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(mergeCart),
      concatMap(() =>
        this.cartService.mergeCart().pipe(
          map((res) => mergeCartSuccess({ cart: res })),
          catchError((err) =>
            of(mergeCartFailure({ error: err.error.message })),
          ),
        ),
      ),
    );
  });

  addItemToCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addToCart),
      switchMap((actionRes) =>
        this.cartService.addToCart(actionRes).pipe(
          map((res) =>
            cartItemAdded({ item: res, product: actionRes.product }),
          ),
          catchError((err) =>
            of(
              cartOperationError({
                error: err.error.message,
                operation: 'add',
              }),
            ),
          ),
        ),
      ),
    );
  });

  removeItemFromCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(removeItemFromCart),
      switchMap(({ id }) =>
        this.cartService.deleteCartItem(id).pipe(
          map((res) => cartItemRemoved({ item: res })),
          catchError((err) =>
            of(
              cartOperationError({
                error: err.error.message,
                operation: 'delete',
              }),
            ),
          ),
        ),
      ),
    );
  });

  updateCartItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateCartItem),
      concatMap((res) =>
        this.cartService.updateCartItem(res).pipe(
          map((res) => cartItemUpdated({ item: res })),
          catchError((err) =>
            of(
              cartOperationError({
                error: err.error.message,
                operation: 'update',
              }),
            ),
          ),
        ),
      ),
    );
  });

  saveStateToStorage = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          loadCartSuccess,
          cartItemAdded,
          cartItemRemoved,
          cartItemUpdated,
          mergeCartSuccess,
        ),
        withLatestFrom(this.store.select(selectCartState)),
        tap(([action, state]) => {
          if (this.cartService.user()) {
            localStorage.setItem(
              this.cartService.CART_KEY,
              JSON.stringify(state.cart),
            );
          } else {
            localStorage.setItem(
              this.cartService.GUEST_CART_KEY,
              JSON.stringify({
                ...state.cart,
                createdAt: new Date().toISOString(),
              }),
            );
          }
        }),
      );
    },
    { dispatch: false },
  );

  resetOperations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(cartItemAdded, cartItemRemoved, cartItemUpdated), // React to any operation's completion
      delay(500), // Optional: Delay reset for toast display
      map(() => resetOperations()), // Reset all operations
    );
  });

  // showToastNotification$ = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(cartOperationError),
  //       withLatestFrom(this.store.select(selectCartLoadingOperations)),
  //       debounceTime(300), // Debounce to prevent rapid successive toasts
  //       map(([action, loadingOperations]) => {
  //         if (loadingOperations.error) {
  //           this.toast.showToast({
  //             type: 'error',
  //             message: loadingOperations.error,
  //           });
  //         }
  //       }),
  //     );
  //   },
  //   { dispatch: false },
  // );
}
