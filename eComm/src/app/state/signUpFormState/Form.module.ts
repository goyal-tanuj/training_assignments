export interface Validator {
  type:
    | 'required'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'email'
    | 'requiredTrue';
  message: string;
  value?: string | number;
}

export interface Option {
  key: string;
  value: string;
}

export interface FormField {
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'textarea'
    | 'date'
    | 'section';
  value: any;
  name: string;
  label: string;
  placeholder?: string;
  validators?: Validator[];
  options?: Option[];
  child?: FormField[];
}

export interface SignUpForm{
  SignUpForm:FormField[];
}