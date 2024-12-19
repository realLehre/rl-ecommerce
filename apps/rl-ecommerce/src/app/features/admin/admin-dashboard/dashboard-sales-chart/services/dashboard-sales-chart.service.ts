import { Injectable } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
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

  generateYears() {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = startYear; y < currentYear + 1; y++) {
      years.push(y);
    }
    return years.map((year) => {
      return { name: year, code: year };
    });
  }

  constructor() {}
}
