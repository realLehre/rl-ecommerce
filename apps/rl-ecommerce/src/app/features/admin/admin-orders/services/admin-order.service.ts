import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminOrderService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'order';
  constructor() {}

  getRecentOrders() {
    return this.http.get(this.apiUrl + '/recent');
  }
}
