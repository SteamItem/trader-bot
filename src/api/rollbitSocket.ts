import WebSocket from "ws";
import { Constants } from "../helpers/constant";

export class RollbitSocket {
  private channels: Map<any, any>;
  private socket: WebSocket;
  private queue: any[];

  constructor() {
    this.channels = new Map();
    this.socket = null;
    this.queue = [];
  }

  public listen (ch: string, listener) {
    let chs = this.channels.get(ch);
    if (chs == null) {
      chs = [];
      this.channels.set(ch, chs);
    }
    chs.push(listener);

    return function () {
      const idx = chs.indexOf(listener);
      if (idx < 0) return;
      chs.splice(idx, 1);
    }
  }
  public async connect(cookie: string) {
    if (this.socket) return;
    const url = 'https://ws.rollbit.com/';
    const options: WebSocket.ClientOptions = {
      origin: 'https://www.rollbit.com',
      headers: {
        'Host': 'ws.rollbit.com',
        'Connection': 'Upgrade',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'User-Agent': Constants.UserAgent,
        'Upgrade': 'websocket',
        'Origin': 'https://www.rollbit.com',
        'Sec-WebSocket-Version': '13',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
        'Cookie': cookie
      }
    };
    this.socket = new WebSocket(url, "optionalProtocol", options);
    this.socket.onmessage = (ev: WebSocket.MessageEvent) => {
      const [ch, message, id] = JSON.parse(ev.data.toString());
      const listeners = this.channels.get(ch);
      if (listeners && listeners.length)
        listeners.forEach(l => l(message));
    }
    this.socket.onopen = () => {
      while (this.queue.length) {
        this.socket.send(this.queue.shift());
      }
    }
  }
  public disconnect(): void {
    this.socket.terminate();
    this.socket = null;
  }

  private protocolVersion = 2;
  private id = 1;

  public send(ch: string, message: string, cookie: string, immediate = false) {
    if (this.socket == null) this.connect(cookie);
    const encoder = new TextEncoder();
    const id = 'v' + this.protocolVersion + '.' + ++this.id
    const payload = JSON.stringify([ch, message, id]);
    const isConnected = this.socket.readyState === 1;
    if (immediate && !isConnected) return;
    if (!isConnected) return this.queue.push(payload);
    this.socket.send(encoder.encode(payload));
  }
}