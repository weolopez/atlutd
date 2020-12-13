import { Component, ViewChild, Input } from '@angular/core'
@Component({
  selector: 'app-slider',
  template: `
    <div class="slider">
  <section class="hslide">
    <h1>Section One</h1>
  </section>
  <section class="hslide">
    <h1>Section Two</h1>
  </section>
  <section class="hslide">
    <h1>Section Three</h1>
  </section>
  <section class="hslide">
    <h1>Section Four</h1>
  </section>
  <section class="hslide">
    <h1>Section Five</h1>
  </section>

</div>
            `,
  styles: [`
html { 
  font-family: sans-serif;
  scroll-snap-type: mandatory;
  scroll-snap-points-y: repeat(100vh);
  scroll-snap-type: y mandatory;
}

/* Although I'm told that html doesn't work in Safari 
   and body does, so maybe use both? */
.slider {
  font-family: sans-serif;
  scroll-snap-type: x mandatory;  
  display: flex;
  -webkit-overflow-scrolling: touch;
  overflow-x: scroll;
}
.hslide {
  border-right: 1px solid white;
  padding: 1rem;
  min-width: 100vw;
  height: 100vh;
  scroll-snap-align: start;
  text-align: center;
  position: relative;
}
.vslide {border-bottom: 1px solid white;
  padding: 1rem;
  height: 100vh;
  scroll-snap-align: start;
  text-align: center;
  position: relative;
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
}
    `]
})
export class SliderComponent {
}