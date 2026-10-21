/**
 * Event Service — connects to Server-Sent Events (SSE) stream at /api/events
 */

export function createEventStream({ onEvent, onError, onOpen } = {}) {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';
  const url = `${BASE_URL}/api/events`;

  let eventSource = null;

  try {
    eventSource = new EventSource(url);

    eventSource.onopen = (e) => {
      if (onOpen) onOpen(e);
    };

    eventSource.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (onEvent) onEvent({ type: 'message', data: payload, id: e.lastEventId });
      } catch (parseErr) {
        if (onEvent) onEvent({ type: 'raw', data: e.data, id: e.lastEventId });
      }
    };

    eventSource.onerror = (e) => {
      if (onError) onError(e);
    };
  } catch (err) {
    if (onError) onError(err);
  }

  return {
    close: () => {
      if (eventSource) {
        eventSource.close();
      }
    },
  };
}
