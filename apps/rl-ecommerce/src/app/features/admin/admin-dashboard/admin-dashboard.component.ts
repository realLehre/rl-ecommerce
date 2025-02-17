import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardAnalyticsComponent } from './dashboard-analytics/dashboard-analytics.component';
import { DashboardSalesChartComponent } from './dashboard-sales-chart/dashboard-sales-chart.component';
import { TopSellingProductsChartComponent } from './top-selling-products-chart/top-selling-products-chart.component';
import { RecentOrdersComponent } from '../admin-orders/recent-orders/recent-orders.component';
import { ProductsLowInStockComponent } from './products-low-in-stock/products-low-in-stock.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    DashboardAnalyticsComponent,
    DashboardSalesChartComponent,
    TopSellingProductsChartComponent,
    RecentOrdersComponent,
    ProductsLowInStockComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {}
