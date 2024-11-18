import { TestBed } from '@angular/core/testing';

import { AdminProductsService } from './admin-products.service';

describe('AdminProductsService', () => {
  let service: AdminProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
