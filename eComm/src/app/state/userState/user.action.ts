import { createAction, props } from '@ngrx/store';
import { CurrentUser } from './user.module';

export const setUser = createAction(
  'User Set Current User',
  props<{ UserData: CurrentUser}>()
);

export const logoutUser = createAction('User Logout');