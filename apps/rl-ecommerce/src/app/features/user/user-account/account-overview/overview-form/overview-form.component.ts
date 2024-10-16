import { Component, inject, OnInit, output } from '@angular/core';
import { ErrorMessageDirective } from '../../../address/address-form/directives/error-message.directive';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../../auth/services/auth.service';
import { AddressService } from '../../../address/services/address.service';
import { UserAccountService } from '../../services/user-account.service';

@Component({
  selector: 'app-overview-form',
  standalone: true,
  imports: [ErrorMessageDirective, ReactiveFormsModule, NgClass],
  templateUrl: './overview-form.component.html',
  styleUrl: './overview-form.component.scss',
})
export class OverviewFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private addressService = inject(AddressService);
  private userAccountService = inject(UserAccountService);
  profileForm!: FormGroup;
  cancelEdit = output<void>();

  ngOnInit() {
    this.profileForm = this.fb.group({
      fullName: [null, Validators.required],
      email: [null, Validators.required],
      phoneNumber: [
        null,
        [Validators.required, this.addressService.phoneNumberValidator],
      ],
    });

    const user = this.authService.user();
    if (user) {
      this.profileForm.setValue({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.userAccountService.getUser();
    }
  }

  isInvalidAndTouched(controlName: string) {
    const control = this.profileForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
}
