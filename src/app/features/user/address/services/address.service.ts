import { Injectable } from '@angular/core';
import { IAddress } from '../../models/address.interface';

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
}
