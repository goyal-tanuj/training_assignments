import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../../../state/productState/product.module';
import { addToCart } from '../../../state/productState/product.action';
import { increCartUpdate } from '../../../state/cartState/cart.action';
import {
  selectAllProducts,
  selectCartQuantity,
} from '../../../state/State.selector';
import { StateInterface } from '../../../state/States.module';

@Component({
  standalone: false,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  Products$!: Observable<Product[]>;
  cartQnty$!: Observable<number>;

  constructor(private store: Store<StateInterface>) {}

  ngOnInit(): void {
    this.Products$ = this.store.select(selectAllProducts);
    this.cartQnty$ = this.store.select(selectCartQuantity);
  }

  addToCart(id: number): void {
    this.store.dispatch(addToCart({ id }));
    this.store.dispatch(increCartUpdate());
  }

  productView(): void {
    alert('Product details will be available soon!');
  }

}
