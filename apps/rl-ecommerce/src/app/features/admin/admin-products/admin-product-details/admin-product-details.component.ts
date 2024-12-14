import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { AsyncPipe, CurrencyPipe, Location, NgClass } from '@angular/common';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { PricePercentageDecreasePipe } from '../../../../shared/pipes/price-percentage-decrease.pipe';
import { ProductDetailsImagesComponent } from '../../../products/product-details/product-details-images/product-details-images.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { AdminProductsService } from '../services/admin-products.service';
import { of, switchMap } from 'rxjs';
import { IProduct } from '../../../products/model/product.interface';
import { toObservable } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-product-details',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    LoaderComponent,
    PricePercentageDecreasePipe,
    ProductDetailsImagesComponent,
    SkeletonModule,
    NgClass,
  ],
  templateUrl: './admin-product-details.component.html',
  styleUrl: './admin-product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductDetailsComponent {
  private productService = inject(AdminProductsService);
  private router = inject(Router);
  private location = inject(Location);
  private sanitizer = inject(DomSanitizer);
  id = input.required<string>();
  product$ = toObservable(this.id).pipe(
    switchMap((id) => this.productService.getProductById(id!)),
  );
  isDeletingProduct = signal(false);
  isCollapsed = signal(true);
  limit = 200;

  sanitizedDescription(desc: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(desc);
  }

  stripedDescription(desc: string) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = desc;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  onDeleteProduct(product: IProduct) {}

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  onEdit(product: IProduct) {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    this.router.navigate(['/', 'admin', 'add-product'], {
      queryParams: { edit: true },
    });
  }

  onNavigateBack() {
    this.location.back();
  }
}
