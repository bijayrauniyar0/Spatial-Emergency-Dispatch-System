import { useEffect, useRef } from "react";

import { useIncidentStore } from "../store/incidentStore";

export const useIncidentStream = () => {
  const { activeIncident, fetchActiveIncident, setResponderLocation } = useIncidentStore();
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only stream/poll if there's an active incident and no responder assigned yet
    // Check both responder_id (raw field) and Responder?.id (association)
    const hasResponder =
      (activeIncident as any)?.Responder?.id || activeIncident?.responder_id;

    if (
      !activeIncident ||
      activeIncident.status === "RESOLVED" ||
      hasResponder
    ) {
      // Stop polling once responder is assigned
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    let reconnectTimeout: NodeJS.Timeout;

    const startPolling = () => {
      // Fallback polling every 5 seconds if SSE fails
      if (!pollIntervalRef.current) {
        pollIntervalRef.current = setInterval(() => {
          console.log("Polling for incident updates...");
          fetchActiveIncident();
        }, 5000);
      }
    };

    const stopPolling = () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };

    // Start polling immediately as fallback
    startPolling();

    const connectStream = () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
      const eventSource = new EventSource(`${apiUrl}/incidents/stream`, {
        withCredentials: true,
      });

      const handleOpen = () => {
        // Stop polling when SSE is connected
        stopPolling();
      };

      const handleMessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "responder_location") {
            // High-frequency location update: don't refetch, just update store
            setResponderLocation({ lat: message.latitude, lng: message.longitude });
          } else {
            // Status changes or other events: refetch incident
            fetchActiveIncident();
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
          fetchActiveIncident();
        }
      };

      const handleError = () => {
        eventSource.close();
        // Start polling again as fallback
        startPolling();
        // Attempt to reconnect after 5 seconds
        reconnectTimeout = setTimeout(connectStream, 5000);
      };

      eventSource.onopen = handleOpen;
      eventSource.onmessage = handleMessage;
      eventSource.onerror = handleError;

      return () => {
        eventSource.close();
      };
    };

    const cleanup = connectStream();

    return () => {
      cleanup?.();
      stopPolling();
      clearTimeout(reconnectTimeout);
    };
  }, [activeIncident, fetchActiveIncident]);
};
