import { inject, Injectable, signal } from '@angular/core';
import { IAddress } from '../../models/address.interface';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from '../../../../../environments/environment.development';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';

import { Observable, of, retry, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  baseUrl = environment.apiUrl + 'users';
  authService = inject(AuthService);
  private http = inject(HttpClient);
  activeAddress = signal<IAddress | null>(null);
  addressSignal = signal<IAddress[] | null>(null);

  constructor() {}

  getAddress(): Observable<IAddress[]> {
    return this.addressSignal()
      ? of(this.addressSignal()!)
      : this.http
          .get<IAddress[]>(
            `${this.baseUrl}/${this.authService.user()?.id}/address`,
          )
          .pipe(retry(3))
          .pipe(
            tap((res) => {
              this.addressSignal.set(res);
            }),
          );
  }

  addAddress(data: any) {
    return this.http
      .post(`${this.baseUrl}/${this.authService.user()?.id}/address`, data)
      .pipe(tap(() => this.addressSignal.set(null)));
  }

  editAddress(data: any, id: string) {
    return this.http
      .patch(`${this.baseUrl}/address/edit/${id}`, data)
      .pipe(tap(() => this.addressSignal.set(null)));
  }

  deleteAddress(id: string) {
    return this.http
      .delete(`${this.baseUrl}/address/delete/${id}`)
      .pipe(tap(() => this.addressSignal.set(null)));
  }

  setAsDefault(id: string) {
    return this.http
      .patch(
        `${this.baseUrl}/${this.authService.user()?.id}/address/default/${id}`,
        {},
      )
      .pipe(tap(() => this.addressSignal.set(null)));
  }

  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const validPhoneNumberPattern = /^[0-9+-]*$/;

    if (value && !validPhoneNumberPattern.test(value)) {
      return { invalidPhoneNumber: true }; // Invalid phone number
    }
    return null; // Valid phone number
  }

  getLocationInfo(place: any[]) {
    const placeResult = { city: '', state: '', country: '' };
    place.forEach((component: any) => {
      const componentType = component.types[0];

      if (componentType === 'locality') {
        placeResult['city'] = component.long_name; // City
      } else if (componentType === 'administrative_area_level_1') {
        placeResult['state'] = component.long_name; // Region/State
      } else if (componentType == 'country') {
        placeResult['country'] = component.long_name;
      }
    });
    return placeResult;
  }
}
