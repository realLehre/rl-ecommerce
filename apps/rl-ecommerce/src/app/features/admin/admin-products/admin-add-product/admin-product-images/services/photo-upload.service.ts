import { inject, Injectable, signal } from '@angular/core';
import { defer, from, map, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../../../../auth/services/auth.service';
import { IProductImages } from '../../../admin-product.interface';

@Injectable({
  providedIn: 'root',
})
export class PhotoUploadService {
  private readonly authService = inject(AuthService);
  isChangingImage = signal(false);
  private supabase = this.authService.supabase;
  BUCKET_NAME = 'just-product-images';

  constructor() {
    // this.removeImage(
    //   'https://tentdyesixetvyacewwr.supabase.co/storage/v1/object/sign/just-product-images/b0338a0f-40d0-4111-b67a-9c7fe6ab809c-FCjk6_XXMA0i6fi.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqdXN0LXByb2R1Y3QtaW1hZ2VzL2IwMzM4YTBmLTQwZDAtNDExMS1iNjdhLTljN2ZlNmFiODA5Yy1GQ2prNl9YWE1BMGk2ZmkuanBnIiwiaWF0IjoxNzMzOTc5MzM5LCJleHAiOjIwNDk1NTUzMzl9.fKMka4EX8WWf2RfYf6_meIFrzGHgfQCdPqKCEYaQDD0',
    // ).subscribe((res) => {});
  }

  upLoadImage(
    filePath: string,
    file: File,
  ): Observable<{
    data: { id: string; path: string; fullPath: string };
    error: any;
  }> {
    const fileName = uuidv4() + '-' + file.name;
    return defer(
      (): Observable<any> =>
        from(
          this.supabase.storage.from(this.BUCKET_NAME).upload(fileName, file),
        ),
    );
  }

  getImageUrl(filePath: string): Observable<any> {
    return defer(() =>
      from(
        this.supabase.storage
          .from(this.BUCKET_NAME)
          .createSignedUrl(filePath, 315576000),
      ),
    ).pipe(map(({ data }) => data));
  }

  removeImage(imageUrl: string): Observable<any> {
    const imagePath = this.getImagePath(imageUrl);
    console.log(imagePath);
    return defer(() =>
      from(this.supabase.storage.from(this.BUCKET_NAME).remove([imagePath])),
    );
  }

  getImagePath(url: string): string {
    const basePath = url.split('?')[0];
    return basePath.split('/').pop()!;
  }

  prefillUploadBoxes(data: string[]): IProductImages[] {
    const uploadBoxes = [];

    for (let v = 0; v < data.length; v++) {
      if (v > 0 && data.length > 1) {
        uploadBoxes.push({
          hasUploaded: true,
          isUploading: false,
          selectedFile: null,
          imageUrl: data[v],
        });
      }
    }
    return uploadBoxes as IProductImages[];
  }
}
