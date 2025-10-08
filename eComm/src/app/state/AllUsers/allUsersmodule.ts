export interface AddressSection {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  countryAddress: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  addressSection: AddressSection;
  terms: boolean;
}
export interface AllUsersState {
  AllUsers: User[];
}
