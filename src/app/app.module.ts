import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { AppComponent } from './app.component';
import { QuestionPageComponent } from './question-page/question-page.component';
import { ScanPageComponent } from './scan-page/scan-page.component';
import { FacePageComponent } from './face-page/face-page.component';
import { StartPageComponent } from './start-page/start-page.component';
import { SetupPageComponent } from './setup-page/setup-page.component';
import { ResultPageComponent } from './result-page/result-page.component';

import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FaceComponent } from './face-page/face/face.component';




const appRoutes: Routes = [
  { path: 'start', component: StartPageComponent },
  { path: 'question', component: QuestionPageComponent },
  { path: 'scan', component: ScanPageComponent },
  { path: 'result', component: ResultPageComponent },
  { path: 'face', component: FacePageComponent },
  { path: 'setup', component: SetupPageComponent },

  { path: '',
    redirectTo: '/start',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatBottomSheetModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      "backgroundOpacity": 1,
      "backgroundStrokeWidth": 0,
      "backgroundPadding": 7,
      "radius": 200,
      "space": -20,
      "maxPercent": 100,
      "outerStrokeWidth": 20,
      "outerStrokeColor": "#ececec",
      "outerStrokeLinecap": "square",
      "innerStrokeColor": "#444",
      "innerStrokeWidth": 20,
      "startFromZero": false,
      "titleColor": '#ececec',
      "unitsColor": '#ececec',
      "titleFontSize": '64px',
      "titleFontWeight": '300',
      "unitsFontSize": '64px',
      "unitsFontWeight": '300',
      "animation": true,
      "animateTitle": true,
      "animationDuration": 700,
      "showSubtitle": false,
      "showBackground": false,
      "clockwise": false

    }),
    RouterModule.forRoot(appRoutes) 
  ],
  declarations: [ 
    AppComponent,
    StartPageComponent,
    QuestionPageComponent,
    ScanPageComponent,
    ResultPageComponent,
    FacePageComponent,
    SetupPageComponent,
    FaceComponent
  ],
  entryComponents: [
    SetupPageComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
