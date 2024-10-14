import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
  ViewContainerRef,
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
import { AuthService } from '../services/auth.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ToastService } from '../../../shared/services/toast.service';
import { ToastModule } from 'primeng/toast';
import { PasswordMatchDirective } from '../directives/password-match.directive';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ErrorMessageDirective,
    NgClass,
    LoaderComponent,
    ToastModule,
    PasswordMatchDirective,
  ],
  templateUrl: './sign-up.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  fb = inject(FormBuilder);
  private vcr = inject(ViewContainerRef);
  isLoading = signal<boolean>(false);
  signupForm!: FormGroup;
  showPassword: boolean[] = [];
  passwordMatch: boolean = true;

  constructor() {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6)]],
    });

    this.toastService.vcr = this.vcr;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      const data = this.authService.formatSignUpData(this.signupForm.value);

      this.authService.signUp(data).subscribe({
        next: (res) => {
          this.isLoading.set(false);

          if (res.error) {
            const message = this.authService.getError(res.error);

            this.toastService.showToast({
              type: 'error',
              message: message!,
            });
          } else {
            this.toastService.showToast({
              type: 'success',
              message: 'Sign up successfully!',
            });
          }
          console.log(res);
        },
        error: (err) => {
          this.isLoading.set(false);
        },
      });
    }
  }

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
  onTogglePasswordVisibility(index: number) {
    this.showPassword[index] = !this.showPassword[index];
  }
}
