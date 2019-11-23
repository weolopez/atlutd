import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, pipe, forkJoin, of, timer, interval } from 'rxjs';
import { FireService } from '../../services/fire.service';
import { tap, filter, map, mergeMap, ignoreElements, finalize, combineLatest, take, merge } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { AuthService } from '../../services/auth.service';

import {MatSnackBar} from '@angular/material/snack-bar';

export interface Season {
  id: string;
  currentRound?: number;
  rounds?: number;
  games?: any[];
  members?: any[];
  seats?: any[];
}
export interface Seat{
  id: string;
}
export interface Game{
  id: string;
  seats?: any;
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
  seatCount = 0;
  constructor(
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public db: AngularFirestore,
    fs: FireService,
    public auth: AuthService,
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
      this.seatCount = seats.length;
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
            games.map((game: Game) => {
              game.seats = {};
              seats.forEach((seat: Seat) => {
                game.seats[seat.id] = (usersObject[game.id] && usersObject[game.id][seat.id]) ?
                  usersObject[game.id][seat.id] : seat.id;
              });
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
// counts of appearances for all possible permutations
let count = {
  '123': 0,
  '132': 0,
  '213': 0,
  '231': 0,
  '321': 0,
  '312': 0
};

for (let i = 0; i < 1000000; i++) {
  let array = [1, 2, 3];
  count[this.shuffle(array).join('')]++;
}

// show counts of all possible permutations
for (let key in count) {
  console.log(`${key}: ${count[key]}`);
}
  }
  setNewSeason(users: Array<any>) {

    this.db.collection('seasons').doc(this.currentSeason).set({ id: this.currentSeason, currentRound: 1, members: [] });
    this.games.subscribe(games => this.update({ gamesCount: games['length'] }));
    this.update({ usersCount: users.length, members: users.map(u=>u.id), nextPick: 0 });
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
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  update(data) {
    this.seasonRef.update(data);
  }
  pick(game, seat, season) {
    if (season.members[season.nextPick] !== this.user.id) {
      this.snackBar.open(`It is ${season.members[season.nextPick]} turn`, 'Close', {
        duration: 3000
      });
      return;
    }
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

  addUser(user) {
    this.db.doc('users/'+user.id).update({season: this.currentSeason});
  }
  removeUser(user) {
    this.db.doc('users/'+user.id).update({season: ''});
  }
  getNextPick(season, users) {
    const np = season.members[season.nextPick];
    return users.filter(user=>user.id===np)[0];
  }
  getLength(seats) { return Object.keys(seats); }
}
