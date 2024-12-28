import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AdminCategoriesService } from '../services/admin-categories.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorMessageDirective } from '../../../user/address/address-form/directives/error-message.directive';
import { NgClass } from '@angular/common';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-admin-add-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ErrorMessageDirective,
    NgClass,
    LoaderComponent,
  ],
  templateUrl: './admin-add-category.component.html',
  styleUrl: './admin-add-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAddCategoryComponent implements OnInit {
  private readonly categoryService = inject(AdminCategoriesService);
  private fb = inject(FormBuilder);
  isEditing = signal(false);
  categoryForm!: FormGroup;
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      categoryName: [null, Validators.required],
      subCategories: this.fb.array([
        this.fb.group({
          subCategoryName: [null],
        }),
      ]),
    });
  }

  get subCategories() {
    return <FormArray>this.categoryForm.get('subCategories');
  }

  onSubmit() {
    console.log(this.categoryForm.value);
  }

  isInvalidAndTouched(control: string) {
    return (
      this.categoryForm.get(control)?.touched &&
      this.categoryForm.get(control)?.invalid
    );
  }

  onAddNewSubCategoryInput() {
    this.subCategories.push(
      this.fb.group({
        subCategoryName: [null],
      }),
    );
  }

  onRemoveControl(i: number) {
    this.subCategories.removeAt(i);
  }
}
