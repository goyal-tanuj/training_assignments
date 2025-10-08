import { createReducer, on } from '@ngrx/store';
import { initialState } from './Form.state';

const _SignUpFormReducer = createReducer(
  initialState
);

export function SignUpFormReducer(state: any, action: any) {
  return _SignUpFormReducer(state, action);
}
