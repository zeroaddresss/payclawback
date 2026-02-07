import { useState, useEffect, useRef } from 'react';
import { WS_URL } from '../lib/constants';

export interface WSEvent {
  type: string;
  escrowId?: string;
  timestamp: string;
  txHash?: string;
  data?: Record<string, unknown>;
}

export function useWebSocket(): WSEvent[] {
  const [events, setEvents] = useState<WSEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(`${WS_URL}/ws`);
      wsRef.current = ws;

      ws.onmessage = (msg) => {
        try {
          const event = JSON.parse(msg.data) as WSEvent;
          setEvents((prev) => [event, ...prev].slice(0, 50));
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, []);

  return events;
}
