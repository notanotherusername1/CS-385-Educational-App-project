import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable()

/*Injectable provider class called FirebaseService , which will allow the user to access the data or methods
once the user had been authenticated/logged in. These methods will create the object(user as object
with attributes consisting of frequency of correct/incorrect behaviour logs, and associated picture tasks).
Here the *uid* refers to the specific authenticated user who logged in, and their relating info */
export class FirebaseService {


  private snapshotChangesSubscription: any;
  constructor(public afs: AngularFirestore){}

/*In getTasks() a promise is created which when it is resolved, it gets the specific user
 who was authenticated,their documents and data. The user account is stored under name 'people'
 in firebase and the relating tracked behaviours in a folder/collection called 'behaviourLogs'*/
  getTasks(){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('behaviourLogs').snapshotChanges()
      .subscribe(snapshots => {
        resolve(snapshots);
      })
    });
  }
/*when user clicks on LogOut on menu page, this method here is called to unsubscribe from recieveing info
re this particular user at this time*/
  unsubscribeOnLogOut(){
    this.snapshotChangesSubscription.unsubscribe();
  }

/*updates the behaviour log to new values and/or image */
  updateTask(targetBehaviourKey, value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('behaviourLogs').doc(targetBehaviourKey).set(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
/*deletes the behaviour logs from the firebase database of the specific user*/
  deleteTask(targetBehaviourKey){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('behaviourLogs').doc(targetBehaviourKey).delete()
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
/*this method uploads contents (associated image task, correct and incorrect number of clicks) to firebase */
  createTask(value){
    console.log("I am creating a task");
    console.log(value);
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('behaviourLogs').add({
        image: value.image,
        correct: value.num_cor,
        incorrect: value.num_inco
      })
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
/*this method converts the image to base64 url before uploading it to firebase. this method will give a url */
  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };
/*uploads image to firebase */
  uploadImage(imageURI, randomId){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child(randomId); //reference to the lower-tier location
      //where the images will be uploaded
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url') //uploads the base64 string to storage
        .then(snapshot => {
          snapshot.ref.getDownloadURL()
          .then(res => resolve(res))
        }, err => {
          reject(err);
        })
      })
    })
  }



}
