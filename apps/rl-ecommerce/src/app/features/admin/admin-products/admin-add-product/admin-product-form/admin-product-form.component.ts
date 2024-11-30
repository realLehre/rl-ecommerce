import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
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
  private optionsService = inject(ProductOptionsService);
  private sanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);
  productForm!: FormGroup;
  categories = toSignal(this.optionsService.getCategories());
  subCategories: ISubCategory[] = [];
  html = signal<any>('');
  modules: QuillModules = {};
  editorCreated = signal(false);

  ngOnInit() {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
      quantity: [null, Validators.required],
      category: [null, Validators.required],
      subCategory: [null, Validators.required],
      description: [null, Validators.required],
    });

    this.productForm.get('category')?.valueChanges.subscribe((id: string) => {
      this.subCategories = this.categories()?.find(
        (cat) => cat.id == id,
      )?.subCategories!;
    });

    this.productForm
      .get('description')
      ?.valueChanges.subscribe((id: string) => {
        this.html.set(id);
        console.log(id);
      });

    this.modules = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote'],
          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction
          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ],
        handlers: {
          'custom-dropdown': function (value: string) {
            if (value) {
              //@ts-expect-error
              const cursorPosition = this.quill.getSelection().index;
              //@ts-expect-error
              this.quill.insertText(cursorPosition, value);
              //@ts-expect-error
              this.quill.setSelection(cursorPosition + value.length); // Place cursor after inserted text
            }
          },
        },
      },
    };
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
