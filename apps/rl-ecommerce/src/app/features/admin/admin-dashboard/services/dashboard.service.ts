import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { forkJoin, map, Observable, retry } from 'rxjs';
import {
  IDashboardAnalytics,
  ISalesDataResponse,
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
      retry(3),
      map((res) => {
        return {
          totalSales: res[0],
          totalUsers: res[1],
          totalProducts: res[2],
        };
      }),
    );
  }

  getSalesData(year: number = this.currentYear): Observable<{}> {
    return this.http.get<ISalesDataResponse>(
      `${this.baseUrl}monthly?year=${year}`,
    );
  }

  getTopSellingProducts() {
    return this.http.get<ITopSellingProductResponse[]>(
      `${this.baseUrl}topSellingProducts`,
    );
  }
}
