import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RegisterPage } from '../register/register';
import { MenuPage } from '../menu/menu';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  validations_form: FormGroup;
  errorMessage: string = '';

/*Appropriate message to be shown depending on which variable is missing when
user enters or does not enter any data */
  validation_messages = {
   'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Please enter a valid email.' }
   ],
   'password': [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 5 characters long.' }
   ]
 };

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

/*Method that loads before the page is displayed. This method requires the user
to enter a valid email and a password that have specific pattern and length respectively*/
  ionViewWillLoad(){
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

/*When user clicks on tryLogin button, this method takes the values (email and password)
and check through the authService class method doLogin if they were valid.
If the values were valid, than the user is navigated to the menu page, otherwise
an error message is displayed.*/
  tryLogin(value){
    this.authService.doLogin(value)
    .then(res => {
      this.navCtrl.push(MenuPage);
    }, err => {
      this.errorMessage = err.message;
    })
  }

/*Navigates user to registration page */
  goRegisterPage(){
    this.navCtrl.push(RegisterPage);
  }

}
