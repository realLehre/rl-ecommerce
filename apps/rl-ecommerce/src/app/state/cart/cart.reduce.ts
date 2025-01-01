import { ICart } from '../../shared/models/cart.interface';
import { createReducer, on } from '@ngrx/store';
import { loadCart, loadCartSuccess } from './cart.actions';

export interface CartState {
  cart: ICart;
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState = {
  cart: null,
  error: null,
  status: 'pending',
};

export const cartReduce = createReducer(
  initialState,
  on(loadCart, (state) => ({ ...state, status: 'loading' })),

  on(loadCartSuccess, (state, { cart }) => ({
    ...state,
    status: 'success',
    error: null,
    cart: cart,
  })),
);
