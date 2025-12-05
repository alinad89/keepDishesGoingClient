import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import type { StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { ChatMessage } from "../types/api";

interface WebSocketMessage {
    chatId: string;
    message: ChatMessage;
}

interface UseWebSocketOptions {
    enabled: boolean;
    chatId: string | null;
    onMessage: (data: WebSocketMessage) => void;
    onError?: (error: Event) => void;
}

// WebSocket base URL (without the /ws path - will be added by SockJS)
const WS_BASE_URL =
    import.meta.env.VITE_WS_BASE_URL || "http://localhost:8080";

export function useWebSocket({
    enabled,
    chatId,
    onMessage,
    onError,
}: UseWebSocketOptions) {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clientRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<StompSubscription | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const reconnectAttemptsRef = useRef(0);

    const onMessageRef = useRef(onMessage);
    const onErrorRef = useRef(onError);

    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 2000; // 2 seconds

    // Keep handler refs updated
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    const connect = useCallback(() => {
        // Only connect if enabled AND we have a chatId
        if (!enabled || !chatId) {
            console.log('[WebSocket] Connect called but conditions not met:', { enabled, chatId });
            return;
        }

        console.log('[WebSocket] Connecting to STOMP endpoint:', WS_BASE_URL + '/ws');

        // Create STOMP client with SockJS
        const client = new Client({
            webSocketFactory: () => new SockJS(WS_BASE_URL + '/ws'),
            debug: (str) => {
                console.log('[STOMP Debug]', str);
            },
            reconnectDelay: RECONNECT_DELAY,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
            console.log('[WebSocket] Connected to STOMP broker', frame);
            setIsConnected(true);
            setError(null);
            reconnectAttemptsRef.current = 0;

            // Subscribe to chat messages topic
            const destination = `/ws/chats/${chatId}`;
            console.log('[WebSocket] Subscribing to:', destination);

            subscriptionRef.current = client.subscribe(destination, (message) => {
                console.log('[WebSocket] Message received:', message.body);
                try {
                    const messageData = JSON.parse(message.body);
                    console.log('[WebSocket] Parsed message:', messageData);

                    // Transform backend message format to our format
                    const chatMessage: ChatMessage = {
                        content: messageData.content || messageData.messageContent,
                        aiMessage: messageData.aiMessage ?? messageData.isAiMessage ?? true,
                    };

                    onMessageRef.current?.({
                        chatId: chatId,
                        message: chatMessage,
                    });
                } catch (err) {
                    console.error('[WebSocket] Failed to parse message:', err, message.body);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error('[WebSocket] STOMP error:', frame);
            setError('WebSocket connection error');
            setIsConnected(false);
            onErrorRef.current?.(new Event('error'));
        };

        client.onWebSocketClose = (event) => {
            console.log('[WebSocket] Connection closed:', event);
            setIsConnected(false);
            subscriptionRef.current = null;

            // Attempt reconnection if enabled and under max attempts
            if (
                enabled &&
                reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS
            ) {
                reconnectAttemptsRef.current++;
                const attempt = reconnectAttemptsRef.current;
                console.log(
                    `[WebSocket] Reconnecting... Attempt ${attempt}/${MAX_RECONNECT_ATTEMPTS}`
                );

                reconnectTimeoutRef.current = window.setTimeout(() => {
                    connect();
                }, RECONNECT_DELAY * attempt);
            }
        };

        client.onWebSocketError = (event) => {
            console.error('[WebSocket] WebSocket error:', event);
            setError('WebSocket connection error');
            onErrorRef.current?.(event as Event);
        };

        client.activate();
        clientRef.current = client;
    }, [enabled, chatId]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current !== null) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (subscriptionRef.current) {
            console.log('[WebSocket] Unsubscribing from topic');
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }

        if (clientRef.current) {
            console.log('[WebSocket] Disconnecting STOMP client');
            clientRef.current.deactivate();
            clientRef.current = null;
        }

        setIsConnected(false);
        reconnectAttemptsRef.current = 0;
    }, []);

    // Connect when enabled and chatId changes, disconnect when disabled or chatId removed
    useEffect(() => {
        if (enabled && chatId) {
            connect();
        } else {
            disconnect();
        }

        // Cleanup on unmount or when dependencies change
        return () => {
            disconnect();
        };
    }, [enabled, chatId, connect, disconnect]);

    return {
        isConnected,
        error,
        reconnect: connect,
    };
}
