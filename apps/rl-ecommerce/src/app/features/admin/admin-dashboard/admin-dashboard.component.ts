import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardAnalyticsComponent } from './dashboard-analytics/dashboard-analytics.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DashboardAnalyticsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {}
