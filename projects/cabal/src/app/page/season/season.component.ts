import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from '@firebase/util';
import { FireService } from '../../services/fire.service';
import { applySourceSpanToExpressionIfNeeded } from '@angular/compiler/src/output/output_ast';
import { tap } from 'rxjs/operators';


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
  public season = {
    draft: {
      rounds: [
          {
            round: 1,
          }
       ],
    },
    id: 'Cabal Open Cup',
      currentRound: 0,
      rounds: '9',
    games: '_games$',
    members: [
      '_users$MlAUWQ1MOKRm1qtrqgIPxQxu5En1',
      '_users$My2v5gVEXyglna16hFgt0wOSmGP2',
      '_users$5FlgZDjCiaPK1Fi5TCMEbk1R9I42',
      '_users$yLWEBMNYfleyhc4mG7aDPhSHSYe2',
      '_users$QKsxVXHjNePNTNOMYSQKO6KGCml2'
    ]
  };
  private itemDoc: AngularFirestoreDocument<Item>;
  public currentSeason;
  constructor(
    public db: AngularFirestore,
    fs: FireService
    ) {
    // this.seasons = fs.deepGetDoc('seasons', 'Cabal Open Cup');
    // this.db.collection('seasons').doc('Cabal Open Cup')
    // .valueChanges().pipe(tap(d => {
    //   this.season = d;
    // })).subscribe();
  }

  ngOnInit() {
  }
  startRound(season) {
    season.currentRound = Number(season.currentRound) + 1;
    const shuffledArray = this.shuffle(season.members);
    this.update({
      draft: {
        membersLeft: shuffledArray
      }
      });
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
    this.db.collection('seasons').doc('Cabal Open Cup')
        .update(data);
  }
}
