import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StateInterface } from '../../state/States.module';
import { selectCartQuantity } from '../../state/State.selector'; 
import { logoutUser } from '../../state/userState/user.action';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'], 
})
export class NavbarComponent implements OnInit {
  CartQnty$!: Observable<number>;

  constructor(private store: Store<StateInterface>) {}

  ngOnInit(): void {
    this.CartQnty$ = this.store.select(selectCartQuantity);
  }
  Checkout() {
  const confirmCheckout = window.confirm("Do you want to checkout?");
  if (confirmCheckout) {
    this.store.dispatch(logoutUser());
  }
}

  
}
