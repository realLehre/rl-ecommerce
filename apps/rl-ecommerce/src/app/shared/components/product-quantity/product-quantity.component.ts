import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-product-quantity',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './product-quantity.component.html',
  styleUrl: './product-quantity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuantityComponent implements OnInit {
  quantity = input.required<number>();
  quantityMain!: number;
  quantityChanged = output<number>();
  isLoading = input<boolean>(false);

  ngOnInit() {
    this.quantityMain = this.quantity();
  }

  onAdjustQuantity(action: string) {
    // this.setLoader();

    if (action.toLowerCase() == 'increase') {
      this.quantityMain++;
    } else {
      if (this.quantity() == 0) {
        return;
      }
      this.quantityMain--;
    }
    this.quantityChanged.emit(this.quantityMain);
  }
}
