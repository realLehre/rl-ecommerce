import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  menuOpened = signal<boolean>(false);
  mobileFilterOpened = signal<boolean>(false);

  constructor() {}
}
