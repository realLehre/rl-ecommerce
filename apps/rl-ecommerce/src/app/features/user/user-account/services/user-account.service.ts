import { inject, Injectable } from '@angular/core';
import { AuthService, IUser } from '../../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  user = this.authService.user;
  private baseUrl = environment.apiUrl;
  catchedUserData = JSON.parse(localStorage.getItem('hdjeyu7830nsk083hd')!);
  constructor() {}

  getUser() {
    return this.catchedUserData
      ? of(this.catchedUserData)
      : this.http
          .get<IUser>(`${this.baseUrl}users/${this.user()?.id}`)
          .pipe(
            tap((res) =>
              localStorage.setItem('hdjeyu7830nsk083hd', JSON.stringify(res)),
            ),
          );
  }

  updateUser(data: any) {
    console.log(data);
    return this.http.patch(`${this.baseUrl}users/${this.user()?.id}`, data);
  }
}
