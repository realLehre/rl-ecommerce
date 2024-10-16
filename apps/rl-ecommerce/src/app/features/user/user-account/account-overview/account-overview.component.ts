import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit, signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import {OverviewFormComponent} from "./overview-form/overview-form.component";

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [RouterLink, OverviewFormComponent],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewComponent implements OnInit {
  private authService = inject(AuthService);
  user = this.authService.user;
  isEditingProfile = signal(false);
  ngOnInit() {}

  onCancelProfileEdit() {
    this.isEditingProfile.set(false);
  }
}
