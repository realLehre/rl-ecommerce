import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { UserNavComponent } from '../user-nav/user-nav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [BreadcrumbComponent, UserNavComponent, RouterOutlet],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss',
})
export class UserAccountComponent {}
