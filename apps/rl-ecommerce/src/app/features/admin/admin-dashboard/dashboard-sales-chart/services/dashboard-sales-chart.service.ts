import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Injectable({
  providedIn: 'root',
})
export class DashboardSalesChartService {
  platformId = inject(PLATFORM_ID);
  initPrimeChart(
    months: string[],
    sales: number[],
  ): { data: any; options: any } | any {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color',
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color',
      );

      const data = {
        labels: months,
        datasets: [
          {
            label: 'First Dataset',
            data: sales,
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
            tension: 0.4,
          },
        ],
      };

      const options = {
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

      return {
        data,
        options,
      };
    }
    return;
  }

  colors: string[] = ['#17ef1a'];

  setApexChart(sales: number[], months: string[]) {
    const chartData: { name: string; data: number[] }[] = [
      {
        name: 'Sales',
        data: [...sales],
      },
    ];
    return {
      series: [...chartData],
      legend: {
        show: false,
      },
      chart: {
        width: '100%',
        height: 350,
        type: 'area',
        toolbar: { show: false },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: [...this.colors],
      },
      fill: {
        colors: [...this.colors],
        type: 'gradient',
        gradient: {
          type: 'vertical',
          shadeIntensity: 1,
          opacityFrom: 0.6,
          gradientToColors: [...this.colors],
          opacityTo: 0,
          stops: [0, 100],
        },
      },
      xaxis: {
        type: 'month',
        categories: [...months],
        labels: {
          style: {
            colors: '#333333',
            fontSize: '12px',
            fontFamily: 'Inter, Arial, sans-serif',
            fontWeight: 500,
          },
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: '#333333',
            fontSize: '12px',
            fontFamily: 'Inter, Arial, sans-serif',
            fontWeight: 500,
          },
          formatter: (value: number) => {
            return '₦' + value.toLocaleString();
          },
        },
      },

      tooltip: {
        theme: 'dark',
        x: {
          format: 'dd/MM/yy HH:mm',
        },
        y: {
          formatter: (value: number) => {
            return '₦' + value.toLocaleString();
          },
        },
      },
      grid: {
        show: false,
        borderColor: '#56577A',
        strokeDashArray: 4,
        xaxis: {
          show: false,
          lines: {
            show: false,
          },
        },
      },
    };
  }

  constructor() {}
}
