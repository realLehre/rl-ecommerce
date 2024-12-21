import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DashboardSalesChartService } from './services/dashboard-sales-chart.service';
import { ChartComponent } from 'ng-apexcharts';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, Observable, switchMap, tap } from 'rxjs';
import { ISalesDataResponse } from '../dashboard.interface';

@Component({
  selector: 'app-dashboard-sales-chart',
  standalone: true,
  imports: [ChartComponent, DropdownModule, FormsModule, SkeletonModule],
  templateUrl: './dashboard-sales-chart.component.html',
  styleUrl: './dashboard-sales-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSalesChartComponent {
  private dashboardService = inject(DashboardService);
  private dashboardSalesChartService = inject(DashboardSalesChartService);
  years = this.dashboardSalesChartService.years;
  selectedYear = {
    name: new Date().getFullYear(),
    code: new Date().getFullYear(),
  };
  activeYear = signal(this.selectedYear);
  chartData$: Observable<ISalesDataResponse> = toObservable(
    this.activeYear,
  ).pipe(
    switchMap((year) => this.dashboardService.getSalesData(year.code)),
    map((res) => {
      if (res.hasOwnProperty('Jan')) {
        const sales: number[] = Object.values(res);
        const months: string[] = Object.keys(res);
        return this.dashboardSalesChartService.setApexChart(sales, months);
      } else {
        return this.dashboardSalesChartService.setApexChart([], []);
      }
    }),
  );
  chartOptions: Signal<any> = toSignal(this.chartData$, {
    initialValue: this.dashboardSalesChartService.setApexChart([], []),
  });

  onChangeYear(event: { name: number; code: number }) {
    this.selectedYear = event;
    this.activeYear.set(event);
  }
}
