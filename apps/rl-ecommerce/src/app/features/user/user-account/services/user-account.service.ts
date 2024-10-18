import { inject, Injectable, signal } from '@angular/core';
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
  userSignal = signal<IUser | null>(null);

  constructor() {}

  getUser() {
    return this.userSignal()
      ? of(this.userSignal())
      : this.http
          .get<IUser>(`${this.baseUrl}users/${this.user()?.id}`)
          .pipe(tap((res) => this.userSignal.set(res)));
  }

  updateUser(data: any) {
    return this.http
      .patch<any | IUser>(`${this.baseUrl}users/${this.user()?.id}`, data)
      .pipe(tap((res) => this.userSignal.set(res)));
  }
}
