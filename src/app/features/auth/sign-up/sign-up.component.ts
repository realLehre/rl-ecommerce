import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ErrorMessageDirective } from '../../user/address/address-form/directives/error-message.directive';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ErrorMessageDirective, NgClass],
  templateUrl: './sign-up.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  fb = inject(FormBuilder);
  signupForm!: FormGroup;
  showPassword: boolean[] = [];
  passwordMatch: boolean = true;

  constructor() {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
      // Here you would typically call a service to handle the sign-up process
    }
  }

  onKey(event: any) {
    if (!this.signupForm.get('confirmPassword')?.dirty) {
      return;
    }
    this.passwordMatch =
      this.signupForm.get('password')?.value ===
      this.signupForm.get('confirmPassword')?.value;
  }

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
  onTogglePasswordVisibility(index: number) {
    this.showPassword[index] = !this.showPassword[index];
  }
}
