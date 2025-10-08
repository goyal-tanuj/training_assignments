import { SignUpForm} from "./signUpFormState/Form.module";
import { Products } from "./productState/product.module";
import { AllUsersState } from "./AllUsers/allUsersmodule";
import { CurrentUserObject } from "./userState/user.module";
export interface StateInterface{
    Products:Products;
    CartQnty: { CartQnty: number };
    SignUpForm:SignUpForm;
    AllUsers:AllUsersState;
    CurrentUser:CurrentUserObject;
}