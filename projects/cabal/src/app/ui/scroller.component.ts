import { Component, ViewChild, Input } from '@angular/core'
@Component({
  selector: 'app-scroller',
  template: `
    <section class="vslide">
    
        <h1>Section One</h1>
    </section>
    <section class="vslide">
        <h1>Section Two</h1>
    </section>
    <section class="vslide">
        <h1>Section Three</h1>
    </section>
    <section class="vslide">
        <h1>Section Four</h1>
    </section>
    <section class="vslide">
        <h1>Section Five</h1>
    </section>
            `,
  styles: [`
  * {
    box-sizing: border-box;
  }
  html {
    font-family: sans-serif;
    scroll-snap-type: mandatory;
    scroll-snap-points-y: repeat(100vh);
    scroll-snap-type: y mandatory;
  }
  .vslide {
    border-bottom: 1px solid white;
    padding: 1rem;
    height: 100vh;
    scroll-snap-align: start;
    text-align: center;
    position: relative;
  }
  h1  {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    color: white;
    width: 100%;
    left: 0;
    font-size: calc(1rem + 3vw);
  }
    `]
})
export class ScrollerComponent {
}