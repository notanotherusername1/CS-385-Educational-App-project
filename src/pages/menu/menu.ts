import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { NewTaskModalPage } from '../new-task-modal/new-task-modal';
import { DetailsPage } from '../details/details';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})

export class MenuPage {

  items: Array<any>;
    
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {

  }

/* fired when entering page just before the view is loaded,it makes a call to getTasks method */
  ionViewWillEnter(){
    console.log ("ionViewWillEnter MENU PAGE used");
    this.getData();
  }
/* displays the already logged data on the menu page */
  getData(){
    console.log ("getDATA MENU PAGE***");
    this.firebaseService.getTasks()
    .then(behaviourLogs => {
      this.items = behaviourLogs;
    })
  }
/* This method navigates user to details page, it allows user to view the values that are stored in firebase
 of each created log when they click on viewDetails button.*/
  viewDetails(id, item){
    console.log ("88888 viewDetails to see database ++" + item.correct + " incORRECT VALUE: " + item.incorrect);
    let data = {
      num_correct: item.correct,
      num_incorrect: item.incorrect,
      image: item.image,
      id: id
    }
    this.navCtrl.push(DetailsPage, {
      data: data
    })
  }
/*when user clicks on the plus button, this method gets called, which navigates
/*user to the page called NewTaskModalPage where they can create a new log*/
  openNewUserModal(){
    let modal = this.modalCtrl.create(NewTaskModalPage);
    modal.onDidDismiss(data => {
      this.getData();
    });
    modal.present();
  }
/*when user clicks on logout button, the below method is called, which in turn
/*calls the doLogout() method from the AuthService class in the auth.service.ts file
/*Afterwards the app navigates the user back to the logIn page, which is also part
/*of the AuthService class. */
  logout(){
    this.authService.doLogout()
    .then(res => {
      this.navCtrl.push(LoginPage);
    })
  }

}
