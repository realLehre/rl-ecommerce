import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewChild,
} from '@angular/core';
import { IOrder } from '../../../../../shared/models/order.interface';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { AdminOrderTrackingEventsComponent } from '../admin-order-tracking-events/admin-order-tracking-events.component';

@Component({
  selector: 'app-admin-order-status',
  standalone: true,
  imports: [FormsModule, DropdownModule, AdminOrderTrackingEventsComponent],
  templateUrl: './admin-order-status.component.html',
  styleUrl: './admin-order-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderStatusComponent {
  order = input<IOrder>({} as IOrder);
  deliveryStatus = computed<
    { name: string; code: string; inactive: boolean }[]
  >(() => {
    return [
      {
        name: 'Packed',
        code: 'PACKED',
        inactive:
          this.order().deliveryStatus?.toLowerCase() === 'packed' ||
          this.order().deliveryStatus?.toLowerCase() === 'delivered',
      },
      {
        name: 'Delivered',
        code: 'DELIVERED',
        inactive: this.order().deliveryStatus?.toLowerCase() === 'delivered',
      },
    ];
  });
  selectedStatus!: { name: string; code: string; inactive: boolean };
  @ViewChild('dropDown') dropDown!: Dropdown;

  onToggleDropDown() {
    this.dropDown.show();
  }

  onChangeOrderStatus(event: any) {
    console.log(event);
  }
}
