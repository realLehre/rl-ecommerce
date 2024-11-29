import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ErrorMessageDirective } from '../../../user/address/address-form/directives/error-message.directive';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { ProductOptionsService } from '../../../product-options/services/product-options.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DropdownModule } from 'primeng/dropdown';
import {
  ICategory,
  ISubCategory,
} from '../../../product-options/models/product-options.interface';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [
    ErrorMessageDirective,
    ReactiveFormsModule,
    NgClass,
    DropdownModule,
  ],
  templateUrl: './admin-add-product.component.html',
  styleUrl: './admin-add-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAddProductComponent implements OnInit {
  private optionsService = inject(ProductOptionsService);
  private fb = inject(FormBuilder);
  productForm!: FormGroup;
  categories = toSignal(this.optionsService.getCategories());
  subCategories: ISubCategory[] = [];

  ngOnInit() {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
      category: [null, Validators.required],
      subCategory: [null, Validators.required],
    });

    this.productForm
      .get('category')
      ?.valueChanges.subscribe((res: ICategory) => {
        this.subCategories = res.subCategories;
      });
  }

  isInvalidAndTouched(control: any) {
    return (
      this.productForm.get(control)?.touched &&
      this.productForm.get(control)?.invalid
    );
  }
}
