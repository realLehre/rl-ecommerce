import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ToastService } from '../../../shared/services/toast.service';
import { UserAccountService } from '../../user/user-account/services/user-account.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  loginForm!: FormGroup;
  showPassword: boolean[] = [];
  isLoading = signal<boolean>(false);

  constructor() {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const data = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      const { error } = await this.authService.login(data);

      try {
        if (error) {
          this.toastService.showToast({
            type: 'error',
            message: error.message,
          });
          return;
        }

        this.toastService.showToast({
          type: 'success',
          message: 'Signed in successfully!',
        });
        const user = this.authService.user;

        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (user()?.id !== '8133ae62-c817-4339-a62d-dc718ce99568') {
          this.router.navigateByUrl(returnUrl || '/');
        } else {
          this.router.navigate(['/', 'admin']);
        }
      } catch (error) {
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async onSignInWithGoogle() {
    await this.authService.continueWithGoogle();
  }

  onTogglePasswordVisibility(index: number) {
    this.showPassword[index] = !this.showPassword[index];
  }
}
