import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { ErrorMessageDirective } from '../../../address/address-form/directives/error-message.directive';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { AddressService } from '../../../address/services/address.service';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { IUser } from '../../../models/user.interface';
import { Store } from '@ngrx/store';
import { updateUser } from '../../../../../state/user/user.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectUserUpdateOperations } from '../../../../../state/state';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-overview-form',
  standalone: true,
  imports: [
    ErrorMessageDirective,
    ReactiveFormsModule,
    NgClass,
    LoaderComponent,
  ],
  templateUrl: './overview-form.component.html',
  styleUrl: './overview-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private addressService = inject(AddressService);
  private toastService = inject(ToastService);
  private store = inject(Store);
  user = input.required<IUser | null>();
  profileForm!: FormGroup;
  cancelEdit = output<void>();
  isLoading = toSignal(
    this.store.select(selectUserUpdateOperations).pipe(
      tap((res) => {
        if (res?.error) {
          this.toastService.showToast({
            type: 'error',
            message: res?.error,
          });
        } else if (res?.status === 'success') {
          this.toastService.showToast({
            type: 'success',
            message: 'Profile updated!',
          });
          this.cancelEdit.emit();
        }
      }),
      map((res) => res?.loading),
    ),
  );

  ngOnInit() {
    this.profileForm = this.fb.group({
      fullName: [this.user()?.name, Validators.required],
      email: [this.user()?.email, Validators.required],
      phoneNumber: [
        this.user()?.phoneNumber ?? null,
        [Validators.required, this.addressService.phoneNumberValidator],
      ],
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const data = {
        name: this.profileForm.value.fullName,
        phoneNumber: this.profileForm.value.phoneNumber,
      };

      this.store.dispatch(updateUser(data));
    }
  }

  isInvalidAndTouched(controlName: string) {
    const control = this.profileForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
}
