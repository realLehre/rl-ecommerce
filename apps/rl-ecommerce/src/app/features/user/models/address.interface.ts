export interface IAddress {
  id?: string;
  userId?: string;
  name?: string;
  phoneNumber: string;
  additionalPhoneNumber?: string;
  deliveryAddress?: string;
  additionalInformation?: string;
  country?: string;
  state?: string;
  city?: string;
  isDefault: boolean;
  createdAt?: string;
  updateAt?: string;
}
