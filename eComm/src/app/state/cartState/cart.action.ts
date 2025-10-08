import { createAction } from "@ngrx/store";
export const increCartUpdate = createAction(
    '[Cart] increase Cart'
)
export const decreCartUpdate = createAction(
    '[Cart] decrease Cart'
)