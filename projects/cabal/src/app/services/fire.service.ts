import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Injectable({
  providedIn: 'root'
})
export class FireService {
  Id;
  collection;
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) {}

  get(collection?, Id?) {
    this.Id = (Id) ? Id : this.Id;
    this.collection = (collection) ? collection : this.collection;
    return this.afs
      .collection<any>(this.collection)
      .stateChanges()
      .pipe(
        map(c =>
           c.map( doc => {
            return {
               id: doc.payload.doc.id,
               payload: doc.payload.doc.data().content
            };
          })
        )
      );
  }

  update(uid, data) {
    this.afs.collection(this.collection).doc(uid)
      .update(this.updateData(data));
      // .finally( () => this.items = this.get() );
  }
  add(data) {
    this.afs.collection(this.collection)
    .add(this.updateData(data));
  }
  updateData(value) {
    return {
      content: JSON.parse(value),
      createdAt: Date.now()
    };
  }
}
