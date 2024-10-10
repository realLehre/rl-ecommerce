import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order {
  id: number;
  customerName: string;
  totalPrice: number;
  orderDate: string;
  status: string;
}
@Component({
  selector: 'app-user-orders-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-orders-table.component.html',
  styleUrl: './user-orders-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrdersTableComponent {
  orders: Order[] = [
    {
      id: 4383,
      customerName: 'John Doe',
      totalPrice: 30000,
      orderDate: '2024/02/15',
      status: 'payment pending',
    },
    {
      id: 4384,
      customerName: 'Jane Smith',
      totalPrice: 30000,
      orderDate: '2024/02/15',
      status: 'payment confirmed',
    },
    {
      id: 4385,
      customerName: 'Bob Johnson',
      totalPrice: 30000,
      orderDate: '2024/02/15',
      status: 'Packing order',
    },
    {
      id: 4386,
      customerName: 'Alice Brown',
      totalPrice: 30000,
      orderDate: '2024/02/15',
      status: 'Order Delivered',
    },
  ];

  sortUsed: boolean = false;
  sortColumn: keyof Order | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {}

  sortTable(column: keyof Order): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortUsed = true;
    // this.sortColumn = column;
    // this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    // console.log(this.sortDirection);
    this.orders.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;

      return 0;
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'payment pending':
        return 'bg-pink-200 text-pink-800';
      case 'payment confirmed':
        return 'bg-blue-200 text-blue-800';
      case 'packing order':
        return 'bg-purple-200 text-purple-800';
      case 'order delivered':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }
}
