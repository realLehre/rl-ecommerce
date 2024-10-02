import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-cart',
  standalone: true,
  imports: [RouterLink],
  template: `<div
    class="flex flex-col items-center text-center w-full mobile:w-1/2 mx-auto space-y-1 mt-8 pb-[200px]"
  >
    <img src="assets/images/empty-cart.png" alt="" />
    <div>
      <h2 class="text-type_title text-2xl mobile:text-3xl font-semibold">
        Your cart is empty!
      </h2>

      <p class="text-sm mobile:text-lg text-type_caption mt-1 mb-10">
        Looks like you haven’t added anything to your cart yet.
      </p>

      <button
        class="w-full rounded-full text-white font-medium bg-primary py-2 h-12 block"
        routerLink="/"
      >
        Continue Shopping
      </button>
    </div>
  </div>`,
  styles: ``,
})
export class EmptyCartComponent {}
