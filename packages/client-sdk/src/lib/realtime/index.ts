import { ClientOpts } from '../../../index';
import { io, Socket } from 'socket.io-client';

export class SurfRealtime {
  private _socket: Socket;

  constructor({ client }: ClientOpts) {
    this._socket = io(client, {
      reconnection: true,
    });
  }

  public async onUpdate(callback: (data: any) => void) {
    this._socket.on('streamUpdate', (data: any) => {
      callback(data);
    });
  }

  public async onCreate(callback: (data: any) => void) {
    this._socket.on('streamCreate', (data: any) => {
      callback(data);
    });
  }
}
