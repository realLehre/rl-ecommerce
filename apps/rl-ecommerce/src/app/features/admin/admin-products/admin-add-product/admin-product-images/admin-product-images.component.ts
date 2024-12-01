import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { DragAndDropDirective } from '../../../../../shared/directives/drag-and-drop.directive';
import { IProductImages } from '../../admin-product.interface';

@Component({
  selector: 'app-admin-product-images',
  standalone: true,
  imports: [DragAndDropDirective],
  templateUrl: './admin-product-images.component.html',
  styleUrl: './admin-product-images.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductImagesComponent implements OnInit {
  uploadBoxes = signal<IProductImages[]>([]);
  coverImage = signal<IProductImages>({
    hasUploaded: false,
    isUploading: false,
    selectedFile: null,
    imageUrl: '',
  });

  ngOnInit() {
    // Initialize 4 upload boxes
    const boxes = Array(4)
      .fill(null)
      .map(() => ({
        hasUploaded: false,
        isUploading: false,
        selectedFile: null,
        imageUrl: '',
      }));
    this.uploadBoxes.set(boxes);
  }

  fileBrowseHandler(event: any, type: string, index?: number) {
    const file = event.target.files[0];
    if (type === 'multiple') {
      this.processFile(file, 'multiple', index);
    } else {
      this.processFile(file, 'single');
    }
  }

  onFileDropped(event: any, type: string, index?: number) {
    if (type === 'multiple') {
      this.processFile(event[0], 'multiple', index);
    } else {
      this.processFile(event[0], 'single');
    }
  }

  processFile(file: File, type: string, index?: number) {
    // Validate file type and size
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (!allowedTypes.includes(file.type)) {
        alert('Only JPEG, PNG, and GIF images are allowed');
        return;
      }

      if (file.size > maxSize) {
        alert('File size cannot exceed 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (type == 'multiple') {
          this.updateUploadBox(index!, file, reader.result as string);
        } else {
          this.coverImage.set({
            hasUploaded: true,
            isUploading: false,
            selectedFile: file,
            imageUrl: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  updateUploadBox(index: number, file: File, imageUrl: string) {
    const boxes = [...this.uploadBoxes()];
    boxes[index] = {
      hasUploaded: true,
      isUploading: false,
      selectedFile: file,
      imageUrl: imageUrl,
    };
    this.uploadBoxes.set(boxes);
  }

  removeImage(index: number) {
    const boxes = [...this.uploadBoxes()];
    boxes[index] = {
      hasUploaded: false,
      isUploading: false,
      selectedFile: null,
      imageUrl: '',
    };
    this.uploadBoxes.set(boxes);
  }

  removeCoverImage() {
    this.coverImage.set({
      hasUploaded: false,
      isUploading: false,
      selectedFile: null,
      imageUrl: '',
    });
  }
  // uploadFile(file: any) {
  //   this.selectedFile = file;
  //   const formData = new FormData();
  //   formData.append('file', file, this.selectedFile?.name);
  //   console.log(this.selectedFile);
  // }
}
