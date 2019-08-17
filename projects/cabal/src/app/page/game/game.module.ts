import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GameComponent],
  imports: [
    CommonModule,
    FormsModule,
    GameRoutingModule,
    FlexLayoutModule,
    MatListModule,
    MatButtonModule
  ]
})
export class GameModule { }
