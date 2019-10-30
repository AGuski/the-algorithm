import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SetupService {

  getHostAddress(): string {
    return window.localStorage.getItem('HOST_ADDRESS') || null;
  }

  setHostAddress(value: string): void {
    window.localStorage.setItem('HOST_ADDRESS', value);
  }

  getDebugSettings() {
    return window.localStorage.getItem('DEBUG_SCAN') === 'TRUE' ? true: false;
  }

  setDebugSettings(value: boolean) {

    window.localStorage.setItem('DEBUG_SCAN', value ? 'TRUE': 'FALSE');
  }
}