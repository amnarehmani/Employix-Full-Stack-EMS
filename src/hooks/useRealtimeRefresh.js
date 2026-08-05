import { useEffect } from 'react';
import { getSocket } from '../lib/realtime';

export const useRealtimeRefresh = (events, onRefresh) => {
  useEffect(() => {
    const socket = getSocket();
    events.forEach((event) => socket.on(event, onRefresh));

    return () => {
      events.forEach((event) => socket.off(event, onRefresh));
    };
  }, [events, onRefresh]);
};
