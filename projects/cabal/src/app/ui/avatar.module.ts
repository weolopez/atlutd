import { NgModule } from "@angular/core";
import { AvatarComponent } from "./avatar.component";
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';

  @NgModule({
    declarations: [AvatarComponent],
    exports: [AvatarComponent],
    imports: [CommonModule]
  })
  export class AvatarModule { }