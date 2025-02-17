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
import { AuthService } from '../services/auth.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoaderComponent],
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

    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.authService.RETURN_URL.set(returnUrl);
    }
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

        const returnUrl = this.authService.RETURN_URL();
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

  onAdminSignIn() {
    this.isLoading.set(true);
    this.loginForm.setValue({
      email: 'admin@admin.com',
      password: 'Test1234@admin',
    });
    this.onSubmit();
  }

  async onSignInWithGoogle() {
    await this.authService.continueWithGoogle();
  }

  onTogglePasswordVisibility(index: number) {
    this.showPassword[index] = !this.showPassword[index];
  }
}
