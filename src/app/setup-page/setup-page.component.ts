import { Component, OnInit, Inject } from '@angular/core';
import { SetupService } from './../core/setup.service';
import { SocketService } from '../core/socket.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-setup-page',
  template: `

    <h2>Configuration</h2>
  
    <div class="field">
      <label for="host-address">Host IP Address:</label>
      <input type="text" id="host-address" [(ngModel)]="hostAddress">
      <button (click)="connectWS()">Connect</button>
    </div>

    <div class="field">
      <button (click)="testConnection()">Test Connection</button>
      <span *ngIf="connectionTest === 'SUCCESS'" style="color: #66bb6a;">Last test successful!</span>
      <span *ngIf="connectionTest === 'FAILED'" style="color: #ef5350;">Last test failed!</span>
    </div>

    <div class="field">
      <button (click)="toggleFullscreen()">Toggle Fullscreen</button>
    </div>

    <div class="field">
     <label for="skip-questions">Skip Questions</label>
      <input type="checkbox" id="skip-questions" [ngModel]="skipQuestions" (ngModelChange)="setSkipQuestions($event)">
    </div>

    <h2>All Clients</h2>

    <div class="field">
      <button (click)="toggleRemoteConfigs()">Toggle remote configs</button>
    </div>

    <div style="height: 50px;"></div>

    <!-- nothing yet :( -->

    
  `,
  styles: [`
    .field {
      display: flex;
      flex-direction: column;
      margin: 20px 0 0 20px;
    }

    .field input {
      width: 250px;
      font-size: 25;
    }

    .field button {
      margin: 0;
      font-size: 20px;
      border-radius: 0;
      width: fit-content;
      padding: 10px;
      min-width: 0;
    }

    h2 {
      font-weight: 600;
      text-transform: uppercase;
      margin: 40px 0 0 20px;
    }
  `]
})
export class SetupPageComponent implements OnInit {

  hostAddress: string;
  connectionTest: string;
  skipQuestions: boolean;

  constructor(
    private setupService: SetupService,
    private socketService: SocketService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this.hostAddress = this.setupService.getHostAddress();
    this.socketService.onMessage('TEST').subscribe(() => {
      this.connectionTest = 'SUCCESS';
    });
    this.skipQuestions = this.setupService.getDebugSettings();
  }

  connectWS() {
    this.setupService.setHostAddress(this.hostAddress);
    this.socketService.connectToHost(this.hostAddress);
  }

  testConnection() {

    if (this.socketService.socket.disconnected) {
      this.connectionTest = 'FAILED';
      return;
    }

    try {
      this.socketService.emit({type: 'TEST'});
    } catch(e) {
      this.connectionTest = 'FAILED';
    }
  }

  setSkipQuestions(value) {
    this.setupService.setDebugSettings(value);
  }

  toggleFullscreen() {
    if(this.document.fullscreen) {
      this.document.exitFullscreen();
    }
    this.document.body.requestFullscreen();
  }

  toggleRemoteConfigs() {
    this.socketService.emit({
      type: 'TOGGLE_CONFIG'
    });
  }


}