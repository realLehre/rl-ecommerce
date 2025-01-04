import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserAccountService } from '../../features/user/user-account/services/user-account.service';
import { getUser, getUserFailure, getUserSuccess } from './user.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userAccountService = inject(UserAccountService);

  getUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getUser),
      switchMap(({ id }) =>
        this.userAccountService.getUser(id).pipe(
          map((user) => getUserSuccess({ user })),
          catchError((error) =>
            of(getUserFailure({ error: error.error.message })),
          ),
        ),
      ),
    );
  });

  // saveUser$ = createEffect(() => {
  //     return this.actions$.pipe(ofType(getUserSuccess))
  // })
}
