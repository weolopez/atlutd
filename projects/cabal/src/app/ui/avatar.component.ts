import { Component, ViewChild, Input } from '@angular/core'
import { __importDefault } from 'tslib';
@Component({
    selector: 'app-avatar',
    template: `
    <img [src]="img" [style.background]="(selected)?'red':'none'" >
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
  }