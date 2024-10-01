import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../services/products.service';
import { ProductCardComponent } from '../../products-showcase/product-card/product-card.component';

@Component({
  selector: 'app-recommended-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './recommended-products.component.html',
  styleUrl: './recommended-products.component.scss',
})
export class RecommendedProductsComponent {
  private productService = inject(ProductsService);

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  products = this.productService.products;

  showLeftArrow = false;
  showRightArrow = true;

  ngAfterViewInit() {
    this.checkArrowVisibility();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkArrowVisibility();
  }

  checkArrowVisibility() {
    const container = this.carouselContainer.nativeElement;
    this.showLeftArrow = container.scrollLeft > 0;
    this.showRightArrow =
      container.scrollLeft < container.scrollWidth - container.clientWidth;
    console.log(
      `scroll width: ${container.scrollWidth}, \`scroll scrollLeft: ${container.scrollLeft}, \`client width: ${container.clientWidth}`,
    );
  }

  scroll(direction: 'left' | 'right') {
    const container = this.carouselContainer.nativeElement;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    this.checkArrowVisibility();
  }
}
