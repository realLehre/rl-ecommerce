import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export interface IPaystackResponse {
  status: boolean;
  message: string;
  data: IPaystackResponseData;
}
export interface IPaystackResponseData {
  authorization_url: string;
  access_code: string;
  reference: string;
}
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  paystackKey = environment.paystackKey;
  private url = 'https://api.paystack.co/transaction/initialize';
  constructor() {}

  initiatePayment(data: any) {
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.paystackKey}`,
    });

    return this.http.post<IPaystackResponse>(this.url, data, {
      headers: header,
    });
  }
}
