import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard-sales-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './dashboard-sales-chart.component.html',
  styleUrl: './dashboard-sales-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSalesChartComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);
  sales: any;
  months: any;
  data: any;
  options: any;

  ngOnInit() {
    this.dashboardService.getSalesData().subscribe((res) => {
      this.sales = Object.values(res);
      this.months = Object.keys(res);
      this.initChart();
    });
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color',
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color',
      );

      this.data = {
        labels: this.months,
        datasets: [
          {
            label: 'First Dataset',
            data: this.sales,
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
            tension: 0.4,
          },
        ],
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }
}
