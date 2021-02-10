import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChessComponent } from './chess.component';

const routes: Routes = [
  { path: '', component:  ChessComponent},
  { path: ':cards', component:  ChessComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChessRoutingModule { }
