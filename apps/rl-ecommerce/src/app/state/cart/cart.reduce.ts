import { ICart } from '../../shared/models/cart.interface';
import { createReducer, on } from '@ngrx/store';
import { loadCart, loadCartFailure, loadCartSuccess } from './cart.actions';

export interface CartState {
  cart: ICart | null;
  error: string | null;
  status: string;
}

export const initialState: CartState = {
  cart: null,
  error: null,
  status: 'pending',
};

export const cartReducer = createReducer(
  initialState,
  on(loadCart, (state) => ({ ...state, status: 'loading' })),

  on(loadCartSuccess, (state, { cart }) => ({
    ...state,
    status: 'success',
    error: null,
    cart: cart!,
  })),

  on(loadCartFailure, (state, { error }) => ({
    ...state,
    status: 'failure',
    error,
  })),
);

export const selectCart = (state: CartState) => state.cart;
