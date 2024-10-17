import { Validators } from '@angular/forms';

export class CreateAddressDto {
  name!: string;
  city!: string;
  state!: string;
  country!: string;
  phoneNumber!: string;
  additionalPhoneNumber?: string;
  deliveryAddress!: string;
  additionalInformation?: string;
  isDefault!: boolean;
}
