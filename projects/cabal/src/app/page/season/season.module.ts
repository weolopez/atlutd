import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeasonRoutingModule } from './season-routing.module';
import { SeasonComponent } from './season.component';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [SeasonComponent],
  imports: [
    CommonModule,
    SeasonRoutingModule,
    MatListModule,
    MatButtonModule,
    FlexLayoutModule
  ]
})
export class SeasonModule { }
