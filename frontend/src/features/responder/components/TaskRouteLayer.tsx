"use client";

import { Marker } from "maplibre-gl";
import { useEffect, useRef, useMemo } from "react";
import useDashboardStore from "../store/dashboardStore";
import useLocationStore from "../store/locationStore";
import VectorLayer from "@/components/common/Map/VectorLayer";
import { computeRoute } from "@/lib/pathfinding/astar";

interface TaskRouteLayerProps {
  map?: any;
  isMapLoaded?: boolean;
}

export const TaskRouteLayer: React.FC<TaskRouteLayerProps> = ({
  map,
  isMapLoaded,
}) => {
  const { myTask } = useDashboardStore();
  const { myLocation } = useLocationStore();
  const markerRef = useRef<Marker | null>(null);
  const lastRouteComputedRef = useRef<{ lat: number; lng: number } | null>(null);

  // Compute route when responder position moves meaningfully
  const routeGeoJSON = useMemo(() => {
    if (
      !myLocation ||
      !myTask ||
      !myTask.location ||
      myTask.status === "RESOLVED" ||
      (myTask.status !== "RESPONDING" && myTask.status !== "ARRIVED")
    ) {
      return null;
    }

    // Only recompute if responder moved >50m
    if (lastRouteComputedRef.current) {
      const dLat = myLocation.lat - lastRouteComputedRef.current.lat;
      const dLng = myLocation.lng - lastRouteComputedRef.current.lng;
      const distance = Math.sqrt(dLat * dLat + dLng * dLng) * 111000; // rough meters
      if (distance < 50) {
        return null;
      }
    }

    try {
      const route = computeRoute(
        [myLocation.lng, myLocation.lat],
        [myTask.location.coordinates[0], myTask.location.coordinates[1]]
      );

      lastRouteComputedRef.current = { lat: myLocation.lat, lng: myLocation.lng };

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
  }, [myLocation, myTask]);

  // Render incident/citizen marker
  useEffect(() => {
    if (
      !map ||
      !isMapLoaded ||
      !myLocation ||
      !myTask ||
      myTask.status === "RESOLVED" ||
      (myTask.status !== "RESPONDING" && myTask.status !== "ARRIVED")
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
        @keyframes incident-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 24px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        .incident-marker {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #ef4444;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #ef4444;
          animation: incident-pulse 2s infinite;
          position: relative;
        }
        .incident-marker::after {
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
      <div class="incident-marker"></div>
    `;

    markerRef.current = new Marker({ element: el, anchor: "center" })
      .setLngLat([myTask.location.coordinates[0], myTask.location.coordinates[1]])
      .addTo(map);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, isMapLoaded, myLocation, myTask]);

  // Render route line via VectorLayer
  if (!routeGeoJSON || !map || !isMapLoaded) {
    return null;
  }

  return (
    <VectorLayer
      map={map}
      id="task-route"
      geojson={routeGeoJSON}
      isMapLoaded={isMapLoaded}
      visibleOnMap={true}
      layerOptions={{
        type: "line",
        paint: {
          "line-color": "#ef4444",
          "line-width": 3,
          "line-opacity": 0.8,
        },
      }}
    />
  );
};
