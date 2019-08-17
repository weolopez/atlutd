import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from '@firebase/util';
import { FireService } from '../../services/fire.service';

export interface Item { name: string; }
@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Item>;
  public items: Observable<any[]>;
  constructor(
    db: AngularFirestore,
    fs: FireService
    ) {
    this.items = fs.deepGetCollection('games');
  }

  ngOnInit() {
  }

}
