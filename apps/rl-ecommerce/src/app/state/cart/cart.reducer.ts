import { ICart, ICartItems } from '../../shared/models/cart.interface';
import { createAction, createReducer, on } from '@ngrx/store';
import {
  addToCart,
  cartItemAdded,
  cartItemRemoved,
  cartItemUpdated,
  loadCart,
  loadCartFailure,
  loadCartSuccess,
} from './cart.actions';

export interface LoadingOperation {
  error: string | null;
  loading: boolean;
  status: string | null;
}

export interface CartState {
  cart: ICart | null;
  error: string | null;
  status: string;
  loadingOperations: {
    fetch: LoadingOperation | null;
    add: LoadingOperation | null;
    update: LoadingOperation | null;
    delete: LoadingOperation | null;
  };
}

const totalShippingCost = (cart: ICart) => {
  return cart.cartItems.reduce((acc, item) => acc + item.shippingCost, 0);
};

const subTotal = (cart: ICart) => {
  return cart.cartItems.reduce((acc, item) => acc + item.total, 0);
};

const removeItemFromCart = (cart: ICart, changes: ICartItems) => {
  return cart.cartItems.filter((items) => items.id !== changes.id);
};

const updateCartItem = (cart: ICart, updated: ICartItems) => {
  return cart.cartItems
    .filter((item) => item.product)
    .map((item) => (item.id === updated.id ? { ...item, ...updated } : item));
};

export const initialState: CartState = {
  cart: null,
  error: null,
  status: 'pending',
  loadingOperations: {
    fetch: null,
    add: null,
    update: null,
    delete: null,
  },
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

  on(addToCart, (state) => ({
    ...state,
    loadingOperations: {
      ...state.loadingOperations,
      add: {
        ...state.loadingOperations.add,
        loading: true,
        error: null,
        status: 'pending',
      },
    },
  })),

  on(cartItemAdded, (state, { item }) => {
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
      loadingOperations: {
        ...state.loadingOperations,
        add: {
          ...state.loadingOperations.add,
          loading: false,
          error: null,
          status: 'success',
        },
      },
    };
  }),

  on(cartItemRemoved, (state, { item }) => {
    const newCart = {
      ...state.cart!,
      cartItems: [...removeItemFromCart(state.cart!, item)],
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

  on(cartItemUpdated, (state, { item }) => {
    const newCart = {
      ...state.cart!,
      cartItems: updateCartItem(state.cart!, item),
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
