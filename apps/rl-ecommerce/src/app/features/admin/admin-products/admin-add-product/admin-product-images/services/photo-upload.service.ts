import { inject, Injectable } from '@angular/core';
import { defer, from, map, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PhotoUploadService {
  private readonly authService = inject(AuthService);
  private supabase = this.authService.supabase;

  constructor() {}

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
          this.supabase.storage
            .from('just-product-images')
            .upload(fileName, file),
        ),
    );
  }

  getImageUrl(filePath: string): Observable<any> {
    return defer(() =>
      from(
        this.supabase.storage
          .from('just-product-images')
          .createSignedUrl(filePath, 315576000),
      ),
    ).pipe(map(({ data }) => data));
  }
}
