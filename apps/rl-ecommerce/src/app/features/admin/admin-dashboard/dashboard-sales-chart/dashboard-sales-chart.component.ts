import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ChartModule } from 'primeng/chart';
import {
  ChartOptions,
  DashboardSalesChartService,
} from './services/dashboard-sales-chart.service';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard-sales-chart',
  standalone: true,
  imports: [ChartModule, ChartComponent],
  templateUrl: './dashboard-sales-chart.component.html',
  styleUrl: './dashboard-sales-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSalesChartComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private dashboardSalesChartService = inject(DashboardSalesChartService);
  private cd = inject(ChangeDetectorRef);
  sales: any;
  months: any;
  data: any;
  options: any;
  chartOptions!: Partial<ChartOptions | any>;

  ngOnInit() {
    this.dashboardService.getSalesData().subscribe((res) => {
      this.sales = Object.values(res);
      this.months = Object.keys(res);
      this.initChart();
      this.initApexChart();
    });
  }

  initChart() {
    const { data, options } = this.dashboardSalesChartService.initPrimeChart(
      this.months,
      this.sales,
    );
    this.data = data;
    this.options = options;
    this.cd.markForCheck();
  }

  initApexChart() {
    this.chartOptions = this.dashboardSalesChartService.setApexChart(
      this.sales,
      this.months,
    );
  }
}
