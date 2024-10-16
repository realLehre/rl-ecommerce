import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  categories: { title: string; total: number }[] = [
    { title: 'Figures & Playlists', total: 4 },
    { title: 'Dolls', total: 6 },
    { title: 'Building Sets & Blocks', total: 2 },
    { title: 'Remote-Control Toys', total: 5 },
  ];
}
