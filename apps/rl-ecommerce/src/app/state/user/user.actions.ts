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
