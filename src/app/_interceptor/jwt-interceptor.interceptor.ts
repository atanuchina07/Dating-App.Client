import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';
//This is for authorization process to automatically for all api endpoint call
export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  if (accountService.currentUser()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accountService.currentUser()?.token}`,
      },
    });
  }
  return next(req);
};
