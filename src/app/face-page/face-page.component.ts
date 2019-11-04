import { Component, OnInit } from '@angular/core';
import { FaceApiService } from '../core/face-api.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-face-page',
  templateUrl: './face-page.component.html',
  styleUrls: ['./face-page.component.css']
})
export class FacePageComponent implements OnInit {

  category: string;

  constructor(
    private faceApiService: FaceApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.faceApiService.loadModels().then(() => {
      this.faceApiService.onLoaded$.next();
    });

    this.route.paramMap.subscribe(params => {
      this.category = params.get('type');
    });
  }
}
