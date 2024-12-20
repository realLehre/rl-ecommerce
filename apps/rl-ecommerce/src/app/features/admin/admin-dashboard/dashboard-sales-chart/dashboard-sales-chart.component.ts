import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
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
import { Observable, switchMap } from 'rxjs';
import { ISalesDataResponse } from '../dashboard.interface';

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
  years = this.dashboardSalesChartService.years;
  selectedYear = {
    name: new Date().getFullYear(),
    code: new Date().getFullYear(),
  };
  activeYear = signal(this.selectedYear);
  chartData$: Observable<ISalesDataResponse> = toObservable(
    this.activeYear,
  ).pipe(switchMap((year) => this.dashboardService.getSalesData(year.code)));
  chartDataResponse: Signal<ISalesDataResponse> = toSignal(this.chartData$, {
    initialValue: {},
  });
  chartOptions = computed(() => {
    if (this.chartDataResponse().hasOwnProperty('Jan')) {
      const sales: number[] = Object.values(this.chartDataResponse());
      const months: string[] = Object.keys(this.chartDataResponse());
      return this.dashboardSalesChartService.setApexChart(sales, months);
    } else {
      return this.dashboardSalesChartService.setApexChart([], []);
    }
  });

  ngOnInit() {}

  onChangeYear(event: { name: number; code: number }) {
    this.selectedYear = event;
    this.activeYear.set(event);
  }
}
