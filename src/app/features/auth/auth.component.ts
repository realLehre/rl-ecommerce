import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ChildrenOutletContexts,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Location } from '@angular/common';
import { slideInAnimation } from '../../route-animations';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  animations: [slideInAnimation],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  contexts = inject(ChildrenOutletContexts);
  private location = inject(Location);

  onNavigateBack() {
    this.location.back();
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
