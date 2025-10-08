import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/admin/log-in/log-in.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { CartComponent } from './components/admin/cart/cart.component';
import { ProductDetailComponent } from './components/admin/product-detail/product-detail.component';
import { SignUpComponent } from './components/admin/sign-up/sign-up.component';
import { UserSignInComponent } from './components/admin/user-sign-in/user-sign-in.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LogInComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  { path: 'product/:id', 
    component: ProductDetailComponent },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'PDetails',
    component: ProductDetailComponent,
  },
  {
    path: 'SignUp',
    component: SignUpComponent,
  },
  {
    path: 'User',
    component: UserSignInComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
