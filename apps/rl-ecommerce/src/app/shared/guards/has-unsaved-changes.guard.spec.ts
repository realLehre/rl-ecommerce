import { TestBed } from '@angular/core/testing';
import { CanActivateFn, CanDeactivateFn } from '@angular/router';

import { hasUnsavedChangesGuard } from './has-unsaved-changes.guard';

describe('hasUnsavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn<any> = (
    component,
    currentRoute,
    currentState,
    nextState,
  ) =>
    TestBed.runInInjectionContext(() =>
      hasUnsavedChangesGuard(component, currentRoute, currentState, nextState),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
