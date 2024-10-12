import { Injectable } from '@angular/core';
import {
  AuthApiError,
  AuthError,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { defer, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase!: SupabaseClient;
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }

  signUp(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    return defer(() =>
      from(
        this.supabase.auth.signUp({
          email: data.email,
          password: data.password,
        }),
      ),
    );
    // return await this.supabase.auth.signUp({
    //   email: data.email,
    //   password: data.password,
    // });
  }

  formatSignUpData(data: any) {
    const keysArr = Object.keys(data);
    const lastKey = keysArr[keysArr.length - 1];
    delete data[lastKey];
    return data;
  }

  getError(err: AuthApiError | AuthError) {
    switch (err.code) {
      case 'user_already_exists':
        return err.message;
    }
    return;
  }
}
