import { TestBed } from '@angular/core/testing';

import { TopSellingProductsChartService } from './top-selling-products-chart.service';

describe('TopSellingProductsChartService', () => {
  let service: TopSellingProductsChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopSellingProductsChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
