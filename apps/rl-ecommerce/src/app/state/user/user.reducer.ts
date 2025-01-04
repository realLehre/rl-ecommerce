import { IUser } from '../../features/user/models/user.interface';
import { AuthApiError } from '@supabase/supabase-js';
import { createReducer, on } from '@ngrx/store';
import { getUser, getUserFailure, getUserSuccess } from './user.actions';

export interface UserState {
  user: IUser | null;
  status: string;
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  user: null,
  status: 'pending',
  loading: false,
  error: null,
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
);
