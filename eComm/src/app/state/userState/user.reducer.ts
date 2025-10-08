import { createReducer, on } from '@ngrx/store';
import { setUser ,logoutUser} from './user.action';
import { initialState} from './user.state';
import { CurrentUser, CurrentUserObject } from './user.module';

const _CurrentUserReducer = createReducer(
  initialState,
  on(setUser, (state, { UserData }) => {
    console.log(UserData);
    return{
    ...state,
    CurrentUser: {
      email: UserData.email,
      password: UserData.password,
    }
  }}),
  on(logoutUser, (state) => ({
    ...state,
    CurrentUser: {
      email: '',
      password: '',
    },
  }))
);

export function CurrentUserReducer(state: CurrentUserObject | undefined, action: any) {
  return _CurrentUserReducer(state, action);
}
