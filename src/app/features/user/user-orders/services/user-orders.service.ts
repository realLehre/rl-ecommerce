import { Injectable } from '@angular/core';

export interface IOrder {
  id: number;
  customerName: string;
  totalPrice: number;
  orderDate: string;
  status: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserOrdersService {
  orders: IOrder[] = [
    {
      id: 4387,
      customerName: 'Chris Green',
      totalPrice: 25000,
      orderDate: '2024/02/16',
      status: 'payment confirmed',
    },
    {
      id: 4388,
      customerName: 'Emma White',
      totalPrice: 45000,
      orderDate: '2024/02/17',
      status: 'Order Shipped',
    },
    {
      id: 4389,
      customerName: 'Liam Black',
      totalPrice: 32000,
      orderDate: '2024/02/18',
      status: 'payment pending',
    },
    {
      id: 4390,
      customerName: 'Olivia Blue',
      totalPrice: 22000,
      orderDate: '2024/02/19',
      status: 'Order Delivered',
    },
    {
      id: 4391,
      customerName: 'Noah Gray',
      totalPrice: 60000,
      orderDate: '2024/02/20',
      status: 'payment confirmed',
    },
    {
      id: 4392,
      customerName: 'Sophia Red',
      totalPrice: 48000,
      orderDate: '2024/02/21',
      status: 'Packing order',
    },
    {
      id: 4393,
      customerName: 'Mason Silver',
      totalPrice: 12000,
      orderDate: '2024/02/22',
      status: 'payment pending',
    },
    {
      id: 4394,
      customerName: 'Isabella Gold',
      totalPrice: 37000,
      orderDate: '2024/02/23',
      status: 'Order Delivered',
    },
    {
      id: 4395,
      customerName: 'James Violet',
      totalPrice: 53000,
      orderDate: '2024/02/24',
      status: 'payment confirmed',
    },
    {
      id: 4396,
      customerName: 'Charlotte Indigo',
      totalPrice: 34000,
      orderDate: '2024/02/25',
      status: 'Order Shipped',
    },
    {
      id: 4397,
      customerName: 'Benjamin Yellow',
      totalPrice: 29000,
      orderDate: '2024/02/26',
      status: 'Packing order',
    },
    {
      id: 4398,
      customerName: 'Amelia Cyan',
      totalPrice: 41000,
      orderDate: '2024/02/27',
      status: 'payment pending',
    },
    {
      id: 4399,
      customerName: 'Elijah Teal',
      totalPrice: 15000,
      orderDate: '2024/02/28',
      status: 'Order Delivered',
    },
    {
      id: 4400,
      customerName: 'Harper Pink',
      totalPrice: 33000,
      orderDate: '2024/03/01',
      status: 'payment confirmed',
    },
    {
      id: 4401,
      customerName: 'William Brown',
      totalPrice: 27000,
      orderDate: '2024/03/02',
      status: 'Packing order',
    },
    {
      id: 4402,
      customerName: 'Ava Orange',
      totalPrice: 39000,
      orderDate: '2024/03/03',
      status: 'Order Shipped',
    },
    {
      id: 4403,
      customerName: 'Lucas Purple',
      totalPrice: 44000,
      orderDate: '2024/03/04',
      status: 'payment pending',
    },
    {
      id: 4404,
      customerName: 'Mia Scarlet',
      totalPrice: 17000,
      orderDate: '2024/03/05',
      status: 'Order Delivered',
    },
    {
      id: 4405,
      customerName: 'Henry Gray',
      totalPrice: 52000,
      orderDate: '2024/03/06',
      status: 'payment confirmed',
    },
    {
      id: 4406,
      customerName: 'Ella Silver',
      totalPrice: 36000,
      orderDate: '2024/03/07',
      status: 'Order Shipped',
    },
    {
      id: 4406,
      customerName: 'Ella Silver',
      totalPrice: 36000,
      orderDate: '2024/03/07',
      status: 'Order Shipped',
    },
    {
      id: 4406,
      customerName: 'Ella Silver',
      totalPrice: 36000,
      orderDate: '2024/03/07',
      status: 'Order Shipped',
    },
    {
      id: 4406,
      customerName: 'Ella Silver',
      totalPrice: 36000,
      orderDate: '2024/03/07',
      status: 'Order Shipped',
    },
    {
      id: 4406,
      customerName: 'Ella Silver',
      totalPrice: 36000,
      orderDate: '2024/03/07',
      status: 'Order Shipped',
    },
  ];

  constructor() {}
}
