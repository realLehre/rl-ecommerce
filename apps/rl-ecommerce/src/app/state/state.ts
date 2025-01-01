import { CartState } from './cart/cart.reducer';

export interface State {
  cart: CartState;
}

export const selectCart = (state: State) => state.cart;
