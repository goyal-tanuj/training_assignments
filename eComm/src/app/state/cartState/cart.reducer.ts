import { createReducer, on } from '@ngrx/store';
import { initialState } from './cart.state';
import { increCartUpdate, decreCartUpdate } from './cart.action';

const _CartReducer = createReducer(
  initialState,
  on(increCartUpdate, (state) => {
    return {
      ...state,
        CartQnty: state.CartQnty + 1,
    };
  }), on(decreCartUpdate, (state) => {
    return {
      ...state,
        CartQnty: state.CartQnty - 1,
    };
  })
);

export function CartReducer(state: any, action: any) {
  return _CartReducer(state, action);
}
