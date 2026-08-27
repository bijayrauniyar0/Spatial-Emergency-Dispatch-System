import { useEffect, useRef } from "react";
import { useIncidentStore } from "../store/incidentStore";
import { incidentClient } from "../api/client";

const LOCATION_THRESHOLD_METERS = 10; // Only update if moved >10m
const LOCATION_UPDATE_INTERVAL_MS = 4000; // Max update frequency: every 4s

export const useCitizenLocationBroadcaster = (enabled: boolean) => {
  const { activeIncident } = useIncidentStore();
  const watchIdRef = useRef<number | null>(null);
  const lastBroadcastRef = useRef<{ lat: number; lng: number; time: number } | null>(null);

  useEffect(() => {
    // Only broadcast if enabled AND incident exists AND not resolved
    const shouldBroadcast =
      enabled &&
      activeIncident &&
      activeIncident.status &&
      activeIncident.status !== "RESOLVED";

    if (!shouldBroadcast || !navigator.geolocation) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    // Start watching location
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const now = Date.now();

        // Throttled broadcast to server
        if (lastBroadcastRef.current) {
          const distance = haversineDistance(
            lastBroadcastRef.current.lat,
            lastBroadcastRef.current.lng,
            latitude,
            longitude
          );
          const timeSinceLastBroadcast = now - lastBroadcastRef.current.time;

          // Only broadcast if moved significantly or enough time has passed
          if (
            distance < LOCATION_THRESHOLD_METERS &&
            timeSinceLastBroadcast < LOCATION_UPDATE_INTERVAL_MS
          ) {
            return;
          }
        }

        // Broadcast to server
        incidentClient
          .updateCitizenLocation(activeIncident.id, latitude, longitude)
          .catch((error) => {
            console.error("Failed to broadcast citizen location:", error);
          });

        lastBroadcastRef.current = { lat: latitude, lng: longitude, time: now };
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      lastBroadcastRef.current = null;
    };
  }, [enabled, activeIncident]);
};

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
