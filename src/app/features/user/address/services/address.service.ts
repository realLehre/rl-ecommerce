import { Injectable } from '@angular/core';
import { IAddress } from '../../models/address.interface';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  addresses: IAddress[] = [
    {
      name: 'David Omolere Egbuwalo',
      street: 'Parakin, Ile Ifejddddddddddddddddddddddddddddddddddddddddddd',
      city: 'Ile Ife',
      state: 'Osun',
      phoneNumbers: ['+234 9131778206', '+234 8168467330'],
      isDefault: true,
    },
    {
      name: 'Jane Doe',
      street: '123 Main Street',
      city: 'Lagos',
      state: 'Lagos',
      phoneNumbers: ['+234 9012345678'],
      isDefault: false,
    },
    {
      name: 'John Smith',
      street: '456 Elm Street',
      city: 'Abuja',
      state: 'FCT',
      phoneNumbers: ['+234 9087654321', '+234 9076543210'],
      isDefault: false,
    },
  ];
  constructor() {}

  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const validPhoneNumberPattern = /^[0-9+-]*$/;

    if (value && !validPhoneNumberPattern.test(value)) {
      return { invalidPhoneNumber: true }; // Invalid phone number
    }
    return null; // Valid phone number
  }

  getLocationInfo(place: any[]) {
    const placeResult = { city: '', region: '' };
    place.forEach((component: any) => {
      const componentType = component.types[0];

      if (componentType === 'locality') {
        placeResult['city'] = component.long_name; // City
      } else if (componentType === 'administrative_area_level_1') {
        placeResult['region'] = component.long_name; // Region/State
      }
    });
    return placeResult;
  }
}
