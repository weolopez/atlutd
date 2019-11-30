import { Component, ViewChild, Input } from '@angular/core'
import { __importDefault } from 'tslib';
@Component({
    selector: 'app-avatar',
    template: `
    <img [src]="img" [style.background]="(selected)?'#80000a': (selected2)?'#a19060':'none'" >
    `,
    styles: [`
    img {
        background: red;
        padding: 10px;
        margin: 10px;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        object-fit: cover;
    }
    `]
  })
  export class AvatarComponent {
      @Input('img') img;
      @Input('selected') selected;
      @Input('selected2') selected2;
  }