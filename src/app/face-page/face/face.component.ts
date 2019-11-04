import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { SocketService } from 'src/app/core/socket.service';
import { FaceApiService } from 'src/app/core/face-api.service';
import { ImageMorphService } from 'src/app/core/image-morph.service';
import { mergeMap, withLatestFrom, tap, delay, map, concatMap, last, first } from 'rxjs/operators';
import { of, Observable, Subject, throwError, from } from 'rxjs';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.css']
})
export class FaceComponent {

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('hiddenCanvas', {static: true}) hiddenCanvas: ElementRef<HTMLCanvasElement>;

  private canvasContext;

  imageWidth = 720;
  imageHeight = 1080;

  currentPointDefiner;
  currentImageData: ImageData;

  newData = false;

  @Input() category: string;


  constructor(
    private socketService: SocketService,
    private faceApiService: FaceApiService,
    private imageMorphService: ImageMorphService
  ) {}

  ngOnInit() {
    this.canvasContext = this.canvas.nativeElement.getContext('2d');

    this.faceApiService.onLoaded$.pipe(first()).subscribe(() => {
      this.loadPersistedImage();
    });

    // subscribe to scanned data and UI result
      
    const imageDataMessage = this.socketService.onMessage(`IMAGE:${this.category}`).pipe(
      // processingImage
      mergeMap(data => this.convertImageUrlToImage(data.data)),
      mergeMap(imageElement => this.processImage(imageElement))
    );

    this.socketService.onMessage(`RESULT:${this.category}`)
    .pipe(
      withLatestFrom(imageDataMessage),
      tap(() => this.newData = true),
      delay(3000),
      map(([result, pointDefiner]) => pointDefiner),
      mergeMap((pointDefiner) => {
        this.newData = false;
        if (pointDefiner) {
          return this.merge(pointDefiner);
        }
        else {
          this.canvasContext.putImageData(this.currentImageData, 0, 0);
          return of(null);
        };
      })
    ).subscribe(() => {
      console.log('updating and persisting image...');
      this.updateCurrentPointDefiner();
      this.persistCurrentImage();
      this.finish();
    });
  }

  private processImage(HTMLImage: HTMLImageElement): Observable<any> {
    console.log('start processing');
    const done$ = new Subject<any>();
    
    const hiddenContext = this.hiddenCanvas.nativeElement.getContext('2d');
    hiddenContext.drawImage(HTMLImage, 0, 0);
    this.currentImageData = hiddenContext.getImageData(0,0,this.imageWidth,this.imageHeight);

    this.faceApiService.detectFace(HTMLImage, this.imageWidth, this.imageHeight).then(description => {
      const pointDefiner = {
        imgData: this.currentImageData,
        oriPoints: this.imageMorphService.createWarpPoints(
          this.faceApiService.getDetectionLandmarks(description)
        )
      };
      this.socketService.emit({type: 'IMAGE_SUCCESS'});
  
      //if it is first image
      if (!this.currentPointDefiner) {
        console.log('first image');
        this.currentPointDefiner = pointDefiner;
        done$.next();
      } else {
        console.log('concurrent image');
        done$.next(pointDefiner); 
      }
    }, reject => {
      this.socketService.emit({type: 'IMAGE_REJECT'});
      throwError(reject);
    });
    
    return done$;
  }

  private convertImageUrlToImage(url: string): Observable<HTMLImageElement> {
    console.log('Converting base64 string to image...');
    const image$ = new Subject<HTMLImageElement>();
    const image = new Image();
    image.onload = () => {
      image$.next(image);
    }
    image.src = url;
    return image$;
  }

  private loadPersistedImage() {
    const persistedImage = window.localStorage.getItem(`MERGED_FACES:${this.category}`);
    if (persistedImage) {
      console.log('loading image from local storage...');
      const image = new Image();
      image.onload = () => {
        this.canvasContext.drawImage(image, 0, 0);
        this.updateCurrentPointDefiner();
      }
      image.src = persistedImage;
    }
  }

  private persistCurrentImage() {
    window.localStorage.setItem(`MERGED_FACES:${this.category}`, this.canvas.nativeElement.toDataURL());
  }

  private updateCurrentPointDefiner() {
    const imgData = this.canvasContext.getImageData(0,0, this.imageWidth, this.imageHeight);
    this.faceApiService.detectFace(imgData, this.imageWidth, this.imageHeight).then(description => {
      this.currentPointDefiner = {
        imgData: imgData,
        oriPoints: this.imageMorphService.createWarpPoints(
          this.faceApiService.getDetectionLandmarks(description)
        )
      };
    });
  }

  private merge(newPointDefiner): Observable<any> {
    console.log('merging images...');
    const totalImages = 40;
    const usedImage = 12;
    const animator = new ImgWarper.Animator(
      this.currentPointDefiner,
      newPointDefiner
    );

    animator.generate(totalImages);
    return from(animator.frames.slice(0, usedImage)).pipe(
      concatMap(frame => of(frame).pipe(delay(80))),
      tap((frame: ImageData) => {
        this.currentImageData = frame;
        this.canvasContext.putImageData(frame, 0, 0);
      }),
      last()
    );
  }

  private finish() {
    this.socketService.emit({ type: 'FINISHED' });
  }

  // filter() {
  //   console.log('FILTER');
  //   const imgData = this.canvasContext.getImageData(0,0, this.imageWidth, this.imageHeight);

  //   const filtered = this.imageFilterService.filterImageData(this.imageFilterService.convoluteFilter, imgData, [  0, -1,  0,
  //     -1,  5, -1,
  //      0, -1,  0 ]);

  //     // const filtered = this.imageFilterService.grayScale(imgData);
  //      this.canvasContext.putImageData(filtered, 0,0);
  // }
}