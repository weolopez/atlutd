import { Component, ViewChild, Input } from '@angular/core'
@Component({
  selector: 'app-webcam',
  template: `
  <div *ngIf="showWebcam" fxLayout="column" fxLayoutAlign="center center">
  <webcam [height]="200" [width]="200" [trigger]="triggerObservable" (imageCapture)="handleImage($event)"
    [allowCameraSwitch]="allowCameraSwitch" [switchCamera]="nextWebcamObservable" [videoOptions]="videoOptions"
    [imageQuality]="1" (cameraSwitched)="cameraWasSwitched($event)" (initError)="handleInitError($event)"></webcam>
  <br />
  <button matButton id="snap"  (click)="triggerSnapshot();">Take A Snapshot</button>
</div>

<img [height]="200" [width]="200" *ngIf="!showWebcam" (click)="showWebcam=!showWebcam" matListAvatar
  [src]="(webcamImage) ? webcamImage : currentUser.photoURL" alt="...">

  <button matButton *ngIf="webcamImage" id="snap"  (click)="updateProfileImage(currentUser);">Update Profile Image</button>

            `,
  styles: [`
  
    `]
})
export class WebCamComponent {
}