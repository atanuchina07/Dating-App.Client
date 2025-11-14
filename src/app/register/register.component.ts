import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgFor, NgIf, BsDatepickerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  //userHomeComponent = input.required<any>(); //this is for parent to child data transfer
  userRegisterCancle = output<boolean>(); // this is for child to parent data transfer
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService); ///inject Toastrservice for any notifications.
  private fb = inject(FormBuilder);
  private router = inject(Router);
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  model: any = {};
  ngOnInit(): void {
    this.initializeRegister(); // You need to initialize the reactive form
  }
  initializeRegister() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      gender: ['male'],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(12),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(), ///By this code password and confirmpassword equal validation
    });
  }
  //This is custom Validators--password and confirmpassword is equal for valid status.
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value == control.parent?.get(matchTo)?.value
        ? null
        : { isMatching: true };
    };
  }
  register() {
    console.log(this.registerForm.value, 'Register Entry');
    const dob = this.getOnlyDate(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({ dateOfBirth: dob });
    this.accountService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log(response, 'response generated');
        this.router.navigateByUrl('/members');
        this.toastr.success('Registered Successfully');
      },
      error: (error) => (this.validationErrors = error), /////toastr notfication
    });
  }
  cancle() {
    this.userRegisterCancle.emit(true);
  }
  ///Convert a full date-time string into a clean date-only string
  getOnlyDate(Dob: string | undefined) {
    if (!Dob) return;
    return new Date(Dob).toISOString().slice(0, 10);
  }
}
