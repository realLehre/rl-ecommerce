import { Component, inject, OnInit } from '@angular/core';
import { ProductOptionsService } from '../services/product-options.service';
import { Observable } from 'rxjs';
import { ICategory } from '../models/product-options.interface';
import { AsyncPipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [AsyncPipe, SkeletonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private optionsService = inject(ProductOptionsService);
  categories$: Observable<ICategory[]> = this.optionsService.getCategories();

  ngOnInit() {}
}
