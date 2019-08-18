import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { AuthService } from '../../services/auth.service';
import { Observable, Subject } from 'rxjs';

export interface Item { name: string; }
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public currentUser = { uid: '', photoURL: '', displayName: '',
    email: '', date: '', phoneNumber: ''  };
  private itemDoc: AngularFirestoreDocument<Item>;
  public users: Observable<any[]>;
  public showWebcam = false;

  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
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
      private auth: AuthService
    ) {
    this.users = db.collection('users').valueChanges();
    this.getUser();
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  ngOnInit() {
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
