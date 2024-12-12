import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EditorModule } from 'primeng/editor';
import { RouterLink } from '@angular/router';
import { MQuillService } from '../../../../../shared/services/quill-service.service';

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
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductFormComponent implements OnInit {
  private quillService = inject(MQuillService);
  private optionsService = inject(ProductOptionsService);
  private sanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);
  productForm!: FormGroup;
  subCategories: ISubCategory[] = [];
  modules: QuillModules = this.quillService.modules;
  formValue = output<any>();
  categories = toSignal(this.optionsService.getCategories());
  html = signal<any>('');
  editorCreated = signal(false);

  ngOnInit() {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
      previousPrice: [0],
      unit: [null, Validators.required],
      categoryId: [null, Validators.required],
      subCategoryId: [null, Validators.required],
      description: [null, Validators.required],
    });
    this.formValue.emit(this.productForm);

    this.productForm.valueChanges.subscribe((value) => {
      this.formValue.emit(this.productForm);
    });

    this.productForm.get('categoryId')?.valueChanges.subscribe((id: string) => {
      this.subCategories = this.categories()?.find(
        (cat) => cat.id == id,
      )?.subCategories!;
    });

    this.productForm
      .get('description')
      ?.valueChanges.subscribe((value: string) => {
        this.html.set(value);
      });
  }

  get sanitizedDescription(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.html());
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
