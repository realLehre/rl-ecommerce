import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  user = this.authService.user;
  private readonly url = environment.apiUrl + 'review';
  seeingFullReview = signal(false);
  constructor() {}

  createReview(data: any) {
    return this.http.post(`${this.url}/create`, data);
  }

  getPendingReviews() {
    return this.http.get(`${this.url}/pending/${this.user()?.id}`);
  }
}
