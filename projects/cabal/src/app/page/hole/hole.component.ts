import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { AuthService } from '../../services/auth.service';
import { Observable, Subject } from 'rxjs';

export interface Item { name: string; }
@Component({
  selector: 'app-hole',
  templateUrl: './hole.component.html',
  styleUrls: ['./hole.component.scss']
})
export class HoleComponent implements OnInit {

  holes = [
    {
      hole: 1,
      par: 3,
      score: 3
    },
    {
      hole: 2,
      par: 3,
      score: 3
    },
    {
      hole: 3,
      par: 3,
      score: 3
    },
    {
      hole: 4,
      par: 3,
      score: 3
    },
    {
      hole: 5,
      par: 3,
      score: 3
    },
    {
      hole: 6,
      par: 3,
      score: 3
    },
    {
      hole: 7,
      par: 3,
      score: 3
    },
    {
      hole: 8,
      par: 3,
      score: 3
    },
    {
      hole: 9,
      par: 3,
      score: 3
    },
    {
      hole: 10,
      par: 5,
      score: 5
    },
    {
      hole: 11,
      par: 5,
      score: 5
    },
    {
      hole: 12,
      par: 5,
      score: 5
    },
    {
      hole: 13,
      par: 5,
      score: 5
    },
    {
      hole: 14,
      par: 5,
      score: 5
    },
    {
      hole: 15,
      par: 5,
      score: 5
    },
    {
      hole: 16,
      par: 5,
      score: 5
    },
    {
      hole: 17,
      par: 5,
      score: 5
    },
    {
      hole: 18,
      par: 5,
      score: 5
    }
  ];
  golfcourse={
    holes: this.holes
  }
  g = [
    {
      hole: this.holes
    },
    {
      hole: this.holes
    },
    {
      hole: this.holes
    }
  ]

  private itemDoc: AngularFirestoreDocument<Item>;
  public users: Observable<any[]>;
  public showWebcam = false;

  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  currentTab = 'stars';
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
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  games: any;
  currentUser: any;
  user: Observable<any>;

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
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

    console.log(JSON.stringify(this.holes))

    this.users = db.collection('users').valueChanges();
    this.getUser();
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    db.collection('games').valueChanges().subscribe(g => {
      this.games = g;
    });
  }

  ngOnInit() {
  }

  updateProfileImage(currentUser) {
    currentUser.photoURL = this.webcamImage;
    this.auth.updateUserData(currentUser).then(this.webcamImage = undefined);
  }
  updateDisplayName(currentUser, name) {
    currentUser.displayName = name;
    this.auth.updateUserData(currentUser).then(this.webcamImage = undefined);
  }
  updateSMS(currentUser, phoneNumber) {
    currentUser.phoneNumber = phoneNumber;
    this.auth.updateUserData(currentUser).then();
  }
  getUser() {
    this.user = this.auth.getUser();
  }
  getKey(seat) {
    let key = Object.keys(seat)[0];
    if (!this.games) return;
    let game = this.games.filter(game => game.id == key);
    game[0].seat = seat[key];
    return game;
  }

  getGame(item) {
    let gameId = item.key;
    let isStar = item.value
    if (!isStar) return;
    let game = this.games.filter(game => game.id == gameId)
    return game;
  }
  switchUser(id) {
    this.auth.switchUser(id);
    this.getUser();
  }
}
