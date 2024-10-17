import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-unsaved-changes-alert',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './unsaved-changes-alert.component.html',
  styleUrl: './unsaved-changes-alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsavedChangesAlertComponent {
  ref = inject(DynamicDialogRef);

  onDeleteDialogAction(type: string) {
    this.ref.close(type);
  }
}
