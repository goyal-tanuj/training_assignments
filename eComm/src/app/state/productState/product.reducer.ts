import { createReducer, on } from '@ngrx/store';
import { initialState } from './product.state';
import { addToCart, removeFromCart } from './product.action';

const _ProductReducer = createReducer(
  initialState,

  on(addToCart, (state, { id }) => {
    const updatedProducts = state.Products.map((product) =>
      product.id === id
        ? { ...product, inCartQt: product.inCartQt + 1 }
        : product
    );

    return {
      ...state,
      Products: updatedProducts, 
    };
  }),

  on(removeFromCart, (state, { id }) => {
    const updatedProducts = state.Products.map((product) =>
      product.id === id && product.inCartQt > 0
        ? { ...product, inCartQt: product.inCartQt - 1 }
        : product
    );

    return {
      ...state,
      Products: updatedProducts, 
    };
  })
);

export function ProductReducer(state: any, action: any) {
  return _ProductReducer(state, action);
}
