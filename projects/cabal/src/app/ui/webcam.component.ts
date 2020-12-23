import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core'
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-webcam',
  template: `
  <webcam *ngIf="showWebcam && !webcamImage" (click)="triggerSnapshot()"
  style="width: 100%"
  [trigger]="triggerObservable" (imageCapture)="handleImage($event)"
    [allowCameraSwitch]="allowCameraSwitch" [videoOptions]="videoOptions"
    [imageQuality]="1" (cameraSwitched)="cameraWasSwitched($event)" (initError)="handleInitError($event)"></webcam>
  <img *ngIf="!showWebcam || webcamImage" (click)="showWebcam=!showWebcam" matListAvatar
        [src]="(webcamImage) ? webcamImage : urlImage" alt="...">

  <button style="width: 100%" *ngIf="webcamImage" (click)="updateProfileImage();">Update Profile Image</button>
            `,
  styles: [`
  ::ng-deep .webcam-wrapper > video {
      width: 100% !important;
      height: 100%;
  }
  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
  #camera {
    border: black 1px groove;
  }
  #snapshot {
    height: 100%;
    width: 100%;
  }
  .photo {
    border-radius: 50%;
    height: 75px;
    width: 75px;
  }
    
    `]
})
export class WebCamComponent {
  public deviceId: string;
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;

  public errors: WebcamInitError[] = [];
  // latest snapshot
  public webcamImage;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();


  @Output() urlChange = new EventEmitter<string>();
  @Input() urlImage: string;


  constructor() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }


  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };

    public triggerSnapshot(): void {
      this.trigger.next();
    }
  
    public handleInitError(error: WebcamInitError): void {
      this.errors.push(error);
    }
  
    public handleImage(webcamImage: WebcamImage): void {
      this.webcamImage = webcamImage.imageAsDataUrl;
    }
  
    public cameraWasSwitched(deviceId: string): void {
      console.log('active device: ' + deviceId);
      this.deviceId = deviceId;
    }
  
    public get triggerObservable(): Observable<void> {
      return this.trigger.asObservable();
    }

  updateProfileImage() {
    this.urlChange.emit(this.webcamImage);
    this.showWebcam = !this.showWebcam;
    this.webcamImage = false
  }
}