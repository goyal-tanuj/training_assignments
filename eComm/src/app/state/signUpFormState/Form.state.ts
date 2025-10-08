export const initialState = {
  SignUpForm: [
    {
      type: 'text',
      value: '',
      name: 'firstName',
      label: 'First Name',
      placeholder: 'Enter your first name',
      validators: [
        { type: 'required', message: 'First Name is required' },
        {
          type: 'minLength',
          value: 2,
          message: 'First Name must be at least 2 characters',
        },
        {
          type: 'maxLength',
          value: 10,
          message: 'First Name cannot exceed 10 characters',
        },
      ],
    },
    {
      type: 'text',
      value: '',
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter your last name',
      validators: [
        { type: 'required', message: 'Last Name is required' },
        {
          type: 'minLength',
          value: 2,
          message: 'Last Name must be at least 2 characters',
        },
        {
          type: 'maxLength',
          value: 10,
          message: 'Last Name cannot exceed 10 characters',
        },
      ],
    },
    {
      type: 'email',
      value: '',
      name: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      validators: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Enter a valid email address' },
      ],
    },
    {
      type: 'password',
      value: '',
      name: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      validators: [
        { type: 'required', message: 'Password is required' },
        {
          type: 'minLength',
          value: 8,
          message: 'Password must be at least 8 characters',
        },
        {
          type: 'maxLength',
          value: 10,
          message: 'Password cannot exceed 10 characters',
        },
      ],
    },
    {
      type: 'radio',
      value: '',
      name: 'gender',
      label: 'Gender',
      options: [
        { key: 'male', value: 'Male' },
        { key: 'female', value: 'Female' },
        { key: 'other', value: 'Other' },
      ],
      validators: [{ type: 'required', message: 'Gender is required' }],
    },
    {
      type: 'section',
      value: null,
      name: 'addressSection',
      label: 'Address',
      child: [
        {
          type: 'text',
          value: '',
          name: 'street',
          label: 'Street',
          placeholder: 'Enter your street',
          validators: [{ type: 'required', message: 'Street is required' }],
        },
        {
          type: 'text',
          value: '',
          name: 'city',
          label: 'City',
          placeholder: 'Enter your city',
          validators: [{ type: 'required', message: 'City is required' }],
        },
        {
          type: 'text',
          value: '',
          name: 'state',
          label: 'State',
          placeholder: 'Enter your state',
          validators: [{ type: 'required', message: 'State is required' }],
        },
        {
          type: 'text',
          value: '',
          name: 'postalCode',
          label: 'Postal Code',
          placeholder: 'Enter your postal code',
          validators: [
            { type: 'required', message: 'Postal Code is required' },
            {
              type: 'pattern',
              value: '^[0-9]{5,6}$',
              message: 'Enter a valid postal code',
            },
          ],
        },
        {
          type: 'text',
          value: '',
          name: 'countryAddress',
          label: 'Country',
          placeholder: 'Enter country',
          validators: [{ type: 'required', message: 'Country is required' }],
        },
      ],
    },
    {
      type: 'checkbox',
      value: false,
      name: 'terms',
      label: 'I accept the terms and conditions',
      validators: [
        {
          type: 'requiredTrue',
          message: 'You must accept the terms and conditions',
        },
      ],
    },
  ],
};
