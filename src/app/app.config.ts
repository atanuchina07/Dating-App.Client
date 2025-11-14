import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { jwtInterceptorInterceptor } from './_interceptor/jwt-interceptor.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { spinnerInterceptorInterceptor } from './_interceptor/spinner-interceptor.interceptor';
import { TimeagoModule } from 'ngx-timeago';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        jwtInterceptorInterceptor,
        spinnerInterceptorInterceptor,
      ])
    ),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
    }),
    importProvidersFrom(NgxSpinnerModule),
    importProvidersFrom(TimeagoModule.forRoot()),
  ],
};
