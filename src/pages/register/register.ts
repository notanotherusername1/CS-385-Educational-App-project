import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

/*Appropriate message to be shown depending on which variable is missing when
user enters or does not enter any data */
  validation_messages = {
   'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Enter a valid email.' }
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

/*Uses the authService class called doRegister, and when the doRegister
runs succesfully the success message is shown to the user, otherwise an error message is displayed*/
  tryRegister(value){
    this.authService.doRegister(value)
     .then(res => {
       console.log(res);
       this.errorMessage = "";
       this.successMessage = "Your account has been created. Please log in.";
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
  }

/*Represents a button that navigates the user back to the Log In page */
  goLoginPage(){
    this.navCtrl.pop();
  }

}
