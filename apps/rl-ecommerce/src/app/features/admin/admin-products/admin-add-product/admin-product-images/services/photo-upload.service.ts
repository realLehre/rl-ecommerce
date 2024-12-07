import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../../../../environments/environment.development';
import { defer, from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoUploadService {
  private supabase!: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }

  upLoadImage(filePath: string, file: File): Observable<any> {
    return defer(
      (): Observable<any> =>
        from(
          this.supabase.storage
            .from('just-product-images')
            .upload(filePath, file),
        ),
    );
  }

  getImageUrl(filePath: string): Observable<string> {
    // return defer(() =>
    //     from(this.supabase.storage.from('product-images').getPublicUrl(filePath))
    // ).pipe(
    //     map(({ data }) => data.publicUrl)
    // );
    const { data } = this.supabase.storage
      .from('just-product-images')
      .getPublicUrl(filePath);
    return defer(() => from(data.publicUrl));
  }
}
