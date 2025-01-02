import { ICart, ICartItems } from '../../shared/models/cart.interface';
import { createAction, createReducer, on } from '@ngrx/store';
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
  resetOperations,
  updateCartItem,
} from './cart.actions';

export interface LoadingOperation {
  error: string | null;
  loading: boolean;
  status: string | null;
}

const createInitialOperationState = (): LoadingOperation => {
  return {
    loading: false,
    error: null,
    status: null,
  };
};

export interface CartState {
  cart: ICart | null;
  error: string | null;
  status: string;
  loadingOperations: {
    add: LoadingOperation;
    update: LoadingOperation;
    delete: LoadingOperation;
    error: string | null;
  };
}

const totalShippingCost = (cart: ICart) => {
  return cart.cartItems.reduce((acc, item) => acc + item.shippingCost, 0);
};

const subTotal = (cart: ICart) => {
  return cart.cartItems.reduce((acc, item) => acc + item.total, 0);
};

const updateRemoveItemFromCart = (cart: ICart, changes: ICartItems) => {
  return cart.cartItems.filter((items) => items.id !== changes.id);
};

const updateCartItemFunc = (cart: ICart, updated: ICartItems) => {
  return cart.cartItems
    .filter((item) => item.product)
    .map((item) => (item.id === updated.id ? { ...item, ...updated } : item));
};

export const initialState: CartState = {
  cart: null,
  error: null,
  status: 'pending',
  loadingOperations: {
    add: createInitialOperationState(),
    update: createInitialOperationState(),
    delete: createInitialOperationState(),
    error: null,
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

  on(cartItemAdded, (state, action) => {
    const newCart = {
      ...state.cart!,
      cartItems: [
        ...state.cart!.cartItems,
        { ...action.item, product: action.product },
      ],
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
        error: null,
        add: {
          ...state.loadingOperations.add,
          loading: false,
          error: null,
          status: 'success',
        },
      },
    };
  }),

  on(removeItemFromCart, (state) => ({
    ...state,
    loadingOperations: {
      ...state.loadingOperations,
      delete: {
        ...state.loadingOperations.add,
        loading: true,
        error: null,
        status: 'pending',
      },
    },
  })),

  on(cartItemRemoved, (state, { item }) => {
    const newCart = {
      ...state.cart!,
      cartItems: [...updateRemoveItemFromCart(state.cart!, item)],
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
        error: null,
        delete: {
          ...state.loadingOperations.add,
          loading: false,
          error: null,
          status: 'success',
        },
      },
    };
  }),

  on(updateCartItem, (state) => ({
    ...state,
    loadingOperations: {
      ...state.loadingOperations,
      update: {
        ...state.loadingOperations.add,
        loading: true,
        error: null,
        status: 'pending',
      },
    },
  })),

  on(cartItemUpdated, (state, { item }) => {
    const newCart = {
      ...state.cart!,
      cartItems: updateCartItemFunc(state.cart!, item),
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
        error: null,
        update: {
          ...state.loadingOperations.add,
          loading: false,
          error: null,
          status: 'success',
        },
      },
    };
  }),

  on(cartOperationError, (state, { error }) => ({
    ...state,
    loadingOperations: {
      ...state.loadingOperations,
      error,
    },
  })),

  on(resetOperations, (state) => {
    const resetOperationsState = { ...state.loadingOperations };
    for (const key of ['add', 'update', 'delete'] as const) {
      resetOperationsState[key] = createInitialOperationState();
    }
    return {
      ...state,
      loadingOperations: {
        ...resetOperationsState,
        error: null,
      },
    };
  }),
);
