import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { AuthService } from '../../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { timeout } from 'q';
import { AuthProcessService } from 'ngx-auth-firebaseui';

export interface Item { name: string; }
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public currentUser = { uid: '', photoURL: '', displayName: 'Enter Name',
    email: 'Enter Email', date: '', phoneNumber: 'Enter Phone Number'  };
  private itemDoc: AngularFirestoreDocument<Item>;
  public users: Observable<any[]>;

  public editProfile = false;
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;

  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    width: {ideal: 576},
    height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();


  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage.imageAsDataUrl;
    this.showWebcam = false;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }


  constructor(
      db: AngularFirestore,
      private auth: AuthService,
      public afAuth: AuthProcessService
    ) {
    this.users = db.collection('users').valueChanges();
    this.getUser();
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  ngOnInit() {
    setTimeout( () => {
      const s = (document.querySelector('#video > div > video') as HTMLElement).style;
      s.borderRadius = '50%';
      s.transition = '1.6s';
      s.transformStyle = 'preserve-3d';
      s.transform = 'translate(0px, -17px) rotateY(0deg) scale(-1,1)';
      const t = (document.querySelector('#scrollList > app-user > div > img') as HTMLElement).style;
      t.transition = '1.6s';
      t.transformStyle = 'preserve-3d';
      t.transform = 'rotateY(90deg)';
    }
    , 1000);
  }
  flip() {
    const s = (document.querySelector('#video > div > video') as HTMLElement).style;
    const t = (document.querySelector('#scrollList > app-user > div > img') as HTMLElement).style;
    s.transform = (!this.showWebcam) ? 'translate(0px, -17px) rotateY(0deg) scale(-1,1)'
        : 'translate(0px, -17px) rotateY(90deg) scale(-1,1)';
    t.transform = (this.showWebcam) ? 'rotateY(0deg)' : 'rotateY(90deg)';

    this.showWebcam = !this.showWebcam;
  }

  updateProfileImage() {
    this.currentUser.photoURL = this.webcamImage;
    this.auth.updateUserData(this.currentUser).then(this.webcamImage = undefined);
  }
  updateDisplayName(name) {
    this.currentUser.displayName = name;
    this.auth.updateUserData(this.currentUser).then(this.webcamImage = undefined);
  }
  updateSMS(phoneNumber) {
    this.currentUser.phoneNumber = phoneNumber;
    this.auth.updateUserData(this.currentUser).then();
  }
  async getUser() {
    this.currentUser = await this.auth.getUser();
  }

}
