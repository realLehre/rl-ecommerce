import { TestBed } from '@angular/core/testing';

import { MQuillService } from './quill-service.service';

describe('MQuillService', () => {
  let service: MQuillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MQuillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
