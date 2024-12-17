import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { forkJoin, map, Observable } from 'rxjs';
import { IDashboardAnalytics } from '../dashboard.interface';

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
}
