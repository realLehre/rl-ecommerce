import { Component } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { PrimeTemplate } from 'primeng/api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [MenuModule, PrimeTemplate, RouterLink],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
})
export class AdminHeaderComponent {
  onSignOut() {}
}
