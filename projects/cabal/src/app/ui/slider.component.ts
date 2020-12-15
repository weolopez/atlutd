import { Component, ViewChild, Input } from '@angular/core'
@Component({
  selector: 'app-slider',
  template: `
  <div class="container" id="snap-scroll-container">
  <div class="child">
      <div class="label"><h1>1</h1></div>
  </div>
  <div class="child">
      <div class="label"><h1>2</h1></div>
  </div>
  <div class="child">
      <div class="label"><h1>3</h1></div>
  </div>
  <div class="child">
      <div class="label"><h1>4</h1></div>
  </div>
</div>
            `,
  styles: [`
 
.container {
  width: 402px;
  height: 410px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  margin: 10vh auto 0 auto;
}

#snap-scroll-container {
  -webkit-scroll-snap-type: mandatory;
  scroll-snap-type: x mandatory;
  -webkit-scroll-snap-points-x: repeat(100%);
  scroll-snap-points-x: repeat(100%);
}

#snap-scroll-container > .child {
  scroll-snap-align: start;
}

#snap-scroll-container-coordinates {
  -webkit-scroll-snap-type: mandatory;
  scroll-snap-type: x mandatory;
}

#snap-scroll-container-coordinates > .child {
  -webkit-scroll-snap-coordinate: 0% 0%;
  scroll-snap-coordinate: 0% 0%;
  scroll-snap-align: start;
}

.child {
  width: 400px;
  height: 400px;
  position: relative;
  background-color: #F0F0F0;
  display: inline-block;
  margin-right: -4px;
  border: 1px solid black;
  -webkit-scroll-snap-coordinate: 0% 0%;
}
.label {
  width: 200px;
  height: 200px;
  border-radius: 25%;
  background-color: white;
  margin: 100px auto 0 auto;
}
    `]
})
export class SliderComponent {
}