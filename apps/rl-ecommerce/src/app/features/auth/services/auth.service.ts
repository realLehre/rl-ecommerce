import { inject, Injectable, signal } from '@angular/core';
import {
  AuthApiError,
  AuthError,
  createClient,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { UserAccountService } from '../../user/user-account/services/user-account.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../../shared/services/cart.service';

export interface IUser {
  id: string;
  fullName: string;
  name?: string;
  phoneNumber: string | null;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private cookieService = inject(CookieService);
  private supabase!: SupabaseClient;
  user = signal<IUser | null>(null);
  USER_STORAGE_KEY = 'shshyeo948dnsks7h0';
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
    this.onAuthStateChanged();

    const user = this.cookieService.get(this.USER_STORAGE_KEY);
    if (user) {
      const userObj = JSON.parse(user);
      this.user.set(userObj);
    } else {
      this.user.set(null);
    }
  }

  signUp(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    return this.supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.firstName + ' ' + data.lastName,
        },
      },
    });
  }

  async continueWithGoogle() {
    await this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  login(data: { email: string; password: string }) {
    return this.supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
  }

  signOut() {
    this.supabase.auth.signOut();
    localStorage.clear();
    this.cookieService.deleteAll('/');
    this.user.set(null);
    this.router.navigate(['/']);
  }

  onAuthStateChanged() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        const data: IUser = {
          email: session?.user.email!,
          phoneNumber: session?.user.phone!,
          id: session?.user?.id!,
          fullName: session?.user.user_metadata?.['full_name'],
        };
        this.user.set(data);
        this.cookieService.set(this.USER_STORAGE_KEY, JSON.stringify(data), {
          path: '/',
          secure: true,
          sameSite: 'Strict',
          expires: session?.expires_in,
        });
        localStorage.removeItem('sb-tentdyesixetvyacewwr-auth-token');
      } else if (event === 'SIGNED_OUT') {
        this.cookieService.deleteAll('/');

        this.user.set(null);
      }
    });
  }

  formatSignUpData(data: any) {
    const keysArr = Object.keys(data);
    const lastKey = keysArr[keysArr.length - 1];
    delete data[lastKey];
    return data;
  }

  getError(err: AuthApiError | AuthError) {
    console.log(err);
    switch (err.code) {
      case 'user_already_exists':
        return err.message;
      case 'unexpected_failure':
        return 'Something went wrong. Try again!';
      default:
        return "Something went wrong. Try again!'";
    }
  }
}
