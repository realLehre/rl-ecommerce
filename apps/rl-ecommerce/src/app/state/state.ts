import { cartReducer, CartState } from './cart/cart.reducer';
import { ActionReducerMap, createSelector } from '@ngrx/store';

export interface State {
  cart: CartState;
}

export const appReducer: ActionReducerMap<State> = {
  cart: cartReducer,
};

export const selectCartState = (state: State) => state.cart;

export const selectCart = createSelector(
  selectCartState,
  (state: CartState) => state.cart,
);

export const selectCartLoadingOperations = createSelector(
  selectCartState,
  (state: CartState) => state.loadingOperations,
);
