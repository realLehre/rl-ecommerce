import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserAccountService } from '../../features/user/user-account/services/user-account.service';
import {
  getUser,
  getUserFailure,
  getUserSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from './user.actions';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserState } from '../state';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private userAccountService = inject(UserAccountService);

  getUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getUser),
      switchMap(({ id }) =>
        this.userAccountService.getUser(id).pipe(
          map((user) => getUserSuccess({ user: user! })),
          catchError((error) =>
            of(getUserFailure({ error: error.error.message })),
          ),
        ),
      ),
    );
  });

  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateUser),
      switchMap(({ name, phoneNumber }) =>
        this.userAccountService.updateUser({ name, phoneNumber }).pipe(
          map((user) => updateUserSuccess({ user: user! })),
          catchError((error) =>
            of(updateUserFailure({ error: error.error.message })),
          ),
        ),
      ),
    );
  });

  saveUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(getUserSuccess, updateUserSuccess),
        withLatestFrom(this.store.select(selectUserState)),
        tap(([action, state]) => {
          localStorage.setItem(
            this.userAccountService.USER_ACCOUNT_STORAGE_KEY,
            JSON.stringify(state.user),
          );
        }),
      );
    },
    { dispatch: false },
  );
}
