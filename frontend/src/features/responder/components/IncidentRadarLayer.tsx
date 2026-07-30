"use client";

import { Marker } from "maplibre-gl";
import { useEffect, useRef } from "react";

import useDashboardStore from "../store/dashboardStore";
import useUIStore from "../store/uiStore";
import { StationQueueIncident } from "../types";

interface IncidentRadarLayerProps {
  map?: any;
  isMapLoaded?: boolean;
}

const categoryColors: Record<string, string> = {
  POLICE: "#3b82f6",
  FIRE: "#ef4444",
  MEDICAL: "#10b981",
};

export const IncidentRadarLayer: React.FC<IncidentRadarLayerProps> = ({
  map,
  isMapLoaded,
}) => {
  const { queue } = useDashboardStore();
  const { openModal } = useUIStore();
  const markersRef = useRef<Map<string, Marker>>(new Map());

  useEffect(() => {
    if (!map || !isMapLoaded || !queue) return;

    const markers = markersRef.current;

    // Remove markers for incidents no longer in queue
    markers.forEach((marker, incidentId) => {
      if (!queue.find((q) => q.id === incidentId)) {
        marker.remove();
        markers.delete(incidentId);
      }
    });

    // Add/update markers for incidents in queue
    queue.forEach((incident: StationQueueIncident) => {
      if (markers.has(incident.id)) return; // Already exists

      const color = categoryColors[incident.category] || "#999999";

      const el = document.createElement("div");
      el.innerHTML = `
        <style>
          @keyframes incident-pulse {
            0% {
              box-shadow: 0 0 0 0 ${color}99;
            }
            70% {
              box-shadow: 0 0 0 32px ${color}00;
            }
            100% {
              box-shadow: 0 0 0 0 ${color}00;
            }
          }

          .incident-marker {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: ${color};
            border: 2px solid white;
            box-shadow: 0 0 0 1px ${color};
            animation: incident-pulse 2s infinite;
            cursor: pointer;
            position: relative;
            transition: transform 0.2s;
          }

          .incident-marker:hover {
            transform: scale(1.2);
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

      el.addEventListener("click", () => {
        openModal();
      });

      const marker = new Marker({ element: el, anchor: "center" })
        .setLngLat([
          incident.location.coordinates[0],
          incident.location.coordinates[1],
        ])
        .addTo(map);

      markers.set(incident.id, marker);
    });

    return () => {
      // Cleanup on unmount
      markers.forEach((marker) => marker.remove());
      markers.clear();
    };
  }, [map, isMapLoaded, queue, openModal]);

  return null;
};
