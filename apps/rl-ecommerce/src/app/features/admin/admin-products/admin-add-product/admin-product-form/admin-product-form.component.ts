import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ProductOptionsService } from '../../../../product-options/services/product-options.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ICategory,
  ISubCategory,
} from '../../../../product-options/models/product-options.interface';
import { DropdownModule } from 'primeng/dropdown';
import { NgClass } from '@angular/common';
import { ErrorMessageDirective } from '../../../../user/address/address-form/directives/error-message.directive';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [
    DropdownModule,
    NgClass,
    ErrorMessageDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductFormComponent implements OnInit {
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

    this.productForm.get('category')?.valueChanges.subscribe((id: string) => {
      this.subCategories = this.categories()?.find(
        (cat) => cat.id == id,
      )?.subCategories!;
    });
  }

  isInvalidAndTouched(control: any) {
    return (
      this.productForm.get(control)?.touched &&
      this.productForm.get(control)?.invalid
    );
  }
}
