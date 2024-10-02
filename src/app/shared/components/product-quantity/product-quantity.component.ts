import { Component, input, OnInit, output } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-product-quantity',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './product-quantity.component.html',
  styleUrl: './product-quantity.component.scss',
})
export class ProductQuantityComponent implements OnInit {
  quantity = input.required<number>();
  quantityMain!: number;
  quantityChanged = output<number>();
  isLoading: boolean = false;

  ngOnInit() {
    this.quantityMain = this.quantity();
  }

  onAdjustQuantity(action: string) {
    this.setLoader();

    if (this.quantity() == 0) {
      return;
    }

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

  setLoader() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
