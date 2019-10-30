import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SetupService } from '../core/setup.service';
import { routePageAnimation } from '../animations';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css'],
  animations: [
    routePageAnimation
  ]
})
export class StartPageComponent {

  state = 1;

  constructor(
    private router: Router,
    private setupService: SetupService
  ) {}

  goToQuestions() {
    // to debug capturing this can be set in the config
    if (this.setupService.getDebugSettings()) {
      this.router.navigateByUrl('scan');
    } else {
      this.router.navigateByUrl('question');
    }
  }

  goState(number: number) {
    this.state = number;
  }
}