import { Component } from '@angular/core';
import { ViewController, normalizeURL, ToastController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FirebaseService } from '../services/firebase.service';
import { FotoArray } from '../FotoSelectorListing';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {

  image: any;
  item: any;
  loading: any;

  foto = FotoArray;
  index: number; 
  num_correct:number;
  num_incorrect:number;

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private firebaseService: FirebaseService,
    private loadingCtrl: LoadingController
  ) {
    this.loading = this.loadingCtrl.create();
    this.index = 0;
    this.num_incorrect =0;
    this.num_correct=0;
  }

/* fired when the page is about to get loaded but before anything is displayed
,it makes a call to getData method */
  ionViewWillLoad(){
    console.log("ionViewWillLoad** method used");
    this.getData()
  }

/* gets the data (specifically gets the image, correct and incorrect value) from firestore database */
  getData(){
    console.log("getData** method used");
    this.item = this.navParams.get('data');
    this.image = this.item.image;
    this.num_correct = this.item.num_correct;
    this.num_incorrect = this.item.num_incorrect;
  }

/*Navigates the user back to previous page -  menu page */
  dismiss() {
   this.viewCtrl.dismiss();
  }

/*Pushes values to firebase storage */
  onSubmit(value){
    //Values in this structure will be uploaded to firebase
    let data = {
      image: this.image,
      num_cor: this.num_correct,
      num_inco: this.num_incorrect
    }
    /*the below code will make a call to createTask() method
      which is in the firebaseService class, and it will pass the data
      from above data variable code. than it will move user back to
      the previous page(menu page), and also reset the fields on the
      new behaviour tracking page */
    this.firebaseService.updateTask(this.item.id,data)
    .then(
      res => {
        this.viewCtrl.dismiss();
      }
    )
  }

/*Deletes the logged data in firebase if user confirms with 'yes' by using the class deleteTask from firebaseService*/
  delete() {
    let confirm = this.alertCtrl.create({
      message: 'Do you want to delete this behaviour log?',
      buttons: [
        {
          text: 'No',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.firebaseService.deleteTask(this.item.id)
            .then(
              res => this.viewCtrl.dismiss(),
              err => console.log(err)
            )
          }
        }
      ]
    });
    confirm.present();
  }

/*allows user to select the image task by going through each one in the array*/
  openImagePicker(){
    this.image = this.foto[this.index].image;
       console.log("OpenImagePicker");
       console.log(this.foto[this.index].image);
       this.index++;
       if(this.index==10){
         this.index =0;
       }
  }

/*allows user to select the number of times their client got a response correct*/
  correctResponse(){
    console.log("correct response method used");
    this.num_correct++;
  }

/*allows user to select the number of times their client got a response incorrect*/
  incorrectResponse(){
    this.num_incorrect++;
  }   
 /*uploads the image to firebase storage */
  uploadImageToFirebase(image){
    this.loading.present();
    //use angular normalizeURL service, to give image a URL
    image = normalizeURL(image);
    //gives the image a random id
    let randomId = Math.random().toString(36).substr(2, 5);
    console.log(randomId);

    //uploads image to firebase storage, by using the uploadImage class in firebaseService
    this.firebaseService.uploadImage(image, randomId)
    .then(photoURL => {
      this.image = photoURL;
      this.loading.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Image was updated successfully',
        duration: 3000
      });
      toast.present();
    })
  }

}