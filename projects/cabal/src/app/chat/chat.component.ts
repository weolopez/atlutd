import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { MatList } from '@angular/material/list';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chat$: Observable<any>;
  newMsg: string;
  scrollList;
  // @ViewChild('scrollList', {static: false}) scrollList; // : CdkScrollable;
  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {
    this.scrollList = document.getElementById('scrollList');
  }

  ngOnInit() {
    // this.scrollList = this.scrollList.nativeElement;
    const chatId = this.route.snapshot.paramMap.get('id');
    this.chat$ =  this.cs.get(chatId)
         .pipe(tap(v => {
           if (!v.id) {
             this.cs.create(chatId).then(result => location.reload());
            //  ;
           }
           this.scroll();
         }));
  }

  submit(newMsg) {
    this.cs.sendMessage(newMsg);
    this.scroll();
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }
  scroll() {
    const objDiv = document.getElementById('scrollList');
    objDiv.scrollTop = objDiv.scrollHeight;
  }
}
