import { inject, Injectable, signal } from '@angular/core';
import {
  AuthApiError,
  AuthError,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private supabase!: SupabaseClient;
  user = signal<IUser | null>(null);
  USER_STORAGE_KEY = 'shshyeo948dnsks7h0';
  USER_ACCOUNT_STORAGE_KEY = 'hdjeyu7830nsk083hd';
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
    sessionStorage.clear();
    this.cookieService.deleteAll('/');
    this.user.set(null);
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
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
        console.log(1);
        localStorage.removeItem('sb-tentdyesixetvyacewwr-auth-token');
        this.http
          .get<IUser>(`${this.baseUrl}users/${this.user()?.id}`)
          .pipe(
            tap((res) => {
              this.setUser(res);
            }),
          )
          .subscribe();
      } else if (event === 'SIGNED_OUT') {
        this.cookieService.deleteAll('/');

        this.user.set(null);
      }
    });
  }

  setUser(res: any) {
    localStorage.setItem(this.USER_ACCOUNT_STORAGE_KEY, JSON.stringify(res));
    const data: IUser = {
      email: res?.email!,
      phoneNumber: res?.phoneNumber!,
      id: res?.id!,
      fullName: res?.name!,
    };
    this.user.set(data);
    this.cookieService.set(this.USER_STORAGE_KEY, JSON.stringify(data), {
      path: '/',
      secure: true,
      sameSite: 'Strict',
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
