import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './components/admin/log-in/log-in.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { CartComponent } from './components/admin/cart/cart.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { provideHttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { ProductReducer } from './state/productState/product.reducer';
import { CartReducer } from './state/cartState/cart.reducer';
import { ProductDetailComponent } from './components/admin/product-detail/product-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpFormReducer } from './state/signUpFormState/Form.reducer';
import { AllUsersReducer } from './state/AllUsers/allUsers.reducer';
import { SignUpComponent } from './components/admin/sign-up/sign-up.component';
import { CurrentUserReducer } from './state/userState/user.reducer';
import { UserSignInComponent } from './components/admin/user-sign-in/user-sign-in.component';
@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    ProductsComponent,
    CartComponent,
    NavbarComponent,
    ProductDetailComponent,
    SignUpComponent,
    UserSignInComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      Products: ProductReducer,
      CartQnty: CartReducer,
      SignUpForm: SignUpFormReducer,
      AllUsers:AllUsersReducer,
      CurrentUser:CurrentUserReducer
      
    }),
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
