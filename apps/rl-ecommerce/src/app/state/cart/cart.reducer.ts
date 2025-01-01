import { ICart } from '../../shared/models/cart.interface';
import { createAction, createReducer, on } from '@ngrx/store';
import {
  addToCart,
  cartItemRemoved,
  cartItemUpdated,
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

const removeItemFromCart = (cart: ICart, id: string) => {
  return cart.cartItems.filter((items) => items.id !== id);
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

  on(cartItemUpdated, (state, { item }) => {
    const newCart = {
      ...state.cart!,
      cartItems: [...state.cart!.cartItems, item],
    };
    const newShippingCost = totalShippingCost(newCart);
    const newSubTotal = subTotal(newCart);
    return {
      ...state,
      cart: {
        ...state.cart!,
        cartItems: newCart.cartItems,
        shippingCost: newShippingCost,
        subTotal: newSubTotal,
      },
      status: 'success',
      error: null,
    };
  }),

  on(cartItemRemoved, (state, { item }) => {
    const newCart = {
      ...state.cart!,
      cartItems: [...removeItemFromCart(state.cart!, item.id)],
    };
    const newShippingCost = totalShippingCost(newCart);
    const newSubTotal = subTotal(newCart);
    return {
      ...state,
      cart: {
        ...state.cart!,
        cartItems: newCart.cartItems,
        shippingCost: newShippingCost,
        subTotal: newSubTotal,
      },
      status: 'success',
      error: null,
    };
  }),
);

export const selectCart = (state: CartState) => state.cart;
