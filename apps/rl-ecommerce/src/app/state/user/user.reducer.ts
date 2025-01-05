import { IUser } from '../../features/user/models/user.interface';
import { AuthApiError } from '@supabase/supabase-js';
import { createReducer, on } from '@ngrx/store';
import {
  getUser,
  getUserFailure,
  getUserSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from './user.actions';
import { logout_clearState } from '../state.actions';

export interface UserStateOperation {
  status: string;
  loading: boolean;
  error: string | null;
}

export interface UserState {
  user: IUser | null;
  status: string;
  loading: boolean;
  error: string | null;
  userOperation: UserStateOperation | null;
}

export const initialUserState: UserState = {
  user: null,
  status: 'pending',
  loading: false,
  error: null,
  userOperation: null,
};

export const userReducer = createReducer(
  initialUserState,

  on(getUser, (state) => ({ ...state, loading: true })),

  on(getUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    status: 'success',
    error: null,
  })),

  on(getUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    status: 'failure',
    error,
  })),

  on(updateUser, (state) => ({
    ...state,
    userOperation: {
      ...state.userOperation,
      loading: true,
      error: null,
      status: 'pending',
    },
  })),

  on(updateUserSuccess, (state, { user }) => ({
    ...state,
    userOperation: {
      ...state.userOperation,
      loading: false,
      error: null,
      status: 'success',
    },
  })),

  on(updateUserFailure, (state, { error }) => ({
    ...state,
    userOperation: {
      ...state.userOperation,
      loading: false,
      error: error,
      status: 'failure',
    },
  })),

  on(logout_clearState, (state) => ({ ...initialUserState })),
);
