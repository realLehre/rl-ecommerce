import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private readonly url = environment.apiUrl + 'review';
  seeingFullReview = signal(false);
  constructor() {}

  createReview(data: any) {
    return this.http.post(`${this.url}/create`, data);
  }
}
