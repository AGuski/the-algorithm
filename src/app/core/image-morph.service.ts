import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageMorphService {

  createWarpPoints(points: {x: number, y: number}[]): any[] {
    return points.map(point => new ImgWarper.Point(point.x, point.y));
  }

  
}