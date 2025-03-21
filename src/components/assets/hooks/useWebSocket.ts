import { useEffect, useRef, useState } from 'react';
import { getWebSocketUrl } from '../../../config';

interface WebSocketOptions {
  userId?: string;
}

export const useWebSocket = ({ userId }: WebSocketOptions) => {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    console.log('Initializing WebSocket...');

    wsRef.current = new WebSocket(getWebSocketUrl());

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');

      if (userId) {
        wsRef.current?.send(JSON.stringify({ type: 'auth', userId }));
      }
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (
          data.type === 'notificationUpdateUnreadCount' &&
          data.profileId === userId
        ) {
          setUnreadCount((prevCount) =>
            data.increment !== 0 ? (prevCount ?? 0) + data.increment : null
          );
        } else if (
          data.type === 'notificationInitialUnreadCount' &&
          data.profileId === userId
        ) {
          setUnreadCount(data.count);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      console.log('WebSocket unmounted');
      wsRef.current?.close();
    };
  }, [userId]);

  return { unreadCount };
};
