import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

/// ****This gurd is used for pop up message to leaving in editing mode

export const preventUnsavedChangesGuard: CanDeactivateFn<
  MemberEditComponent
> = (component) => {
  if (component.editForm?.dirty) {
    return confirm('Make sure you saved your changes');
  }
  return true;
};
