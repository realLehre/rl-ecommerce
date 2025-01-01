import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartService } from '../../shared/services/cart.service';
import { Store } from '@ngrx/store';
import {
  addToCart,
  itemAddedToCart,
  loadCart,
  loadCartFailure,
  loadCartSuccess,
} from './cart.actions';
import { catchError, from, map, of, switchMap } from 'rxjs';

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
      switchMap((res) =>
        this.cartService.addToCart(res).pipe(
          map((res) => itemAddedToCart({ item: res })),
          catchError((err) =>
            of(loadCartFailure({ error: err.error.message })),
          ),
        ),
      ),
    );
  });
}
