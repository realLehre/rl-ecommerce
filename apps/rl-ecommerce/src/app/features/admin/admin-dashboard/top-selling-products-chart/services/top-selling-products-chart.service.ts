import { Injectable } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';
import { ITopSellingProductResponse } from '../../dashboard.interface';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Injectable({
  providedIn: 'root',
})
export class TopSellingProductsChartService {
  chart(data: ITopSellingProductResponse[]): Partial<ChartOptions> {
    const productNames = data?.map((item) => item.productDetails.name);
    const units = data?.map((item) => item.totalUnitsSold);
    return {
      series: [...units],
      chart: {
        type: 'donut',
      },
      labels: [...productNames],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
              height: 500,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  test: Partial<ChartOptions> = {
    series: [100, 20, 46],
    chart: {
      type: 'donut',
    },
    labels: ['test1', 'test2', 'test3'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
            height: '400px',
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };
}
