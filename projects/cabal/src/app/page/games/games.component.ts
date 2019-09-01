import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from '@firebase/util';
import { FireService } from '../../services/fire.service';
import { AuthService } from '../../services/auth.service';

export interface Item { name: string; }
@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Item>;
  public items: Observable<any[]>;

  public seatPick: any;
  public Obj = Object;
  public id;
  public user;

  constructor(
    private db: AngularFirestore,
    private auth: AuthService,
    fs: FireService
    ) {
    this.items = fs.deepGetCollection('games');
    this.getUser();
  }

  ngOnInit() {
  }

  select(seat) {
    const game = {};
    game[`seats.${seat}.owner`] = '_users$' + this.user.uid;
    this.db.collection('games').doc(this.id)
      .update(game);
  }
  async getUser() {
    this.user = await this.auth.getUser();
  }

}
