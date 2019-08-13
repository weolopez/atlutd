import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

export interface Team {
  id: string;
  name: string;
  image: string;
}
export interface Item { name: string; }
@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Item>;
  public items: Observable<any[]>;
  public collection;
  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore) {
  }

  ngOnInit() {
    this.collection = this.route.snapshot.paramMap.get('collection');
    this.items = this.get();
  }
  update(uid, data) {
    this.db.collection(this.collection).doc(uid)
      .update(this.updateData(data)).finally( () =>
        this.items = this.get()
      );
  }
  add(data) {
    this.db.collection(this.collection)
    .add(this.updateData(data));
  }
  updateData(value) {
    return {
      content: JSON.parse(value),
      createdAt: Date.now()
    };
  }
  get() {
    return this.db
      .collection<any>(this.collection)
      .stateChanges()
      .pipe(
        map(collection =>
           collection.map( doc => {
            return {
               id: doc.payload.doc.id,
               payload: doc.payload.doc.data().content
            };
          })
        )
      );
  }
  delete(id) {
    return this.db
    .collection<any>(this.collection).doc(id).delete();
  }
}
