import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FireService } from '../../services/fire.service';
import { tap, filter, map, mergeMap, merge, ignoreElements, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


export interface Round {
  round: number;
}

export interface Draft {
  rounds: Round[];
}

export interface Season {
  draft: Draft;
  id: string;
  currentRound: number;
  rounds: string;
  games: string;
  members: string[];
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
  games: any;
  users: Observable<unknown[]>;
  seasonRef: AngularFirestoreDocument<unknown>;
  seasonObs: Observable<unknown>;
  usersData: unknown[];
  constructor(
    public route: ActivatedRoute,
    public db: AngularFirestore,
    fs: FireService
  ) {
    this.currentSeason = this.route.snapshot.paramMap.get('id');
    this.seasonRef = db.collection('seasons').doc(this.currentSeason);
    this.seasonObs = this.seasonRef.valueChanges();
    this.games = db.collection('games', ref =>
      ref.where('season', '==', this.currentSeason)
    ).valueChanges();

    this.db.collection('users', ref =>
      ref.where('season', '==', this.currentSeason)
    ).valueChanges()
    .pipe(filter(user => user['season'] === this.currentSeason))
    .pipe(tap(user => this.iseason.members.push(user)))
    .pipe(finalize(()=> console.dir(this.iseason.members)))
    .subscribe();
    
  }

  ngOnInit() {
  }
  setNewSeason() {
    this.iseason.id = this.currentSeason;
    this.db.collection('seasons').doc(this.currentSeason).set(this.iseason);

    // this.db.collection('users', ref =>
    //   ref.where('season', '==', this.currentSeason)
    // ).valueChanges().pipe(tap(users => {
    //   users.filter(user => user['season'] === this.currentSeason)
    //     .forEach(user => this.iseason.members.push(user));
    // })).subscribe();
  }
  startRound(season) {
    season.currentRound = Number(season.currentRound) + 1;
    // const shuffledArray = this.shuffle(this.users);
    // this.update({
    //   currentRound: season.currentRound,
    //   draft: {
    //     membersLeft: shuffledArray
    //   }
    // });
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
    this.
      seasonRef.update(data);
  }
}
