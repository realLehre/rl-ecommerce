import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, retry } from 'rxjs';
import { IOrder } from '../models/order.interface';

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
    return this.http
      .get<IOrder[]>(`${this.url}/pending/${this.user()?.id}`)
      .pipe(
        map((res) => res.filter((order) => order.orderItems.length > 0)),
        retry(3),
      );
  }
}
