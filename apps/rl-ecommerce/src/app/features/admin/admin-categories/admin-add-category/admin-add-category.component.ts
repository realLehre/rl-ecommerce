import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnDestroy,
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
import { ToastService } from '../../../../shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Categories } from '../admin-categories.interface';
import { CanComponentDeactivate } from '../../../../shared/guards/has-unsaved-changes.guard';
import { data } from 'autoprefixer';

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
export class AdminAddCategoryComponent
  implements CanComponentDeactivate, OnInit
{
  private readonly categoryService = inject(AdminCategoriesService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isEditing = signal(false);
  categoryForm!: FormGroup;
  isSubmitting = signal(false);
  hasUnsavedChanges = signal(false);

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      subCategories: this.fb.array([
        this.fb.group({
          subCategoryName: [null],
        }),
      ]),
    });

    this.route.queryParams.subscribe((param) => {
      if (param['edit']) this.isEditing.set(true);
    });

    if (this.isEditing()) {
      const category: Categories = this.categoryService.activeCategory()!;
      this.hasUnsavedChanges.set(true);
      this.categoryForm.patchValue({
        name: category?.name,
      });
      this.subCategories.clear();
      const subs = category.subCategories.map(
        (subCategory: any) => subCategory,
      );

      subs.forEach((subCategory) => {
        this.subCategories.push(
          this.fb.group({
            id: [subCategory.id],
            subCategoryName: [subCategory.name],
          }),
        );
      });
    }

    this.categoryForm.valueChanges.subscribe((value) => {
      if (
        value.name != '' ||
        (value.subCategories[0].subCategoryName && value.subCategories.length)
      ) {
        this.hasUnsavedChanges.set(true);
      } else {
        this.hasUnsavedChanges.set(false);
      }
    });
  }

  get subCategories() {
    return <FormArray>this.categoryForm.get('subCategories');
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.hasUnsavedChanges.set(false);
    if (!this.isEditing()) {
      const data = {
        name: this.categoryForm.value.name,
        subCategories: this.categoryForm.value.subCategories
          .filter(({ subCategoryName }: any) => subCategoryName !== null)
          .map(({ subCategoryName }: any) => subCategoryName),
      };
      this.categoryService.addCategory(data).subscribe({
        next: (res) => {
          this.toast.showToast({
            type: 'success',
            message: 'Category added successfully',
          });

          this.categoryService.categoriesSignal.set(undefined);
          this.router.navigate(['/', 'admin', 'categories']);
          this.isSubmitting.set(false);
        },
        error: (err) => {
          this.toast.showToast({
            type: 'error',
            message: err.error.message || 'Failed to load order',
          });
          this.isSubmitting.set(false);
        },
      });
    } else {
      const data = {
        name: this.categoryForm.value.name,
        subCategories: this.categoryForm.value.subCategories
          .filter((subCategory: any) => subCategory.name !== null)
          .map((subCategory: any) => subCategory),
      };
      this.categoryService
        .updateCategory(data, this.categoryService.activeCategory()?.id!)
        .subscribe({
          next: (res) => {
            this.toast.showToast({
              type: 'success',
              message: 'Category edited successfully',
            });
            this.categoryService.activeCategory.set(undefined);
            sessionStorage.removeItem('ssjsiw72jsksdeisi92e');
            this.categoryService.categoriesSignal.set(undefined);
            this.router.navigate(['/', 'admin', 'categories']);
            this.isSubmitting.set(false);
          },
          error: (err) => {
            this.toast.showToast({
              type: 'error',
              message: err.error.message || 'Failed to load order',
            });
            this.isSubmitting.set(false);
          },
        });
    }
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

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges()) {
      return confirm(
        'You have unsaved changes, are you sure you want to quit?',
      );
    } else {
      return true;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = true;
    }
  }
}
