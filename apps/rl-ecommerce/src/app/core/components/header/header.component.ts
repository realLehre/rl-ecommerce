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
import { CurrencyPipe, NgClass } from '@angular/common';
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
} from 'rxjs';
import { ProductsService } from '../../../features/products/services/products.service';
import { IProduct } from '../../../features/products/model/product.interface';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CartService } from '../../../shared/services/cart.service';
import { StateAuthService } from '../../../shared/services/state-auth.service';
import { Store } from '@ngrx/store';
import { loadCart } from '../../../state/cart/cart.actions';
import { selectCartState } from '../../../state/state';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserAccountService } from '../../../features/user/user-account/services/user-account.service';
import { logout_clearState } from '../../../state/state.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterLink, MenuModule, CurrencyPipe, LoaderComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements AfterViewInit, OnInit {
  private authService = inject(AuthService);
  private userAccountService = inject(UserAccountService);
  private productService = inject(ProductsService);
  private cartService = inject(CartService);
  private stateAuthService = inject(StateAuthService);
  private store = inject(Store);
  user = computed(() => this.userAccountService.userSignal);
  userName = computed(() => {
    console.log(this.userAccountService.userSignal());
    return this.userAccountService.userSignal()?.name!.split(' ')[0]!;
  });
  private layoutService = inject(LayoutService);
  private router = inject(Router);
  @ViewChild('input', { static: true }) searchInput!: ElementRef;
  searchShown = signal(false);
  isSearching = this.productService.isSearchingProducts;
  cartItems = this.cartService.cartTotal;
  cart$ = this.store.select(selectCartState);
  cartData = toSignal(this.cart$);
  products = this.productService.searchedProductsSignal;

  ngOnInit() {
    this.store.dispatch(loadCart());
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
        map(() => this.searchInput.nativeElement.value.toLowerCase()),
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
    this.store.dispatch(logout_clearState());
    this.router.navigate(['/']).then(() => {
      this.stateAuthService.resetState();
    });
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
  }
}
