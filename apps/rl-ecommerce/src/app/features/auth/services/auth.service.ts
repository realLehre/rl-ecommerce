import { inject, Injectable, signal } from '@angular/core';
import {
  AuthApiError,
  AuthError,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../user/models/user.interface';
import { Store } from '@ngrx/store';
import { getUser } from '../../../state/user/user.actions';
import { logout_clearState } from '../../../state/state.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cookieService = inject(CookieService);
  private http = inject(HttpClient);
  private store = inject(Store);
  private baseUrl = environment.apiUrl;
  supabase!: SupabaseClient;
  user = signal<IUser | null>(null);
  USER_STORAGE_KEY = 'shshyeo948dnsks7h0';
  USER_ACCOUNT_STORAGE_KEY = 'hdjeyu7830nsk083hd';
  NEW_SIGNUP_KEY = 'djd38sJDjd29qldds';
  savedReturnUrl: string = 'djdhw923jsjhak9';
  cachedAuthEvent = signal(false);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
    this.onAuthStateChanged();

    const user = localStorage.getItem(this.USER_ACCOUNT_STORAGE_KEY);
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
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    const baseRoute = this.getBaseRoute(window.location.href);

    if (returnUrl) {
      const returnRoute = baseRoute + returnUrl;
      const newReturnUrl = returnUrl.split('/');
      localStorage.setItem(this.savedReturnUrl, JSON.stringify(newReturnUrl));

      await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: returnRoute,
        },
      });
    } else {
      await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: environment.googleAuthRedirect,
        },
      });
    }
  }

  getBaseRoute(url: string): string {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  }

  login(data: { email: string; password: string }) {
    return this.supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
  }

  signOut() {
    this.supabase.auth.signOut();
    this.store.dispatch(logout_clearState());
    localStorage.clear();
    sessionStorage.clear();
    this.cookieService.deleteAll('/');
    this.user.set(null);
  }

  onAuthStateChanged() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        const data: IUser = {
          email: session?.user.email!,
          phoneNumber: session?.user.phone!,
          id: session?.user?.id!,
          name: session?.user.user_metadata?.['full_name'],
        };
        this.store.dispatch(getUser({ id: session?.user?.id! }));
        this.user.set(data);

        this.cookieService.set(this.USER_STORAGE_KEY, JSON.stringify(data), {
          path: '/',
          secure: true,
          sameSite: 'Strict',
          expires: session?.expires_in,
        });

        const savedUrl = JSON.parse(localStorage.getItem(this.savedReturnUrl)!);
        if (savedUrl) {
          this.router.navigate([...savedUrl]);
        }

        if (this.cachedAuthEvent()) {
          return;
        }
        this.http
          .get<IUser>(`${this.baseUrl}users/single/${this.user()?.id}`)
          .pipe(
            tap((res) => {
              this.setUser(res);
            }),
          )
          .subscribe();

        this.cachedAuthEvent.set(true);
        // localStorage.removeItem('sb-tentdyesixetvyacewwr-auth-token');
        localStorage.removeItem(this.savedReturnUrl);
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
      name: res?.name!,
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
