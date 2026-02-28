export const streamChat = (message, onMessage, onError) => {
  const eventSource = new EventSource(
    `http://localhost:8000/chat_stream/${encodeURIComponent(message)}`
  );

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);

      if (data.type === "end") {
        eventSource.close();
      }
    } catch (err) {
      console.error("Parsing error:", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE error:", err);
    eventSource.close();
    if (onError) onError(err);
  };

  return eventSource;
};