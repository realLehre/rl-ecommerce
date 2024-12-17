import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';
import { Observable } from 'rxjs';
import { IDashboardAnalytics } from '../dashboard.interface';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-dashboard-analytics',
  standalone: true,
  imports: [CurrencyPipe, AsyncPipe, SkeletonModule],
  templateUrl: './dashboard-analytics.component.html',
  styleUrl: './dashboard-analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAnalyticsComponent {
  private dashboardService = inject(DashboardService);
  analyticsData$: Observable<IDashboardAnalytics> =
    this.dashboardService.getDashboardAnalytics();
}
