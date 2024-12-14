import { TestBed } from '@angular/core/testing';

import { StateAuthService } from './state-auth.service';

describe('StateAuthService', () => {
  let service: StateAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
