import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  output,
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
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent implements OnInit, AfterViewInit {
  private addressService = inject(AddressService);
  private fb = inject(FormBuilder);
  closeForm = output<void>();
  addressForm!: FormGroup;
  @ViewChild('addressInput')
  addressInput!: ElementRef<HTMLInputElement>;

  constructor() {}

  ngOnInit() {
    this.addressForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: [
        '',
        [Validators.required, this.addressService.phoneNumberValidator],
      ],
      additionalPhoneNumber: ['', Validators.pattern(/^\d{10}$/)],
      deliveryAddress: ['', [Validators.required, Validators.minLength(5)]],
      additionalInformation: [''],
      region: ['', Validators.required],
      city: ['', Validators.required],
      isDefaultAddress: [false],
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
      const place = autocomplete.getPlace().address_components;

      const res = this.addressService.getLocationInfo(place);
      this.patchInputs(res);
    });
  }

  onSubmit() {
    if (this.addressForm.valid) {
      console.log(this.addressForm.value);
      // Handle form submission
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  patchInputs(res: { city: string; region: string }) {
    if (res.city != '') {
      this.addressForm.patchValue({ city: res.city });
    }
    if (res.region != '') {
      this.addressForm.patchValue({ region: res.region });
    }
  }

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.addressForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
}
