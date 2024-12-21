import { TestBed } from '@angular/core/testing';

import { ProductsLowInStockService } from './products-low-in-stock.service';

describe('ProductsLowInStockService', () => {
  let service: ProductsLowInStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsLowInStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
