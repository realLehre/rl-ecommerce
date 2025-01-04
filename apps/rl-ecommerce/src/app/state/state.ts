import { cartReducer, CartState } from './cart/cart.reducer';
import { ActionReducerMap, createSelector } from '@ngrx/store';
import { userReducer, UserState } from './user/user.reducer';

export interface State {
  cart: CartState;
  user: UserState;
}

export const appReducer: ActionReducerMap<State> = {
  cart: cartReducer,
  user: userReducer,
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

export const selectUserState = (state: State) => state.user;
