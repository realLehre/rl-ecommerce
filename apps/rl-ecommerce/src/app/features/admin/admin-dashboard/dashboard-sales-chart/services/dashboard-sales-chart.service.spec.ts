import { TestBed } from '@angular/core/testing';

import { DashboardSalesChartService } from './dashboard-sales-chart.service';

describe('DashboardSalesChartService', () => {
  let service: DashboardSalesChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardSalesChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
