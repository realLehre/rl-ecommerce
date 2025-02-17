import { Injectable, signal } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexLegend,
  ApexPlotOptions,
} from 'ng-apexcharts';
import { ITopSellingProductResponse } from '../../dashboard.interface';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
};

@Injectable({
  providedIn: 'root',
})
export class TopSellingProductsChartService {
  isLoading = signal(true);
  chart(data: ITopSellingProductResponse[]): Partial<ChartOptions> {
    const productNames = data?.map((item) => item.productDetails.name);
    const units = data?.map((item) => item.totalUnitsSold);
    return {
      series: [...units],
      chart: {
        type: 'donut',
        height: 430,
        events: {
          mounted: () => {
            this.isLoading.set(false);
          },
        },
      },
      labels: [...productNames],
      responsive: [
        {
          breakpoint: 2000,
          options: {
            chart: {
              width: '100%',
              // height: 434,
            },
            legend: {
              position: 'bottom',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#555555',
              // show: false,
            },
            style: {
              fontFamily: 'Arial, sans-serif',
              fontSize: '10px',
            },
          },
        },
      ],
    };
  }
}
