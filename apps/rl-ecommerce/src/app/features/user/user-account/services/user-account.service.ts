import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import {HttpClient} from "@angular/common/http";

import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  private authService = inject(AuthService);
  private http = inject(HttpClient)
  user = this.authService.user;
private baseUrl = environment.apiUrl
  constructor() {
  }

   getUser() {
    this.http.get(`${this.baseUrl}users/${this.user()?.id}`).subscribe({
      next: res => {
        console.log(res)
      }, error: err => {
        console.log(err)
      }
    })

  }
}

