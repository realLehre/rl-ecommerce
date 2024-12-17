import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'dashboard-analytics/';

  constructor() {}

  getTotalSales() {
    return this.http.get<number>(`${this.baseUrl}total-sales`);
  }

  getTotalUsers() {
    return this.http.get<number>(`${this.baseUrl}total-users`);
  }

  getTotalProducts() {
    return this.http.get<number>(`${this.baseUrl}total-products`);
  }

  getDashboardAnalytics() {
    return forkJoin({
      totalSales: this.getTotalSales(),
      totalUsers: this.getTotalUsers(),
      totalProducts: this.getTotalProducts(),
    });
  }
}
