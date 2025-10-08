import {createAction, props} from '@ngrx/store';
import { User } from './allUsersmodule';

export const addUser=createAction('adding new User',props<{UserData:User}>());