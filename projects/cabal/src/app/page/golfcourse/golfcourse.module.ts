import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './golfcourse-routing.module';
import { GolfCourseComponent } from './golfcourse.component';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import {WebcamModule} from 'ngx-webcam';
import { MatButtonModule } from '@angular/material/button';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    GolfCourseComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    UserRoutingModule,
    AngularFireStorageModule,
    MatListModule,
    MatButtonModule,
    FlexLayoutModule,
    WebcamModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC9FMeiidIyqt-2t3mMHzP5dsQWW6OPWWY',
      libraries: ['places', 'drawing', 'geometry']
    })
    
  ]
})
export class GolfCourseModule { }
