import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import {WebcamModule} from 'ngx-webcam';
import { MatButtonModule } from '@angular/material';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AvatarComponent } from '../../ui/avatar.component';
@NgModule({
  declarations: [UserComponent, AvatarComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    AngularFireStorageModule,
    MatListModule,
    MatButtonModule,
    FlexLayoutModule,
    WebcamModule
  ]
})
export class UserModule { }
