import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { SignUpFormEnum } from '../../../state/signUpFormState/Form.enum';
import { StateInterface } from '../../../state/States.module';
import { Store } from '@ngrx/store';
import { Subscription, combineLatest } from 'rxjs';
import { setUser } from '../../../state/userState/user.action';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AllUsersState, User } from '../../../state/AllUsers/allUsersmodule';

@Component({
  standalone: false,
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  formData: any[] = [];
  signupformEnum = SignUpFormEnum;
  subscriptionForm!: Subscription;
  AllUsers!: User[];
  constructor(
    private store: Store<StateInterface>,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.store.select('AllUsers').subscribe((res) => {
      this.AllUsers = res.AllUsers;
      console.log(this.AllUsers);
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      this.markAllTouched();
      console.log('Form is invalid');
      return;
    }

    const email = this.form.value.email;
    const password = this.form.value.password;
    const matchedUser = this.AllUsers.find(
      (user) => user.email === email && user.password === password
    );
    if (matchedUser) {
      this.store.dispatch(setUser({ UserData: { email, password } }));
      this.router.navigate(['/products']);
    } else {
      window.alert('Invalid email or password')
    }
  }

  markAllTouched() {
    this.form.markAllAsTouched();
  }

  getFormArray(fieldName: string): FormArray {
    return this.form.get(fieldName) as FormArray;
  }

  ngOnDestroy() {
    if (this.subscriptionForm) {
      this.subscriptionForm.unsubscribe();
    }
  }
}
