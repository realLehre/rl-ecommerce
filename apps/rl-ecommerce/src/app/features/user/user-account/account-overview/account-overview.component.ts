import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { OverviewFormComponent } from './overview-form/overview-form.component';
import { UserAccountService } from '../services/user-account.service';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [RouterLink, OverviewFormComponent, AsyncPipe],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewComponent implements OnInit {
  private authService = inject(AuthService);
  isEditingProfile = signal(false);
  private userAccountService = inject(UserAccountService);
  user$ = this.userAccountService.getUser();
  ngOnInit() {
    this.userAccountService.getUser().subscribe((res) => console.log(res));
  }

  onCancelProfileEdit() {
    this.isEditingProfile.set(false);
    this.user$ = of(JSON.parse(localStorage.getItem('hdjeyu7830nsk083hd')!));
  }
}
