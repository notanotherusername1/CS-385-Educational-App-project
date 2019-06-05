import { Component } from '@angular/core';
import { ViewController, normalizeURL, ToastController, LoadingController } from 'ionic-angular';
import { FirebaseService } from '../services/firebase.service';
import { FotoArray } from '../FotoSelectorListing';

@Component({
  selector: 'page-new-task-modal',
  templateUrl: 'new-task-modal.html'
})

export class NewTaskModalPage {

  image: any;
  loading: any;

  foto = FotoArray;
  index: number; 
  num_correct:number;
  num_incorrect:number;

  constructor(
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private firebaseService: FirebaseService,
    private loadingCtrl: LoadingController,
    
  ) {
    this.loading = this.loadingCtrl.create();
    this.index = 0;
    this.num_incorrect =0;
    this.num_correct=0;
  }
//the ionViewWillLoad method will run when the new task page is about to load
//and this method will call on to resetFields method
  ionViewWillLoad(){
    this.resetFields()
  }
//when the new task page is loaded, picture called "10.JPG" will be displayed as default
  resetFields(){
    this.image = "./assets/imgs/10.JPG";
  }
/*Instance member of ViewController, to dismiss the current viewController */
  dismiss() {
   this.viewCtrl.dismiss();

  }

  onSubmit(value){
    console.log(value);
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
    this.firebaseService.createTask(data)
    .then(
      res => {
        this.resetFields();
        this.viewCtrl.dismiss();
      }
    )
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

/*allows user to select the number of times their client got a response INcorrect*/
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