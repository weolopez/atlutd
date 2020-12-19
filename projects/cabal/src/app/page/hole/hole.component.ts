import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { AuthService } from '../../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';

export interface Item { name: string; }
@Component({
  selector: 'app-hole',
  templateUrl: './hole.component.html',
  styleUrls: ['./hole.component.scss']
})
export class HoleComponent {
  showHole = false;
  holes;
  golfcourses;
  golfround;
  rounds;  
  games: any;
  currentUser: any;
  user: Observable<any>;
  roundCollection: any;
  currentHole: any;
  golfCourseCollection: any;
  golfRoundObs: any;
  filteredUsersObs: Observable<any>;


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
  usersCollection: any;
  currentHoleMap: any;


  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private auth: AuthService,
    public sanitizer:DomSanitizer
  ) {
    this.usersCollection = db.collection('users');
    this.roundCollection = db.collection('golfround');
    this.golfCourseCollection = db.collection('golfcourse');

    this.golfround = this.route.snapshot.paramMap.get('golfround');

    if (this.golfround) {
      window.document.title = this.golfround;
      this.golfRoundObs = this.roundCollection.doc(this.golfround).valueChanges();
    } else {
      this.golfcourses = this.golfCourseCollection.valueChanges();
    }

    if (this.golfround) {
      this.golfRoundObs = this.roundCollection.doc(this.golfround)
          .valueChanges();

          // .pipe(tap((round: any) => {
      this.filteredUsersObs = this.usersCollection.valueChanges()
              .pipe(map((users: Array<any>) => {
                let u = users.filter(u=> { 
                    return (u.golfrounds) ? (u.golfrounds[this.golfround]) ? true : false : false;
                });
                return u;
              })); 
          // })); 
    } else {
      this.rounds = this.roundCollection.valueChanges();
    }

    this.users = this.usersCollection.valueChanges();
    this.getUser().subscribe(u => { this.currentUser = u });

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    db.collection('games').valueChanges().subscribe(g => {
      this.games = g;
    });
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
    return this.user;
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
  getToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
  }
  getPar(g) {
    return g.holes.reduce((sum, h) => sum + h.par, 0);
  }
  newRound(g, name) {
    let round = Object.assign({}, g);
    round.id = name;
    round.date = this.getToday();
    this.roundCollection.doc(name)
      .set(round);
  }
  join(g) {
    g.members = (g.members) ? g.members : [];
    if (g.members.includes(this.currentUser.uid)) return;
    this.user.subscribe(u => {
      g.members.push(u.uid);
      u.golfrounds = (u.golfrounds) ? u.golfrounds : {};
      this.roundCollection.doc(g.id).update(g);
      if (!u.golfrounds[g.id]) {
        let round = {
          golfcourse: g.name,
          score: { 0:0 }
        }
        u.golfrounds[g.id]=round;
        this.usersCollection.doc(u.uid).update(u);
      }
    })
  }
  getScore(user, currentHole) {

    user = (user) ? user : this.currentUser;
    if (!user) return 0;
    if (!user.golfrounds) return 0;
    let score = user.golfrounds[this.golfround].score;

    if  (currentHole) {
      return (score[currentHole]) ? score[currentHole] : 0
    } else {
      let s = 0;
      Object.keys(score).forEach(k=> {
        s = s + score[k];
      })
      return s;
    } 
  }
  changeScore(h, change) {
    this.currentHole = h.hole;
    if (!this.currentHole) alert("bam");
    if (!this.currentUser.golfrounds[this.golfround].score[this.currentHole])
    this.currentUser.golfrounds[this.golfround].score[this.currentHole]=1;
    this.currentUser.golfrounds[this.golfround].score[this.currentHole] += change;
    this.usersCollection.doc(this.currentUser.uid).update(this.currentUser);
  }
  onScroll(event) {
    let t = event.currentTarget;
    let c = Array.from(t.children);
    let parentRec = t.getBoundingClientRect();
    let guessH = 1;

    c.forEach((element: any) => {
      let rect = element.getBoundingClientRect();
      let k={};
      for (var key in parentRec) {
        k[key]=Math.abs(parentRec[key]-rect[key]);
      }
      let h = element.getAttribute('value');
      // console.log(k['left']);
      if (k['left'] < 5) {
        this.currentHole = h;
      }
    });
  }
  viewHole(h) {
    if (!h.map) return
    this.currentHoleMap = this.sanitizer.bypassSecurityTrustResourceUrl(h.map);
    this.showHole = !this.showHole;
  }


  isScrolledIntoView(el) {
    if (!el) return false;
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    return isVisible;
  }

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

}
