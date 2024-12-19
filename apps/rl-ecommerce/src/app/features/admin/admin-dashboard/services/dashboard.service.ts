import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { forkJoin, map, Observable } from 'rxjs';
import {
  IDashboardAnalytics,
  ITopSellingProductResponse,
} from '../dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'dashboard/';
  private readonly currentYear = new Date().getFullYear();

  constructor() {}

  getTotalSales() {
    return this.http.get<number>(`${this.baseUrl}analytics/total-sales`);
  }

  getTotalUsers() {
    return this.http.get<number>(`${this.baseUrl}analytics/total-users`);
  }

  getTotalProducts() {
    return this.http.get<number>(`${this.baseUrl}analytics/total-products`);
  }

  getDashboardAnalytics(): Observable<IDashboardAnalytics> {
    return forkJoin([
      this.getTotalSales(),
      this.getTotalUsers(),
      this.getTotalProducts(),
    ]).pipe(
      map((res) => {
        return {
          totalSales: res[0],
          totalUsers: res[1],
          totalProducts: res[2],
        };
      }),
    );
  }

  getSalesData(
    year: number = this.currentYear,
  ): Observable<IDashboardAnalytics> {
    return this.http.get<any>(`${this.baseUrl}monthly?year=${year}`);
  }

  getTopSellingProducts() {
    return this.http.get<ITopSellingProductResponse[]>(
      `${this.baseUrl}topSellingProducts`,
    );
  }
}
