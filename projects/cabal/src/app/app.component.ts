import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { AuthProcessService } from 'ngx-auth-firebaseui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Cabal20';
  public loggedIn = false;
  public showProviders = false;
  constructor(
    public cs: ChatService,
    public afAuth: AuthProcessService,
    public auth: AuthService
  ) {
    auth.getUser().then(event => {
      this.loggedIn = (!event) ? false : true;
      if (event) { auth.updateUserData(event); }
    });
  }
  
}
