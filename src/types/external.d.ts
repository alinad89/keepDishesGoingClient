declare module '@stomp/stompjs' {
  export type StompSubscription = { unsubscribe: () => void };

  export interface IMessage {
    body: string;
    headers?: Record<string, string>;
  }

  export interface IFrame {
    headers: Record<string, string>;
  }

  export interface ClientConfig {
    connectHeaders?: Record<string, string>;
    webSocketFactory?: () => WebSocket | unknown;
    debug?: (message: string) => void;
    reconnectDelay?: number;
    heartbeatIncoming?: number;
    heartbeatOutgoing?: number;
    onConnect?: (frame: IFrame) => void;
    onStompError?: (frame: IFrame) => void;
    onWebSocketClose?: (event: CloseEvent) => void;
    onWebSocketError?: (event: Event) => void;
  }

  export class Client {
    constructor(config?: ClientConfig);
    subscribe(destination: string, callback: (message: IMessage) => void): StompSubscription;
    activate(): void;
    deactivate(): void;
    active: boolean;
    onConnect?: (frame: IFrame) => void;
    onStompError?: (frame: IFrame) => void;
    onWebSocketClose?: (event: CloseEvent) => void;
    onWebSocketError?: (event: Event) => void;
    debug?: (message: string) => void;
    reconnectDelay?: number;
    heartbeatIncoming?: number;
    heartbeatOutgoing?: number;
  }
}

declare module 'sockjs-client' {
  export default class SockJS {
    constructor(url: string);
  }
}
