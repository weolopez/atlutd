import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { AuthService } from '../../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';

export interface Item { name: string; }
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent {
  hand=[
    {num:'A',suit:'S'},
    {num:'K',suit:'H'},
    {num:'Q',suit:'D'},
    {num:'J',suit:'C'},
    {num:'10',suit:'S'}
  ]
  
  getUrl(card) {
    return `/assets/imgs/cards/${card.num}${card.suit}.svg`
  }
  getCardWidth(bh, bw, count) {
    return (bh-(count*20))+'px';
  }
}
