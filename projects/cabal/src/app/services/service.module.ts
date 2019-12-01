import { NgModule } from '@angular/core';
import { FirePipe } from './fire.pipe';

@NgModule({
  declarations: [FirePipe],
  providers: [FirePipe],
  exports: [ FirePipe
  ]
})
export class ServiceModule { }
