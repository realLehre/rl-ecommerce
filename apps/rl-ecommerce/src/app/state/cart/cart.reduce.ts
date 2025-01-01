import { ICart } from '../../shared/models/cart.interface';
import { createReducer, on } from '@ngrx/store';
import {
  addToCart,
  itemAddedToCart,
  loadCart,
  loadCartFailure,
  loadCartSuccess,
} from './cart.actions';

export interface CartState {
  cart: ICart | null;
  error: string | null;
  status: string;
}

const totalShippingCost = (cart: ICart) => {
  return cart.cartItems.reduce((acc, item) => acc + item.shippingCost, 0);
};

const subTotal = (cart: ICart) => {
  return cart.cartItems.reduce((acc, item) => acc + item.total, 0);
};

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

  on(itemAddedToCart, (state, { item }) => {
    const newCartItems = {
      ...state.cart!,
      cartItems: [...state.cart!.cartItems, item],
    };
    const newShippingCost = totalShippingCost(newCartItems);
    const newSubTotal = subTotal(newCartItems);
    return {
      ...state,
      cart: {
        ...state.cart!,
        cartItems: [...state.cart!.cartItems, item],
        shippingCost: newShippingCost,
        subTotal: newSubTotal,
      },
    };
  }),
);

export const selectCart = (state: CartState) => state.cart;
