import { Component } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

import { AuthProcessService } from 'ngx-auth-firebaseui';
import { auth } from 'firebase/app';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Item { name: string; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'atlutd';
  private itemDoc: AngularFirestoreDocument<Item>;
  items: Observable<any[]>;
  public loggedIn = false;
  public showProviders = false;

  constructor(db: AngularFirestore,
              public afAuth: AuthProcessService
    ) {
      afAuth.afa.user.subscribe(event => {
        this.loggedIn = (!event) ? false : true;
      });
      this.items = db.collection('users').valueChanges();
  }
}
