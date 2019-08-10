import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { AuthProcessService } from 'ngx-auth-firebaseui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'atlutd';
  public loggedIn = false;
  public showProviders = false;

  constructor(
              public afAuth: AuthProcessService
    ) {
      afAuth.afa.user.subscribe(event => {
        this.loggedIn = (!event) ? false : true;
      });
  }
}
