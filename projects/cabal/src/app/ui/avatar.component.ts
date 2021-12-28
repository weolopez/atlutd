import { Component, ViewChild, Input, NgModule } from '@angular/core'
@Component({
    selector: 'app-avatar',
    template: `
    <div class="pie-wrapper"
         [style.background]="(selected)?'#80000a': (selected2)?'#a19060':''">
        <img *ngIf="img else noImage"
            class="pie"
            [src]="img"> 
        <ng-template #noImage>
                <div class="pie">{{letter}}</div>
        </ng-template>
    </div>
            `,
    styles: [`
    .pie {
        transform: translate(5px, 5px); 
        background: silver;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        object-fit: cover;
        color: blue;
        font-size: 44px;
        font-family: sans-serif;
        text-align: center;
      }

    .pie-wrapper {
        display: block;
        width: 65px;
        height: 65px;
        border-radius: 50%;
        object-fit: cover;
      }
    `]
  })
  export class AvatarComponent {
      @Input('img') img;
      @Input('letter') letter;
      @Input('selected') selected;
      @Input('selected2') selected2;
      noImage;
  }
  