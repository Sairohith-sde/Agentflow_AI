import { useEffect, useState } from 'react';
import { getSocket } from '../services/socket';

export function useExecutionEvents(executionId) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!executionId) return undefined;

    const socket = getSocket();
    socket.connect();
    socket.emit('execution:subscribe', executionId);

    function onEvent(event) {
      setEvents((current) => [...current, event]);
    }

    socket.on('execution:event', onEvent);

    return () => {
      socket.emit('execution:unsubscribe', executionId);
      socket.off('execution:event', onEvent);
    };
  }, [executionId]);

  return events;
}
