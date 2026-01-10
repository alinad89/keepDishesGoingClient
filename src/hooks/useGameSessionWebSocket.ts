import { useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import type { StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAuthToken } from '../api/config';

export interface ExternalSessionMessage {
  url: string;
  playerId1: string;
  playerId2: string;
}

interface UseGameSessionWebSocketOptions {
  enabled: boolean;
  lobbyId: string | null;
  onSessionLink: (link: string) => void;
  onExternalSession: (payload: ExternalSessionMessage) => void;
  onFinished?: () => void;
  onError?: (message: string) => void;
}

const WS_BASE_URL = 'http://localhost:8082';

export function useGameSessionWebSocket({
  enabled,
  lobbyId,
  onSessionLink,
  onExternalSession,
  onFinished,
  onError,
}: UseGameSessionWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientRef = useRef<Client | null>(null);
  const sessionSubscriptionRef = useRef<StompSubscription | null>(null);
  const finishedSubscriptionRef = useRef<StompSubscription | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const connectRef = useRef<(() => void) | null>(null);

  const onSessionLinkRef = useRef(onSessionLink);
  const onExternalSessionRef = useRef(onExternalSession);
  const onFinishedRef = useRef(onFinished);
  const onErrorRef = useRef(onError);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 2000;

  useEffect(() => {
    onSessionLinkRef.current = onSessionLink;
  }, [onSessionLink]);

  useEffect(() => {
    onExternalSessionRef.current = onExternalSession;
  }, [onExternalSession]);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const handleSessionMessage = useCallback((body: string) => {
    let parsedBody: unknown = body;
    const trimmedBody = typeof body === 'string' ? body.trim() : '';
    const looksLikeJson = trimmedBody.startsWith('{') || trimmedBody.startsWith('[');

    if (looksLikeJson) {
      try {
        parsedBody = JSON.parse(body);
      } catch (err) {
        console.warn('[GameSessionWebSocket] Failed to parse JSON payload, using raw value', body, err);
        parsedBody = body;
      }
    } else {
      console.log('[GameSessionWebSocket] Received non-JSON payload', body);
    }

    if (
      parsedBody &&
      typeof parsedBody === 'object' &&
      'url' in parsedBody &&
      'playerId1' in parsedBody &&
      'playerId2' in parsedBody
    ) {
      const payload = parsedBody as ExternalSessionMessage;
      onExternalSessionRef.current?.({
        url: String(payload.url),
        playerId1: String(payload.playerId1),
        playerId2: String(payload.playerId2),
      });
      return;
    }

    const sessionLink =
      typeof parsedBody === 'string'
        ? parsedBody
        : typeof body === 'string'
          ? body
          : '';

    if (sessionLink) {
      onSessionLinkRef.current?.(sessionLink);
    }
  }, []);

  const cleanupSubscriptions = useCallback(() => {
    if (sessionSubscriptionRef.current) {
      sessionSubscriptionRef.current.unsubscribe();
      sessionSubscriptionRef.current = null;
    }

    if (finishedSubscriptionRef.current) {
      finishedSubscriptionRef.current.unsubscribe();
      finishedSubscriptionRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!enabled || !lobbyId) {
      return;
    }

    // Get auth token for WebSocket connection
    const token = getAuthToken();
    const connectHeaders: Record<string, string> = {};
    if (token) {
      connectHeaders['Authorization'] = `Bearer ${token}`;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_BASE_URL + '/ws'),
      connectHeaders,
      debug: (str) => console.log('[GameSessionWebSocket]', str),
      reconnectDelay: RECONNECT_DELAY,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);
      setError(null);
      reconnectAttemptsRef.current = 0;

      const baseDestination = `/topic/game-sessions/${lobbyId}`;
      sessionSubscriptionRef.current = client.subscribe(baseDestination, (message) => {
        handleSessionMessage(message.body);
      });
      finishedSubscriptionRef.current = client.subscribe(`${baseDestination}/finished`, () => {
        onFinishedRef.current?.();
      });
    };

    client.onStompError = (frame) => {
      console.error('[GameSessionWebSocket] STOMP error', frame);
      setError('WebSocket connection error');
      setIsConnected(false);
      onErrorRef.current?.('WebSocket connection error');
    };

    client.onWebSocketClose = (event) => {
      console.log('[GameSessionWebSocket] Connection closed', event);
      setIsConnected(false);
      cleanupSubscriptions();

      if (enabled && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttemptsRef.current++;
        const attempt = reconnectAttemptsRef.current;
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connectRef.current?.();
        }, RECONNECT_DELAY * attempt);
      }
    };

    client.onWebSocketError = (event) => {
      console.error('[GameSessionWebSocket] WebSocket error', event);
      setError('WebSocket connection error');
      onErrorRef.current?.('WebSocket connection error');
    };

    client.activate();
    clientRef.current = client;
  }, [cleanupSubscriptions, enabled, handleSessionMessage, lobbyId]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current !== null) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    cleanupSubscriptions();

    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }

    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, [cleanupSubscriptions]);

  useEffect(() => {
    if (enabled && lobbyId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, enabled, lobbyId]);

  return {
    isConnected,
    error,
  };
}
