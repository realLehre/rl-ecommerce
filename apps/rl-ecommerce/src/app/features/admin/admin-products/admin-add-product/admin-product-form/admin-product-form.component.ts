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
import { JsonPipe, NgClass } from '@angular/common';
import { ErrorMessageDirective } from '../../../../user/address/address-form/directives/error-message.directive';
import {
  EditorChangeContent,
  EditorChangeSelection,
  QuillEditorComponent,
} from 'ngx-quill';
import Quill from 'quill';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [
    DropdownModule,
    NgClass,
    ErrorMessageDirective,
    ReactiveFormsModule,
    QuillEditorComponent,
    JsonPipe,
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

  blurred = false;
  focused = false;
  html = signal<any>('');

  ngOnInit() {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
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
    // tslint:disable-next-line:no-console
    console.log('editor-created', event);
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection | any) {
    // tslint:disable-next-line:no-console
    // console.log('editor-change', event);
  }

  focus($event: any) {
    // tslint:disable-next-line:no-console
    console.log('focus', $event);
    this.focused = true;
    this.blurred = false;
  }
  nativeFocus($event: any) {
    // tslint:disable-next-line:no-console
    console.log('native-focus', $event);
  }

  blur($event: any) {
    // tslint:disable-next-line:no-console
    console.log('blur', $event);
    this.focused = false;
    this.blurred = true;
  }
  nativeBlur($event: any) {
    // tslint:disable-next-line:no-console
    console.log('native-blur', $event);
  }
}
