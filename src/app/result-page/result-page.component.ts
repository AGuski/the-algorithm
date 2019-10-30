import { Component, OnInit } from '@angular/core';
import { of, Observable, timer, interval } from 'rxjs';
import { delay, tap, takeWhile, finalize, first, map } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { routePageAnimation } from '../animations';
import { SocketService } from '../core/socket.service';
import { Router } from '@angular/router';
import { AlgorithmService } from '../core/algorithm.service';

enum ResultType {
  CALCULATING,
  WINNER,
  LOSER
}

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.css'],
  animations: [
    routePageAnimation
    // trigger('hideAnalysis', [
    //   transition(':leave', [
    //     style({ opacity: 1, height: '*' }),
    //     animate('.3s ease-out', style({ height: 0 })),
    //     animate('.3s ease-out', style({ opacity: 0 }))
    //   ])
    // ]),
    // trigger('moveIcon', [])
  //   trigger('showHide', [
  //     transition(':enter', [
  //       style({opacity: 0}),
  //       animate('.3s ease-out', style({ opacity: 1 }))
  //     ])
  //   ]),
  //   trigger('showResult', [
  //     transition(':enter', [
  //       style({ opacity: 0, height: 0 }),
  //       animate('1s ease-out', style({ height: '*'})),
  //       animate('1s ease-out', style({ opacity: 1}))
  //     ])
  //     // ,
  //     // transition(':leave', [
  //     //   style({ opacity: 1 }),
  //     //   animate('.3s ease-out', style({ opacity: 0 }))
  //     // ])
  //  ])
  ]
})
export class ResultPageComponent implements OnInit {
 
  result = ResultType.CALCULATING;
  resultNumber = 0;

  resultNumber$: Observable<number>;

  state = 'ANALYSIS';

  restartCounter = 10;

  sendingData = false;

  resultColor = '#444';

  constructor(
    private socketService: SocketService,
    private router: Router,
    private algorithmService: AlgorithmService
  ) {}

  ngOnInit() {
    this.socketService.onMessage('FINISHED').subscribe(() => {
      this.state = 'FINISHED';
      interval(1000).pipe(
        tap(() => {
          this.restartCounter--;
        }),
        takeWhile(() => this.restartCounter >= 0),
        finalize(() => {
          this.router.navigateByUrl('start');
        })
      ).subscribe();
    });

    of(null).pipe(
      first(),
      delay(
        ((Math.random() * 3) + 5 ) * 1000
      ),
      tap(() => {
        this.state = 'RESULT';
      }),
      delay(2000),
      tap(() => {
        const result = this.algorithmService.currentSuccessProbability;
        this.resultNumber$ = timer(0, 50).pipe(
          takeWhile(number => number <= result),
          tap(number => {
            this.resultColor = this.getResultColor(number);
          }),
          finalize(() => {
            timer(1000).subscribe(() => {
              const msgType = this.algorithmService.currentSuccessProbability > 50 ? 'RESULT:winner' : 'RESULT:loser';
              this.socketService.emit({type: msgType});
              this.sendingData = true;
            })
          })
        );
      })
    ).subscribe();
  }

  private getResultColor(resultNumber: number): string {
    const red = [255, 0, 0];
    const green = [0, 255, 0];

    const newColor = [0,0,0];
    const components = ["r", "g", "b"];
    for (let i = 0; i < components.length; i++) {
      newColor[i] = Math.round(Math.sqrt((red[i]**2 + (green[i]**2 - red[i]**2) * resultNumber / 100)));
    }
    return `rgb(${newColor[0]},${newColor[1]},${newColor[2]})`;
  }
}