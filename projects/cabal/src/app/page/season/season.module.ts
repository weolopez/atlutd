import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeasonRoutingModule } from './season-routing.module';
import { SeasonComponent } from './season.component';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatSnackBarModule } from '@angular/material';
import { AvatarComponent } from '../../ui/avatar.component';
import { ServiceModule } from '../../services/service.module';

@NgModule({
  declarations: [SeasonComponent, AvatarComponent],
  imports: [
    CommonModule,
    SeasonRoutingModule,
    MatListModule,
    MatButtonModule,
    FlexLayoutModule,
    MatSnackBarModule,
    ServiceModule
  ]
})
export class SeasonModule { }
