import { TestBed } from '@angular/core/testing';

import { UserOrdersService } from './user-orders.service';

describe('UserOrdersService', () => {
  let service: UserOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
