import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/products.service';
import { ProductCardComponent } from '../../products-showcase/product-card/product-card.component';
import { Observable } from 'rxjs';
import { IProduct } from '../model/product.interface';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-recommended-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, SkeletonModule],
  templateUrl: './recommended-products.component.html',
  styleUrl: './recommended-products.component.scss',
})
export class RecommendedProductsComponent implements OnInit, AfterViewInit {
  private productService = inject(ProductsService);
  @ViewChild('carouselContainer')
  carouselContainer!: ElementRef;
  query = input<{ productId: string; categoryId: string }>();
  products$!: Observable<IProduct[]>;
  loadProductDetails = output();

  ngOnInit() {
    if (this.query()) {
      this.products$ = this.productService.getSimilarProducts(
        this.query()?.categoryId!,
        this.query()?.productId!,
      );
    }
  }

  showLeftArrow = false;
  showRightArrow = true;

  ngAfterViewInit() {
    this.checkArrowVisibility();
    this.showRightArrow = true;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkArrowVisibility();
  }

  checkArrowVisibility() {
    const container = this.carouselContainer?.nativeElement;
    if (container) {
      this.showLeftArrow = container.scrollLeft > 0;
      this.showRightArrow =
        container.scrollLeft < container.scrollWidth - container.clientWidth;
    }
  }

  scroll(direction: 'left' | 'right') {
    const container = this.carouselContainer.nativeElement;
    const scrollAmount = container.clientWidth;
    this.showLeftArrow = direction == 'right';

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    this.checkArrowVisibility();
  }
}
