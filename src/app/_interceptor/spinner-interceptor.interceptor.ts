import { HttpInterceptorFn } from '@angular/common/http';
import { BusySpinnerServiceService } from '../_services/busy-spinner-service.service';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
///This is used for creating loading icon for each request
export const spinnerInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(BusySpinnerServiceService);
  spinnerService.busy();
  return next(req).pipe(
    delay(1000),
    finalize(() => {
      spinnerService.idle();
    })
  );
};
