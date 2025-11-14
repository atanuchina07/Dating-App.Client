import { inject, Injectable } from '@angular/core';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusySpinnerServiceService {
  busyRequestCount = 0;
  spinnerService = inject(NgxSpinnerService);
  busy()
  {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: "timer",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff"
    })
  }
  idle()
  {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0)
    {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
  constructor() { }
}
