import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import {
  ChartOptions,
  DashboardSalesChartService,
} from './services/dashboard-sales-chart.service';
import { ChartComponent } from 'ng-apexcharts';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-dashboard-sales-chart',
  standalone: true,
  imports: [ChartComponent, DropdownModule, FormsModule, SkeletonModule],
  templateUrl: './dashboard-sales-chart.component.html',
  styleUrl: './dashboard-sales-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSalesChartComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private dashboardSalesChartService = inject(DashboardSalesChartService);
  private cd = inject(ChangeDetectorRef);
  chartOptions!: Partial<ChartOptions | any>;
  years: { name: number; code: number }[] = [];
  selectedYear: { name: number; code: number } = {
    name: new Date().getFullYear(),
    code: new Date().getFullYear(),
  };
  isLoading = signal(false);

  ngOnInit() {
    const years = this.dashboardSalesChartService.generateYears();
    this.years = [...years];

    this.initChartData();
  }

  initChartData() {
    this.isLoading.set(true);
    this.dashboardService
      .getSalesData(this.selectedYear.code)
      .subscribe((res) => {
        const sales = Object.values(res);
        const months = Object.keys(res);
        this.initApexChart(sales, months);
      });
  }

  onChangeYear(event: { name: number; code: number }) {
    this.selectedYear = event;
    this.initChartData();
  }

  initApexChart(sales: number[], months: string[]) {
    this.chartOptions = this.dashboardSalesChartService.setApexChart(
      sales,
      months,
    );
    this.isLoading.set(false);
    // this.cd.detectChanges();
  }
}
