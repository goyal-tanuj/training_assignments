import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map, switchMap } from 'rxjs';

import { Product } from '../../../state/productState/product.module';
import { addToCart } from '../../../state/productState/product.action';
import { increCartUpdate } from '../../../state/cartState/cart.action';
import { StateInterface } from '../../../state/States.module';
import {
  selectAllProducts,
  selectCartQuantity,
} from '../../../state/State.selector';

@Component({
  standalone:false,
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product!: Observable<Product | undefined>;
  cartQnty!: Observable<number>;

  private paramSub!: Subscription;

  constructor(
    private store: Store<StateInterface>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cartQnty = this.store.select(selectCartQuantity);

    this.product = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        if (id) {
          const productId = +id;
          return this.store
            .select(selectAllProducts)
            .pipe(map((Products) => Products.find((p) => p.id === productId)));
        }
        return [undefined];
      })
    );
  }

  addToCart(id: number): void {
    this.store.dispatch(addToCart({ id }));
    this.store.dispatch(increCartUpdate());
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
  }
}
