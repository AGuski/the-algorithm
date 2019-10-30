import { Component, OnInit } from '@angular/core';
import { SocketService } from './core/socket.service';
import { SetupService } from './core/setup.service';
import { Router } from '@angular/router';

import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { SetupPageComponent } from './setup-page/setup-page.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {

  sheetConfigOpen = false;

  constructor(
    private setupService: SetupService,
    private socketService: SocketService,
    private router: Router,
    private bottomSheet: MatBottomSheet
  ) {}
  
  ngOnInit() {

    if (this.setupService.getHostAddress()) {
      this.socketService.connectToHost(this.setupService.getHostAddress());
    }

    // fullscreen on keyboard F
    document.addEventListener('keypress', (event) => {
      if (event.code === 'KeyF') {
        // IDEA: have settings page that also remote controls all other instances
        document.body.requestFullscreen();
      }
    });

    // show config on keyboard C
    document.addEventListener('keypress', (event) => {
      if (event.code === 'KeyC') {
        // IDEA: have settings page that also remote controls all other instances
          this.toggleBottomSheet();
      }
    });

    this.socketService.onMessage('TOGGLE_CONFIG').subscribe(() => {
      this.toggleBottomSheet();
    });
  }

  toggleBottomSheet(): void {
    if (this.router.url === '/setup') return;
    if (!this.bottomSheet._openedBottomSheetRef) {
      this.bottomSheet.open(SetupPageComponent);
    } else {
      this.bottomSheet.dismiss();
    }
  }

  reset() {
    this.router.navigateByUrl('start');
  }
}
