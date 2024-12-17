import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard-analytics',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './dashboard-analytics.component.html',
  styleUrl: './dashboard-analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAnalyticsComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  ngOnInit() {
    this.dashboardService
      .getDashboardAnalytics()
      .subscribe((res) => console.log(res));
  }
}
