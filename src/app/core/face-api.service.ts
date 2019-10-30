import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FaceApiService {

  public onLoaded$ = new ReplaySubject<void>(1);

  async loadModels() {
    const MODEL_URL = 'assets/models';
    await faceapi.load
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);

    // await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    // // accordingly for the other models:
    // await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    // await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    // ...
    console.log('faceapi models loaded');
    return;
  }

  drawDetectionFrame(canvas: HTMLCanvasElement, fullFaceDescription): void {
    faceapi.draw.drawDetections(canvas, [fullFaceDescription])
  }

  drawDetectionLandmarks(canvas: HTMLCanvasElement, fullFaceDescription): void {
    faceapi.draw.drawFaceLandmarks(canvas, [fullFaceDescription])
  }

  async detectFace(sourceImageData: ImageData | HTMLImageElement, w: number, h: number): Promise<any> {
    const fullFaceDescriptions = await faceapi
      .detectAllFaces(faceapi.createCanvasFromMedia(sourceImageData, {
        width: w, height: h
      }))
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (fullFaceDescriptions.length === 0) {
      throw new Error('no face detected.');
    }
    return fullFaceDescriptions[0];
  }

  getDetectionLandmarks(fullFaceDescription) {
    return fullFaceDescription.landmarks.positions;
  }
}