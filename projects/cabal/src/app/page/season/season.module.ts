import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeasonRoutingModule } from './season-routing.module';
import { SeasonComponent } from './season.component';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatSnackBarModule } from '@angular/material';
import { FirePipe } from '../../services/fire.pipe';
import { AvatarComponent } from '../../ui/avatar.component';

@NgModule({
  declarations: [SeasonComponent, FirePipe, AvatarComponent],
  imports: [
    CommonModule,
    SeasonRoutingModule,
    MatListModule,
    MatButtonModule,
    FlexLayoutModule,
    MatSnackBarModule
  ]
})
export class SeasonModule { }
