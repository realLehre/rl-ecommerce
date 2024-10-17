import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { hasUnsavedChangesGuard } from './has-unsaved-changes.guard';

describe('hasUnsavedChangesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => hasUnsavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
