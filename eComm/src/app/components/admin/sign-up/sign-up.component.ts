import { Component, OnInit } from '@angular/core';
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
import { Observable, Subscription } from 'rxjs';
import { addUser } from '../../../state/AllUsers/allUsers.action';
import { AllUsersState, User } from '../../../state/AllUsers/allUsersmodule';
@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  form!: FormGroup;
  formData: any[] = [];
  signupformEnum = SignUpFormEnum;
  repeater: any;
  subscriptionForm!: Subscription;
  constructor(private store: Store<StateInterface>, private fb: FormBuilder) {}
  User!: User[];
  private transformFormValue(formValue: any) {
    return {
      id: Date.now(),
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      gender: formValue.gender,
      addressSection: formValue.addressSection,
      terms: formValue.terms,
    };
  }

  ngOnInit(): void {
    this.subscriptionForm = this.store.select('SignUpForm').subscribe((res) => {
      this.formData = res.SignUpForm;
      this.createForm();
    });
  }

  createFormControl(fieldValue: string, fieldValidator: []): FormControl {
    const validators: ValidatorFn[] = this.createValidator(fieldValidator);
    return new FormControl(fieldValue || '', validators);
  }
  createForm() {
    const group: { [key: string]: FormControl | FormGroup | FormArray } = {};
    this.formData.forEach((field) => {
      if (field.type !== 'section') {
        group[field.name] = this.createFormControl(
          field.value,
          field.validators
        );
      }
      if (field.type === 'section') {
        const sectionGroup: { [key: string]: FormControl } = {};
        field.child.forEach((fieldChild: any) => {
          sectionGroup[fieldChild.name] = this.createFormControl(
            fieldChild.value,
            fieldChild.validators
          );
        });
        group[field.name] = new FormGroup(sectionGroup);
      }
    });
    this.form = new FormGroup(group);
  }
  createValidator(fieldValidator: any): ValidatorFn[] {
    const validators_list: ValidatorFn[] = [];
    fieldValidator.forEach(
      (validator: { type: string; value?: any; message: string }) => {
        switch (validator.type) {
          case 'required':
            validators_list.push(Validators.required);
            break;
          case 'requiredTrue':
            validators_list.push(Validators.requiredTrue);
            break;
          case 'email':
            validators_list.push(Validators.email);
            break;
          case 'minLength':
            validators_list.push(Validators.minLength(validator.value));
            break;
          case 'maxLength':
            validators_list.push(Validators.maxLength(validator.value));
            break;
          case 'pattern':
            validators_list.push(Validators.pattern(validator.value));
            break;
        }
      }
    );
    return validators_list;
  }
  onSubmit() {
    // if (this.form.invalid) {
    //   console.log('invalid');
    //   this.markAllTouched();
    // } else {
    console.log('K');
    const userData = this.transformFormValue(this.form.value);
    this.store.dispatch(addUser({ UserData: userData }));
    this.store.select('AllUsers').subscribe((res) => {
      this.User = res.AllUsers;
    });
    console.log(this.User);
  }
  markAllTouched() {
    this.form.markAllAsTouched();
  }
  getFormArray(fieldName: string): FormArray {
    return this.form.get(fieldName) as FormArray;
  }
}
