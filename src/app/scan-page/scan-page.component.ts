import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { SocketService } from '../core/socket.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first, tap, delay } from 'rxjs/operators';
import { AlgorithmService } from '../core/algorithm.service';


@Component({
  selector: 'app-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.css'],
  animations: [
    trigger('flashAnimation', [
       transition(':enter', [
        style({ opacity: 1 }),
        animate('.5s ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('showHide', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('.3s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('.3s ease-out', style({ opacity: 0 }))
      ])
   ])
  ]
})
export class ScanPageComponent implements OnInit {

  @ViewChild('video', {static: true}) video: ElementRef<HTMLVideoElement>;
  @ViewChild('capturedCanvas', {static: true}) capturedCanvas: ElementRef<HTMLCanvasElement>;

  videoWidth = 720;
  videoHeight = 1080;

  capturedImageData: ImageData;

  isAnalyzing = false;
  showAnalyticsInfo = false;
  faceRecognitionFailed = false;
  analyzeProgress = 0;
  analyzeMessage: string;
  streamReady = false;

  constructor(
    private socketService: SocketService,
    private router: Router,
    private algorithmService: AlgorithmService
  ) {}

  ngOnInit() {
    const constraints = {
      video: {width: {exact: 1920}, height: {exact: 1080}}
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        this.video.nativeElement.srcObject = stream;
        this.streamReady = true;
      });
  }

  captureImage() {
    console.log('capturing...');
    const canvasEl = this.capturedCanvas.nativeElement;
    const context = canvasEl.getContext('2d');
    context.save();

    context.scale(-1, 1);
    
    context.drawImage(
      this.video.nativeElement,
      180, // (1080 -720)/2 <-- to remove the sides
      400, // same as in css
      720,
      1080,
      0,0,
      720*-1, 1080
    );
    
    this.capturedImageData = context.getImageData(0, 0, this.videoWidth, this.videoHeight);
    context.restore();
  }

  confirm() {
    this.showAnalyticsInfo = true;
    this.isAnalyzing = true;

    this.algorithmService.calculateSuccessProbability();
    const msgType = this.algorithmService.currentSuccessProbability > 50 ? 'IMAGE:winner' : 'IMAGE:loser';

    this.socketService.emit({
      type: msgType,
      data: this.capturedCanvas.nativeElement.toDataURL(),
      width: this.capturedImageData.width,
      height: this.capturedImageData.height
    });

    this.runFakeAnalyticProgress();
  }

  faceRecognition$ = new Subject();

  private runFakeAnalyticProgress() {
    this.analyzeMessage = 'analyzing facial features...';

    // when face recognition was sucessful
    this.socketService.onMessage('IMAGE_SUCCESS').pipe(
      first(),
      delay(1300),
      tap(() => {
        this.analyzeProgress = 24;
      this.analyzeMessage = 'measuring eye-to-LSP ratio ...';
      }),
      delay(1600),
      tap(() => {
        this.analyzeProgress = 42;
        this.analyzeMessage = 'applying heuristic probability matrix...';
      }),
      delay(2300),
      tap(() => {
        this.analyzeProgress = 76;
        this.analyzeMessage = 'calculating cranial capacity potential ...';
      }),
      delay(1500),
      tap(() => {
        this.analyzeMessage = 'analysis complete';
        this.analyzeProgress = 100;
      }),
      delay(1000),
      tap(() => {
        this.isAnalyzing = false;
        this.showAnalyticsInfo = false;
        this.router.navigateByUrl('result');
      })
    ).subscribe();

    // when face recognition was rejected
    this.socketService.onMessage('IMAGE_REJECT').subscribe(() => {
      console.log('REJECTed!');
      this.isAnalyzing = false;
      this.faceRecognitionFailed = true;
    });
  }

  reset() {
    this.showAnalyticsInfo = false;
    this.isAnalyzing = false;
    this.faceRecognitionFailed = false;

    // TODO: need to adjust dimensions for fullscreen mode 

    const canvasEl = this.capturedCanvas.nativeElement;
    const context = canvasEl.getContext('2d');
    context.clearRect(
      0,
      0,
      this.videoWidth,
      this.videoHeight
    );
    this.capturedImageData = undefined;
  }

  resetApp() {
    this.router.navigateByUrl('start');
  }
}