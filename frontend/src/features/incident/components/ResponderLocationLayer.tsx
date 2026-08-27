"use client";

import { Marker } from "maplibre-gl";
import { useEffect, useRef, useMemo } from "react";
import { useIncidentStore } from "../store/incidentStore";
import { useActiveIncident } from "../hooks/useActiveIncident";
import VectorLayer from "@/components/common/Map/VectorLayer";
import { computeRoute } from "@/lib/pathfinding/astar";

interface ResponderLocationLayerProps {
  map?: any;
  isMapLoaded?: boolean;
}

export const ResponderLocationLayer: React.FC<ResponderLocationLayerProps> = ({
  map,
  isMapLoaded,
}) => {
  const { responderLocation } = useIncidentStore();
  const { activeIncident } = useActiveIncident();
  const markerRef = useRef<Marker | null>(null);
  const lastRouteComputedRef = useRef<{ lat: number; lng: number } | null>(null);

  // Compute route when responder position moves meaningfully
  const routeGeoJSON = useMemo(() => {
    if (
      !responderLocation ||
      !activeIncident ||
      !activeIncident.location ||
      activeIncident.status === "RESOLVED" ||
      (activeIncident.status !== "RESPONDING" && activeIncident.status !== "ARRIVED")
    ) {
      return null;
    }

    // Only recompute if responder moved >50m (avoid per-SSE-tick recalculation)
    if (lastRouteComputedRef.current) {
      const dLat = responderLocation.lat - lastRouteComputedRef.current.lat;
      const dLng = responderLocation.lng - lastRouteComputedRef.current.lng;
      const distance = Math.sqrt(dLat * dLat + dLng * dLng) * 111000; // rough meters
      if (distance < 50) {
        return null; // Too close, skip recompute
      }
    }

    try {
      const route = computeRoute(
        [responderLocation.lng, responderLocation.lat],
        [activeIncident.location.coordinates[0], activeIncident.location.coordinates[1]]
      );

      lastRouteComputedRef.current = { lat: responderLocation.lat, lng: responderLocation.lng };

      return {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: {
              distanceMeters: route.distanceMeters,
              etaSeconds: route.etaSeconds,
            },
            geometry: {
              type: "LineString" as const,
              coordinates: route.path,
            },
          },
        ],
      };
    } catch (error) {
      console.error("Error computing route:", error);
      return null;
    }
  }, [responderLocation, activeIncident]);

  // Render responder marker
  useEffect(() => {
    if (
      !map ||
      !isMapLoaded ||
      !responderLocation ||
      !activeIncident ||
      activeIncident.status === "RESOLVED" ||
      (activeIncident.status !== "RESPONDING" && activeIncident.status !== "ARRIVED")
    ) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const el = document.createElement("div");
    el.innerHTML = `
      <style>
        @keyframes responder-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            box-shadow: 0 0 0 24px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
        .responder-marker {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #22c55e;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #22c55e;
          animation: responder-pulse 2s infinite;
          position: relative;
        }
        .responder-marker::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
        }
      </style>
      <div class="responder-marker"></div>
    `;

    markerRef.current = new Marker({ element: el, anchor: "center" })
      .setLngLat([responderLocation.lng, responderLocation.lat])
      .addTo(map);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, isMapLoaded, responderLocation, activeIncident]);

  // Render route line via VectorLayer
  if (!routeGeoJSON || !map || !isMapLoaded) {
    return null;
  }

  return (
    <VectorLayer
      map={map}
      id="responder-route"
      geojson={routeGeoJSON}
      isMapLoaded={isMapLoaded}
      visibleOnMap={true}
      layerOptions={{
        type: "line",
        paint: {
          "line-color": "#22c55e",
          "line-width": 3,
          "line-opacity": 0.8,
        },
      }}
    />
  );
};
