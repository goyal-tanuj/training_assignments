import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../../state/productState/product.module';
import { removeFromCart } from '../../../state/productState/product.action';
import { decreCartUpdate } from '../../../state/cartState/cart.action';
import { StateInterface } from '../../../state/States.module';
import { selectAllProducts, selectCartQuantity } from '../../../state/State.selector';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  Products$!: Observable<Product[]>;
  cartQuantity$!: Observable<number>;

  constructor(private store: Store<StateInterface>) {}

  ngOnInit(): void {
    this.Products$ = this.store.select(selectAllProducts);
    this.cartQuantity$ = this.store.select(selectCartQuantity);
  }

  RemoveFromCart(id: number): void {
    this.store.dispatch(removeFromCart({ id }));
    this.store.dispatch(decreCartUpdate());
  }
}
