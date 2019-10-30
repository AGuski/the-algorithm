import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  socket;

  private onMessage$ = new Subject<any>();

  connectToHost(address: string) {

    // each connecting client needs to put in server address on loading the app.
    this.socket = io(`http://${address}:3000`);

    this.socket.on('message', msg => {
      this.onMessage$.next(JSON.parse(msg));
    }); 


    // connection

    this.socket.on('connect', () => {
      console.log('Websocket successfully connected');
    });

    this.socket.on('connect_error', error => {
      console.error('Websocket could not connect:', error);
    });

    this.socket.on('disconnect', reason => {
      console.error('Websocket disconnected:', reason);
    });

    this.socket.on('reconnecting', (attemptNumber) => {
     console.log('Websocket reconnection attempt: ', attemptNumber);
    });
  }

  onMessage(typeFilter?: string) {
    return this.onMessage$.pipe(
      filter(data => {
        if (typeFilter) {
          return data.type === typeFilter;
        } else {
          return true;
        }
      })
    );
  }

  emit(data: any) {
    try {
      this.socket.emit('message', JSON.stringify(data));
    } catch (e) {
      console.error(`Could not emit websocket data:`, e);
      throw(e);
    }
  }
}