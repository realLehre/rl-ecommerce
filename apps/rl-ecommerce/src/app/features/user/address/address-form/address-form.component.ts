import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PhoneNumberDirective } from './directives/phone-number.directive';
import { AddressService } from '../services/address.service';
import { ErrorMessageDirective } from './directives/error-message.directive';
import { CheckboxModule } from 'primeng/checkbox';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
declare const google: any;

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PhoneNumberDirective,
    ErrorMessageDirective,
    CheckboxModule,
    RouterLink,
    LoaderComponent,
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent implements OnInit, AfterViewInit {
  private addressService = inject(AddressService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  closeForm = output<void>();
  formMode = input<string>();
  addressForm!: FormGroup;
  @ViewChild('addressInput', { static: false })
  addressInput!: ElementRef<HTMLInputElement>;
  isLoading = signal(false);

  constructor() {}

  ngOnInit() {
    this.addressForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      phoneNumber: [
        null,
        [Validators.required, this.addressService.phoneNumberValidator],
      ],
      additionalPhoneNumber: [null, this.addressService.phoneNumberValidator],
      deliveryAddress: [null, [Validators.required]],
      additionalInformation: [null],
      country: [null, Validators.required],
      state: [null, Validators.required],
      city: [null, Validators.required],
      isDefault: [false],
    });
  }

  ngAfterViewInit() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addressInput.nativeElement,
      {
        types: ['geocode'],
        componentRestrictions: { country: [] },
      },
    );

    autocomplete.addListener('place_changed', () => {
      this.addressForm.patchValue({
        deliveryAddress: autocomplete.getPlace()['formatted_address'],
      });

      const place = autocomplete.getPlace().address_components;

      const res = this.addressService.getLocationInfo(place);
      this.addressForm.patchValue({ city: null, state: null, country: null });
      this.patchInputs(res);
    });
  }

  onSubmit() {
    if (this.addressForm.valid) {
      this.isLoading.set(true);
      const formValue = { ...this.addressForm.value };
      const name = formValue.firstName + ' ' + formValue.lastName;
      delete formValue['firstName'];
      delete formValue['lastName'];

      this.addressService.addAddress({ ...formValue, name }).subscribe({
        next: (res) => {
          this.isLoading.set(false);

          this.toast.showToast({
            type: 'success',
            message: 'Address created successfully!',
          });

          this.closeForm.emit();

          this.addressForm.reset();
        },
        error: (err) => {
          this.isLoading.set(false);

          this.toast.showToast({
            type: 'error',
            message: err.error.message,
          });
        },
      });
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  patchInputs(res: { city: string; state: string; country: string }) {
    if (res.city != '' && res.city) {
      this.addressForm.patchValue({ city: res.city });
    }
    if (res.state != '' && res.state) {
      this.addressForm.patchValue({ state: res.state });
    }
    if (res.country != '' && res.country) {
      this.addressForm.patchValue({ country: res.country });
    }
  }

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.addressForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
}
