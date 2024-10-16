import { TestBed } from '@angular/core/testing';

import { ProductOptionsService } from './product-options.service';

describe('ProductOptionsService', () => {
  let service: ProductOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
