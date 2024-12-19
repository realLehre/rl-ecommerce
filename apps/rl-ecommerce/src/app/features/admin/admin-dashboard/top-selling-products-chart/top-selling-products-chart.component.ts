import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import {
  ChartOptions,
  TopSellingProductsChartService,
} from './services/top-selling-products-chart.service';
import { DashboardService } from '../services/dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ITopSellingProductResponse } from '../dashboard.interface';

@Component({
  selector: 'app-top-selling-products-chart',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './top-selling-products-chart.component.html',
  styleUrl: './top-selling-products-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopSellingProductsChartComponent {
  private readonly topSellingProductsChartService = inject(
    TopSellingProductsChartService,
  );
  private readonly dashboardService = inject(DashboardService);
  chartData = toSignal(this.dashboardService.getTopSellingProducts(), {
    initialValue: [] as ITopSellingProductResponse[],
  });
  chartOptions2 = computed(() => {
    return this.chartData()
      ? this.topSellingProductsChartService.chart(this.chartData())
      : ({} as Partial<ChartOptions>);
  });
}
