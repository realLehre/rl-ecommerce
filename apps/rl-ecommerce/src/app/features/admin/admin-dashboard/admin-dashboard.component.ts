import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardAnalyticsComponent } from './dashboard-analytics/dashboard-analytics.component';
import { DashboardSalesChartComponent } from './dashboard-sales-chart/dashboard-sales-chart.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DashboardAnalyticsComponent, DashboardSalesChartComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {}
