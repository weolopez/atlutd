import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Item { name: string; }
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Item>;
  public items: Observable<any[]>;
  constructor(db: AngularFirestore) {
    this.items = db.collection('users').valueChanges();
  }

  ngOnInit() {
  }

}
