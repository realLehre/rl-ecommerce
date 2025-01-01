import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CookieService } from 'ngx-cookie-service';
import { tokenInterceptor } from './shared/interceptors/token.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

const scrollConfig: InMemoryScrollingOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, inMemoryScrollingFeature, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideAnimationsAsync(),
    importProvidersFrom([BrowserAnimationsModule]),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    DialogService,
    DynamicDialogRef,
    CookieService,
    provideStore(),
    provideEffects()
],
};
