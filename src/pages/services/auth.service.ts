import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';
import { FirebaseService } from './firebase.service';

/*Injectable provider class called AuthService which will use feature of Firebase SDK Authentication,
which when injected into a page, allows the user to either register, log in or to log out*/
@Injectable()
export class AuthService {

  constructor(
    private firebaseService: FirebaseService
  ){}

/*uses a firebase service called createUserWithEmailAndPassword, which allows the user
to register by providing an email and a password*/
  doRegister(value){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

/*Uses a firebase service called signInWithEmailAndPassword, which allows the user
to log in if they provide a correct email and a password.*/
  doLogin(value){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
   })
  }

/*when user presses the log out, firebase service signout method gets used, than
the firebaseService.unsubscribeOnLogOut gets called which stops the firebase from
receiving data re that particular user*/
  doLogout(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        firebase.auth().signOut()
        .then(() => {
          this.firebaseService.unsubscribeOnLogOut();
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    })
  }
}
