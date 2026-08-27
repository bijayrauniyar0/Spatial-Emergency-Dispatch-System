import { useEffect, useRef } from "react";
import useDashboardStore from "../store/dashboardStore";
import useUIStore from "../store/uiStore";

export const useResponderStream = () => {
  const { fetchAll } = useDashboardStore();
  const { openModal, setHighlightedIncident } = useUIStore();
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const startPolling = () => {
      if (!pollIntervalRef.current) {
        pollIntervalRef.current = setInterval(() => {
          fetchAll();
        }, 5000);
      }
    };

    const stopPolling = () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };

    const clearHighlight = () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };

    const connectStream = () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
      const eventSource = new EventSource(
        `${apiUrl}/incidents/station-stream`,
        { withCredentials: true }
      );

      const handleOpen = () => {
        stopPolling();
      };

      const handleMessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "incident_created") {
            // New incident: fetch, highlight, auto-open modal
            fetchAll();
            setHighlightedIncident(message.incidentId);
            openModal();

            // Auto-clear highlight after 5s
            clearHighlight();
            highlightTimeoutRef.current = setTimeout(() => {
              setHighlightedIncident(null);
            }, 5000);
          } else if (message.type === "incident_location_updated") {
            // Citizen location updated: if it's our current task, refetch to get the new location
            // The TaskRouteLayer will recompute the route based on the updated incident.location
            // For now, just refetch the task
            // (Alternatively, we could emit to a store and have TaskRouteLayer listen, but refetch is simpler)
            // Actually, incident_location_updated only updates incident.location, not our task in the store
            // So just do nothing — the citizen location update is streamed separately via incident location
            // The map will recompute routes based on responder's myLocation + the fetched task
            // This message is mainly for notifying responders that the citizen moved
            fetchAll();
          } else if (
            message.type === "incident_claimed" ||
            message.type === "incident_arrived" ||
            message.type === "incident_resolved"
          ) {
            // Other changes: just refetch
            fetchAll();
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      const handleError = () => {
        eventSource.close();
        startPolling();
        reconnectTimeout = setTimeout(connectStream, 5000);
      };

      eventSource.onopen = handleOpen;
      eventSource.onmessage = handleMessage;
      eventSource.onerror = handleError;

      return () => {
        eventSource.close();
      };
    };

    // Start polling as fallback immediately
    startPolling();

    // Attempt to establish SSE stream
    const cleanup = connectStream();

    return () => {
      cleanup?.();
      stopPolling();
      clearHighlight();
      clearTimeout(reconnectTimeout);
    };
  }, [fetchAll, openModal, setHighlightedIncident]);
};
