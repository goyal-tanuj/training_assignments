import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Products} from './productState/product.module'
import { SignUpForm } from  './signUpFormState/Form.module'
import { AllUsersState } from './AllUsers/allUsersmodule'; 

export const selectProducts = createFeatureSelector<Products>('Products');


export const selectAllProducts = createSelector(
  selectProducts,
  (state) => state.Products 
);


export const selectCartState = createFeatureSelector<{ CartQnty: number }>('CartQnty');

export const selectCartQuantity = createSelector(
  selectCartState,
  (state) => state.CartQnty
);

export const selectSignUpForm = createFeatureSelector<SignUpForm>('SignUpForm');

export const selectEntireSignUpForm = createSelector(
  selectSignUpForm,
  (SignUpForm) => SignUpForm
);

export const selectAllUsersState = createFeatureSelector<AllUsersState>('allUsers');

export const selectAllUsers = createSelector(
  selectAllUsersState,
  (state) => state.AllUsers
);
