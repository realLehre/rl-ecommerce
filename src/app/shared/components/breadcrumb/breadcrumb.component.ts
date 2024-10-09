import { Component, inject, input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent implements OnInit {
  router = inject(Router);
  pages = input.required<{ name: string; route: string }[]>();
  newPages: { name: string; route: string }[] = [];

  ngOnInit() {
    const pages = this.pages();
    if (pages?.length) {
      this.newPages = [{ name: 'home', route: '/' }, ...pages];
    }
  }
}
