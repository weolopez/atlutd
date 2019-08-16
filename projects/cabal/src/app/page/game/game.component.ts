import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface Item { name: string; }
@Component({
  selector: 'app-user',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Item>;
  public message: any;
  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore) {
      const chatId = this.route.snapshot.paramMap.get('id');
      this.db.collection('games').doc(chatId).snapshotChanges().subscribe( doc => {
        // tslint:disable-next-line:no-string-literal
        this.message = doc.payload.data()['content'];
      });
  }

  ngOnInit() {
  }

}
