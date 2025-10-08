import {createAction, props} from '@ngrx/store';

export const addToCart=createAction('incre',props<{id:number}>());
export const removeFromCart=createAction('decre',props<{id:number}>());