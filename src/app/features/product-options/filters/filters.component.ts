import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [NgClass],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  isShowing: boolean[] = [false];

  ngOnInit() {
    console.log(this.isShowing);
  }

  onToggleFilter(index: number) {
    this.isShowing[index] = !this.isShowing[index];
    console.log(this.isShowing);
  }
}
