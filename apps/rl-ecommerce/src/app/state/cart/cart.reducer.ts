import { ICart, ICartItems } from '../../shared/models/cart.interface';
import { createReducer, on } from '@ngrx/store';
import {
  addToCart,
  cartItemAdded,
  cartItemRemoved,
  cartItemUpdated,
  cartOperationError,
  clearCartItems,
  loadCart,
  loadCartFailure,
  loadCartSuccess,
  mergeCart,
  mergeCartFailure,
  mergeCartSuccess,
  removeItemFromCart,
  resetOperations,
  updateCartItem,
} from './cart.actions';
import { logout_clearState } from '../state.actions';

export interface LoadingOperation {
  loading: boolean;
  status: string | null;
}

const createInitialOperationState = (): LoadingOperation => {
  return {
    loading: false,
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
    productId: string | null;
  };
  merge: {
    error: string | null;
    status: string;
  };
}

const totalShippingCost = (cart: ICart) => {
  return cart.cartItems.reduce((acc, item) => acc + item.shippingCost, 0);
};

const subTotal = (cart: ICart) => {
  return cart.cartItems.reduce((acc, item) => acc + item.total, 0);
};

const updateRemoveItemFromCart = (cart: ICart, id: string) => {
  return cart.cartItems.filter((items) => items.id !== id);
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
    productId: null,
  },
  merge: {
    error: null,
    status: 'success',
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

  on(mergeCart, (state) => ({
    ...state,
    merge: { ...state.merge, status: 'loading' },
  })),

  on(mergeCartSuccess, (state, { cart }) => ({
    ...state,
    cart: cart!,
    merge: { ...state.merge, status: 'success', error: null },
  })),

  on(mergeCartFailure, (state, { error }) => ({
    ...state,
    merge: { ...state.merge, status: 'error', error },
  })),

  on(addToCart, (state, { product }) => ({
    ...state,
    loadingOperations: {
      ...state.loadingOperations,
      add: {
        ...state.loadingOperations.add,
        loading: true,
        status: 'pending',
      },
      productId: product.id,
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
          status: 'success',
        },
        productId: action.product.id,
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
        status: 'pending',
      },
    },
  })),

  on(cartItemRemoved, (state, { id }) => {
    const newCart = {
      ...state.cart!,
      cartItems: [...updateRemoveItemFromCart(state.cart!, id)],
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
          status: 'success',
        },
      },
    };
  }),

  on(updateCartItem, (state, { product }) => ({
    ...state,
    loadingOperations: {
      ...state.loadingOperations,
      update: {
        ...state.loadingOperations.add,
        loading: true,
        status: 'pending',
      },
      productId: product.id,
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
          status: 'success',
        },
      },
    };
  }),

  on(
    cartOperationError,
    (
      state,
      action: {
        error: string;
        operation: keyof CartState['loadingOperations'];
      },
    ) => {
      const operationKey = action.operation;

      return {
        ...state,
        loadingOperations: {
          ...state.loadingOperations,
          [operationKey]: {
            loading: false,
            status: 'error',
          },
          error: action.error,
        },
      };
    },
  ),

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

  on(clearCartItems, (state) => ({
    ...state,
    cart: { ...state.cart!, cartItems: [] },
  })),

  on(logout_clearState, (state) => {
    return {
      ...state,
      ...initialState,
    };
  }),
);
