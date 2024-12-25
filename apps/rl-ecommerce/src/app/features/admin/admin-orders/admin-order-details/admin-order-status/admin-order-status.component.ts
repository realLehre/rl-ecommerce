import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { IOrder } from '../../../../../shared/models/order.interface';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { AdminOrderTrackingEventsComponent } from '../admin-order-tracking-events/admin-order-tracking-events.component';
import { DialogModule } from 'primeng/dialog';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { AdminOrderService } from '../../services/admin-order.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-order-status',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    AdminOrderTrackingEventsComponent,
    DialogModule,
    LoaderComponent,
  ],
  templateUrl: './admin-order-status.component.html',
  styleUrl: './admin-order-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderStatusComponent {
  private orderService = inject(AdminOrderService);
  private toast = inject(ToastService);
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
  showDialog = signal(false);
  isLoading = signal(false);
  statusUpdated = output<IOrder>();

  onToggleDropDown() {
    this.dropDown.show();
  }

  onChangeOrderStatus(event: any) {
    this.selectedStatus = event;
    this.showDialog.set(true);
  }

  onUpdateDeliveryTimeline() {
    this.isLoading.set(true);
    this.orderService
      .updateOrder(this.selectedStatus.code, this.order())
      .subscribe({
        next: (data) => {
          this.isLoading.set(false);
          this.showDialog.set(false);
          this.toast.showToast({
            type: 'success',
            message: `Order marked as ${this.selectedStatus.code.toLowerCase()} successfully`,
          });
          this.statusUpdated.emit(data);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.toast.showToast({ type: 'error', message: err.message });
        },
      });
  }

  onCancel() {
    this.showDialog.set(false);
  }
}
