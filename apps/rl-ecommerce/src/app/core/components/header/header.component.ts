import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { LayoutService } from '../../../shared/services/layout.service';
import { Router, RouterLink } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../../features/auth/services/auth.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  of,
} from 'rxjs';
import { ProductsService } from '../../../features/products/services/products.service';
import { IProduct } from '../../../features/products/model/product.interface';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    MenuModule,
    CurrencyPipe,
    AsyncPipe,
    LoaderComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private productService = inject(ProductsService);
  user = this.authService.user;
  userName = this.user()?.fullName.split(' ')[0]!;
  private layoutService = inject(LayoutService);
  private router = inject(Router);
  @ViewChild('input', { static: true }) searchInput!: ElementRef;
  searchShown = signal(false);
  isSearching = this.productService.isSearchingProducts;

  searchedProducts$: Observable<IProduct[] | null> = of(
    this.productService.searchedProductsSignal(),
  );

  products = this.productService.searchedProductsSignal;

  ngAfterViewInit() {
    this.getSearch();
  }

  getSearch() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        map((data) => this.searchInput.nativeElement.value.toLowerCase()),
      )
      .subscribe((val) => {
        this.productService.searchedProductsSignal.set(null);
        if (val !== '') {
          this.productService.getSearchedProducts(val);
        }
      });
  }

  onViewDetails(product: IProduct) {
    this.productService.activeProduct.set(product);
    this.productService.searchedProductsSignal.set(null);
    this.searchShown.set(false);
    this.searchInput.nativeElement.value = '';
    this.router.navigate(['/product/' + this.createSlug(product.name)], {
      queryParams: { id: product.id },
    });
  }

  onSignOut() {
    this.authService.signOut();
  }
  onToggleSearch() {
    if (this.searchInput.nativeElement.value) {
      this.searchInput.nativeElement.value = '';
      this.productService.searchedProductsSignal.set(null);
    }
    this.searchShown.set(!this.searchShown());
    if (this.searchShown()) {
      this.searchInput.nativeElement.focus();
    }
  }

  onOpenMenu() {
    this.layoutService.menuOpened.set(true);
  }

  createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special characters with hyphen
      .replace(/^-+|-+$/g, ''); // Trim leading or trailing hyphens
  }
}
