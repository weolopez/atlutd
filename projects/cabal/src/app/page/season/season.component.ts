import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, pipe, forkJoin, of, timer, interval } from 'rxjs';
import { FireService } from '../../services/fire.service';
import { tap, filter, map, mergeMap, ignoreElements, finalize, combineLatest, take, merge } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { AuthService } from '../../services/auth.service';

export interface Season {
  id: string;
  currentRound?: number;
  rounds?: number;
  games?: any[];
  members?: any[];
  seats?: any[];
}

export interface Item { name: string; }
@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss']
})
export class SeasonComponent implements OnInit {
  public iseason = {
    id: '',
    currentRound: 0,
    rounds: '',
    members: [
    ]
  };
  private itemDoc: AngularFirestoreDocument<Item>;
  public currentSeason;
  seasonRef: AngularFirestoreDocument<unknown>;
  seasonObs: Observable<unknown>
  usersRef: AngularFirestoreDocument<unknown>
  usersObs: Observable<unknown[]>;
  user: any;
  seats: Observable<unknown[]>;
  games: Observable<unknown>;

  constructor(
    public route: ActivatedRoute,
    public db: AngularFirestore,
    fs: FireService,
    public auth: AuthService
  ) {
    auth.getUser().then(user=>{
      this.user = user;
    })

    this.currentSeason = this.route.snapshot.paramMap.get('id');
    this.seasonRef = db.collection('seasons').doc(this.currentSeason);
    this.seasonObs = this.seasonRef.valueChanges();

    this.usersObs = this.db.collection('users', ref =>
      ref.where('season', '==', this.currentSeason)).valueChanges();

    this.seats = this.db.collection('seats', ref =>
      ref.where('season', '==', this.currentSeason)).valueChanges();

    this.seats.subscribe(seats => {
      this.games = this.db.collection('users', ref => ref.where('season', '==', this.currentSeason)).valueChanges()
        .pipe(mergeMap(users => this.db.collection('games', ref => ref.where('season', '==', this.currentSeason)).valueChanges()
          .pipe(map(games => {
            let usersObject = {};
            users.forEach(user => {
              user['seats'].forEach( g => {
                const GAMEID = Object.keys(g)[0];
                const SEATID = g[GAMEID];
                const USERID = user['id'];
                usersObject[GAMEID] = (usersObject[GAMEID]) ? usersObject[GAMEID] : {}; 
                usersObject[GAMEID][SEATID] = USERID ;
              })
            });
            games.map(game => {
              game['seats'] = {};
              seats.forEach(seat => game['seats'][seat['id']] = seat['id']);
              const g = usersObject[game['id']];
              if (g) Object.keys(g)
                .forEach(SEATID => game['seats'][SEATID] = g[SEATID]);
            });
            return games;
          }))
        ))
    })

    // this.seasonObs
    // .pipe(map(season => (season) ? season : { id: this.currentSeason }))
    // .pipe(mergeMap(season => users.pipe(map(users=>{ season['users'] = users; return season; }))))
    // .pipe(mergeMap(season => seats.pipe(map(seats=>{ season['seats'] = seats; return season; }))))
  }

  ngOnInit() {
  }
  setNewSeason() {
    this.db.collection('seasons').doc(this.currentSeason).set({ id: this.currentSeason, currentRound: 0, members: [] });
    this.games.subscribe(games => this.update({ gamesCount: games['length'] }));
    this.usersObs.pipe(map(users => users.map(users => users['id'])))
      .subscribe(users => this.update({ usersCount: users.length, members: this.shuffle(users), nextPick: 0 }));
    this.seats.subscribe(seats => this.update({ seatsCount: seats.length }));
  }
  startRound(season) {
    const rounds = (season.gamesCount * season.seatsCount) / season.usersCount;
    if (season.currentRound < (season.gamesCount * season.seatsCount) / season.usersCount) {
      this.update({ currentRound: season.currentRound + 1 });
    } else {
      this.update({ currentRound: 0 });
    }
  }
  shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  update(data) {
    console.dir(data);
    this.seasonRef.update(data);
  }
  pick(game, seat, season) {
    if (season.members[season.nextPick] !== this.user.id) return;
    this.db.doc('users/' + season.members[season.nextPick])
      .snapshotChanges().subscribe(user => {
        const data = user.payload.data();
        let s = {};
        s[game.id] = seat;
        const seats = data;
        const result = seats['seats'].filter(aseat=>{ 
          return JSON.stringify(aseat) === JSON.stringify(s);
        });
        if ( result.length > 0 ) return;
        seats['seats'].push(s);
        user.payload.ref.update(seats);
        let nextpi = season.nextPick+1 ;
        let nextRound = season.currentRound;
        if (nextpi>=season.usersCount) {
          nextpi = 0;
          nextRound = nextRound+1;
        }
        this.update({
          nextPick: nextpi,
          currentRound: nextRound
        })
      })
  }
  changeUser(user) {
    this.user = user;
  }
  getNextPick(season, users) {
    const np = season.members[season.nextPick];
    return users.filter(user=>user.id===np)[0];
  }
  getLength(seats) { return Object.keys(seats); }
}
