import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, of, retry, tap } from 'rxjs';
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
  pendingReviewsSignal = signal<IOrder[] | null>(null);
  constructor() {}

  createReview(data: any) {
    return this.http.post(`${this.url}/create`, data);
  }

  getPendingReviews() {
    return this.pendingReviewsSignal()
      ? of(this.pendingReviewsSignal())
      : this.http.get<IOrder[]>(`${this.url}/pending/${this.user()?.id}`).pipe(
          map((res) => res.filter((order) => order.orderItems.length > 0)),
          tap((res) => this.pendingReviewsSignal.set(res)),
          retry(3),
        );
  }
}
