import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmService {

  public currentSuccessProbability: number;

  calculateSuccessProbability(): number {
    const n = this.getResultPercentage(
      18, // min loser
      43, // max loser
      63, // min winner
      95 // max winner
    );
    console.log('PROP: ', n);
    this.currentSuccessProbability = n;
    return n;
  }

  private getResultPercentage(minLoser, maxLoser, minWinner, maxWinner): number {

    if (Math.random() > 0.5) {
      return Math.round((minWinner + (maxWinner - minWinner) * Math.random()) * 100) / 100;
    } else {
      return Math.round((minLoser + (maxLoser - minLoser) * Math.random()) * 100) / 100;
    }
  }

}