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
  removeItemFromCart,
  updateCartItem,
} from './cart.actions';
import { catchError, concatMap, from, map, of, switchMap } from 'rxjs';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);
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

  addItemToCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addToCart),
      switchMap((actionRes) =>
        this.cartService.addToCart(actionRes).pipe(
          map((res) =>
            cartItemAdded({ item: res, product: actionRes.product }),
          ),
          catchError((err) =>
            of(cartOperationError({ error: err.error.message })),
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
            of(cartOperationError({ error: err.error.message })),
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
            of(cartOperationError({ error: err.error.message })),
          ),
        ),
      ),
    );
  });
}
