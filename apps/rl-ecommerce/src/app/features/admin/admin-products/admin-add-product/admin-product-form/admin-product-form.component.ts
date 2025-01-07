import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  OnInit,
  output,
  signal,
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
import { QuillEditorComponent, QuillModules } from 'ngx-quill';
import Quill from 'quill';
import { EditorModule } from 'primeng/editor';
import { MQuillService } from '../../../../../shared/services/quill-service.service';
import { IProduct } from '../../../../products/model/product.interface';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [
    DropdownModule,
    NgClass,
    ErrorMessageDirective,
    ReactiveFormsModule,
    QuillEditorComponent,
    EditorModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductFormComponent implements OnInit {
  private quillService = inject(MQuillService);
  private optionsService = inject(ProductOptionsService);
  private fb = inject(FormBuilder);
  productForm!: FormGroup;
  modules: QuillModules = this.quillService.modules;
  formValue = output<any>();
  categories = toSignal(this.optionsService.getCategories());
  categoryId = signal<string>('');
  html = signal<any>('');
  editorCreated = signal(false);
  productData = input<IProduct | undefined>(undefined);
  subCategories = computed((): ISubCategory[] => {
    return (
      this.categories()?.find((category) => category.id == this.categoryId())
        ?.subCategories ?? []
    );
  });

  ngOnInit() {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      previousPrice: [null, Validators.min(0)],
      unit: [null, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      subCategoryId: [null, Validators.required],
      description: [null, Validators.required],
    });

    if (this.productData()) {
      this.productForm.setValue({
        name: this.productData()?.name,
        price: this.productData()?.price,
        previousPrice: this.productData()?.previousPrice,
        unit: this.productData()?.unit,
        categoryId: this.productData()?.categoryId,
        subCategoryId: this.productData()?.subCategoryId,
        description: this.productData()?.description,
      });
      this.categoryId.set(this.productData()?.categoryId as string);
    }

    this.formValue.emit(this.productForm);

    this.productForm.valueChanges.subscribe((value) => {
      this.formValue.emit(this.productForm);
    });

    this.productForm.get('categoryId')?.valueChanges.subscribe((id: string) => {
      this.categoryId.set(id);
    });

    this.productForm
      .get('description')
      ?.valueChanges.subscribe((value: string) => {
        this.html.set(value);
      });
  }

  isPreviousPriceMore() {
    return (
      this.productForm.get('previousPrice')?.value &&
      this.productForm.get('price')?.value &&
      this.productForm.value.price >= this.productForm.value.previousPrice
    );
  }

  isInvalidAndTouched(control: any) {
    return (
      this.productForm.get(control)?.touched &&
      this.productForm.get(control)?.invalid
    );
  }

  created(event: Quill | any) {
    this.editorCreated.set(true);
  }
}
