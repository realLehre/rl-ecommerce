import { TestBed } from '@angular/core/testing';

import { QuillServiceService } from './quill-service.service';

describe('QuillServiceService', () => {
  let service: QuillServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuillServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
