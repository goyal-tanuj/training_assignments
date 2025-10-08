import { createReducer, on } from '@ngrx/store';
import { addUser } from './allUsers.action';
import { initialState } from './allUsers.state';
const _AllUsersReducer = createReducer(
  initialState,

  on(addUser, (state, { UserData}) => {
    return {
      ...state,
      AllUsers: [...state.AllUsers, UserData]
    };
  })
);

export function AllUsersReducer(state: any, action: any) {
  return _AllUsersReducer(state, action);
}
