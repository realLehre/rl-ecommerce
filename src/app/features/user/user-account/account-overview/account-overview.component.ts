import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewComponent implements OnInit {
  private authService = inject(AuthService);
  user = this.authService.user;
  ngOnInit() {}
}
