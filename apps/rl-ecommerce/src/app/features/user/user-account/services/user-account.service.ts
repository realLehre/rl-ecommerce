import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment.development';
import { of } from 'rxjs';
import { IUser } from '../../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  user = this.authService.user;
  private baseUrl = environment.apiUrl;
  userSignal = signal<IUser | null>(null);
  USER_ACCOUNT_STORAGE_KEY = 'hdjeyu7830nsk083hd';

  constructor() {
    const user = JSON.parse(
      localStorage.getItem(this.USER_ACCOUNT_STORAGE_KEY)!,
    );
    if (user) {
      this.userSignal.set(user);
    } else {
      this.userSignal.set(null);
    }
  }

  getUser(id: string) {
    return this.userSignal()
      ? of(this.userSignal())
      : this.http.get<IUser>(`${this.baseUrl}users/single/${id}`).pipe();
  }

  updateUser(data: { name: string; phoneNumber: string }) {
    return this.http.patch<any | IUser>(
      `${this.baseUrl}users/${this.user()?.id}`,
      data,
    );
  }
}
