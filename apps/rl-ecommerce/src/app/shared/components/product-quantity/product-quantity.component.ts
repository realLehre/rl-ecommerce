import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-quantity',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './product-quantity.component.html',
  styleUrl: './product-quantity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuantityComponent implements OnInit {
  private toast = inject(ToastService);
  quantity = input.required<number>();
  productUnitsLeft = input.required<number>();
  updateError = input(false);
  quantityMain = signal(1);
  holdQuantity = computed(() => this.quantity());
  quantityChanged = output<number>();
  isLoading = input<boolean>(false);

  ngOnInit() {
    this.quantityMain.set(this.quantity());
    console.log(this.quantity());
  }

  onAdjustQuantity(action: string) {
    if (this.isLoading()) {
      return;
    }
    if (this.updateError()) {
      this.quantityMain.set(this.quantity());
    }
    if (action.toLowerCase() == 'increase') {
      if (this.quantityMain() == this.productUnitsLeft()) {
        this.toast.showToast({
          type: 'error',
          message: 'Order quantity can not exceed available units!',
        });
        return;
      }
      this.quantityMain.update((count) => count + 1);
    } else {
      if (this.quantityMain() == 1) {
        return;
      }
      this.quantityMain.update((count) => count - 1);
    }
    this.quantityChanged.emit(this.quantityMain());
  }
}
