import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  addressForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.addressForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      additionalPhoneNumber: ['', Validators.pattern(/^\d{10}$/)],
      deliveryAddress: ['', [Validators.required, Validators.minLength(5)]],
      additionalInformation: [''],
      region: ['', Validators.required],
      city: ['', Validators.required],
      isDefaultAddress: [false],
    });
  }

  onSubmit() {
    if (this.addressForm.valid) {
      console.log(this.addressForm.value);
      // Handle form submission
    } else {
      this.markFormGroupTouched(this.addressForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.addressForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  getErrorMessage(controlName: string): string {
    const control: any = this.addressForm.get(controlName);
    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('minlength')) {
      return `Minimum length is ${control.errors!['minlength'].requiredLength} characters`;
    }
    if (control.hasError('pattern')) {
      return 'Invalid format';
    }
    return '';
  }
}
