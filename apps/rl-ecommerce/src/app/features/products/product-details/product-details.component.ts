import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductDetailsImagesComponent } from './product-details-images/product-details-images.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { RecommendedProductsComponent } from '../recommended-products/recommended-products.component';
import { ProductQuantityComponent } from '../../../shared/components/product-quantity/product-quantity.component';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { ProductsService } from '../services/products.service';
import { filter, Observable } from 'rxjs';
import { IProduct } from '../model/product.interface';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { CartService } from '../../../shared/services/cart.service';
import { UserAccountService } from '../../user/user-account/services/user-account.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    ProductDetailsImagesComponent,
    LoaderComponent,
    RecommendedProductsComponent,
    ProductQuantityComponent,
    RouterLink,
    AsyncPipe,
    SkeletonModule,
    CurrencyPipe,
    NgClass,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductsService);
  private cartService = inject(CartService);
  private userService = inject(UserAccountService);
  private toast = inject(ToastService);
  product$!: Observable<IProduct>;
  similarProducts!: Observable<IProduct[]>;
  quantity: number = 1;
  isLoading: boolean = false;
  activeProduct = this.productService.activeProduct;
  isCollapsed = signal(true);
  limit = 200;
  cdr = inject(ChangeDetectorRef);
  isAddingToCart = signal(false);
  productId!: string;

  ngOnInit() {
    this.productId = this.route.snapshot.queryParams['id'];
    this.product$ = this.productService.getProductById(this.productId);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.productId = this.route.snapshot.queryParams['id'];
        this.product$ = this.productService.getProductById(this.productId);
        this.cdr.detectChanges();
      });
  }

  onAddToCart(product: IProduct) {
    this.isAddingToCart.set(true);

    this.cartService
      .addToCart({
        product: product,
        unit: this.quantity,
      })!
      .subscribe({
        next: (res) => {
          this.isAddingToCart.set(false);
          const cartTotal = this.cartService.cartTotal;
          if (cartTotal()) {
            this.cartService.cartTotal.set(cartTotal()! + 1);
          }
          this.cartService.cartSignal.set(null);
          this.cartService.getCart()!.subscribe();
          this.toast.showToast({
            type: 'success',
            message: `${product.name} added to cart!`,
          });
        },
        error: (err) => {
          this.isAddingToCart.set(false);
          this.toast.showToast({
            type: 'error',
            message: err.error.message,
          });
        },
      });
  }

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  onAdjustQuantity(qty: number) {
    this.quantity = qty;
  }
}
