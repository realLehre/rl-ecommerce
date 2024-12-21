import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { TopSellingProductsChartService } from './services/top-selling-products-chart.service';
import { DashboardService } from '../services/dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ITopSellingProductResponse } from '../dashboard.interface';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-top-selling-products-chart',
  standalone: true,
  imports: [ChartComponent, SkeletonModule],
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
  chartOptions = computed(() => {
    return this.chartData()
      ? this.topSellingProductsChartService.chart(this.chartData())
      : this.topSellingProductsChartService.chart([]);
  });
}
