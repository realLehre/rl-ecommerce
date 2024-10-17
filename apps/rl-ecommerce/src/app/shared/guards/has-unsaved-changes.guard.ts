import { CanActivateFn, CanDeactivateFn, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export type CanDeactivateType =
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree;
export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}
export const hasUnsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
