import { createAction, props } from '@ngrx/store';
import { IUser } from '../../features/user/models/user.interface';

export const getUser = createAction('[User] Get User', props<{ id: string }>());

export const getUserSuccess = createAction(
  '[User] Get User Success',
  props<{ user: IUser }>(),
);

export const getUserFailure = createAction(
  '[User] Get User Failure',
  props<{ error: string }>(),
);

export const updateUser = createAction(
  '[User] Update User',
  props<{ name: string; phoneNumber: string }>(),
);

export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: IUser }>(),
);

export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: string }>(),
);
