import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { LayoutService } from '../../../shared/services/layout.service';
import { Router, RouterLink } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import {
  AuthService,
  IUser,
} from '../../../features/auth/services/auth.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { ProductsService } from '../../../features/products/services/products.service';
import { IProduct } from '../../../features/products/model/product.interface';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ProductOptionsService } from '../../../features/product-options/services/product-options.service';
import { NumberOfFiltersPipe } from '../../../shared/pipes/number-of-filters.pipe';
import { CartService } from '../../../shared/services/cart.service';
import { UserAccountService } from '../../../features/user/user-account/services/user-account.service';
import { CookieService } from 'ngx-cookie-service';

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
    NumberOfFiltersPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements AfterViewInit, OnInit {
  private authService = inject(AuthService);
  private productService = inject(ProductsService);
  private optionsService = inject(ProductOptionsService);
  private cartService = inject(CartService);
  user = this.authService.user;
  private userAccountService = inject(UserAccountService);
  private cookieService = inject(CookieService);
  userName = computed(() => {
    return this.user()?.fullName.split(' ')[0]!;
  });
  private layoutService = inject(LayoutService);
  private router = inject(Router);
  @ViewChild('input', { static: true }) searchInput!: ElementRef;
  searchShown = signal(false);
  isSearching = this.productService.isSearchingProducts;
  cartItems = this.cartService.cartTotal;

  searchedProducts$: Observable<IProduct[] | null> = of(
    this.productService.searchedProductsSignal(),
  );

  products = this.productService.searchedProductsSignal;

  ngOnInit() {
    this.cartService.cartSignal.set(null);
    this.cartService.getCart().subscribe();
  }

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
    this.router.navigate(
      ['/product/' + this.productService.createSlug(product.name)],
      {
        queryParams: { id: product.id },
      },
    );
  }

  onSignOut() {
    this.authService.signOut();
    this.cartService.cartSignal.set(null);
    this.cartService.cartTotal.set(null);
    this.userAccountService.userSignal.set(null);
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

  onRouteHome() {
    this.router.navigate(['/']);
    this.productService.productSignal.set(null);
    this.optionsService.currentPage.set(1);
    this.optionsService.currentPriceFilter.set(null);
    this.optionsService.currentSort.set(null);
    this.optionsService.currentCategory.set(null);
    this.optionsService.currentSubCategory.set(null);
    sessionStorage.removeItem('hshs82haa02sshs92s');
  }
}
