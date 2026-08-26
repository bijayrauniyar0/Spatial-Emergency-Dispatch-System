"use client";

import { Marker, Popup as MaplibrePopup } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { toast } from "sonner";

import useDashboardStore from "../store/dashboardStore";
import { responderDashboardClient } from "../api/client";
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
  const { queue, claim } = useDashboardStore();
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const popupRef = useRef<MaplibrePopup | null>(null);

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

      el.addEventListener("click", async () => {
        try {
          // Fetch full incident details (includes citizen info)
          const fullIncident =
            await responderDashboardClient.getIncidentById(incident.id);

          // Create popup content with citizen info and claim button
          const popupContent = document.createElement("div");
          popupContent.className = "p-4 bg-white rounded shadow-lg max-w-xs";
          popupContent.innerHTML = `
            <div class="space-y-3 text-sm">
              <div>
                <p class="text-gray-600 text-xs">Citizen</p>
                <p class="font-semibold">${
                  (fullIncident as any).citizen?.name || "Unknown"
                }</p>
                ${
                  (fullIncident as any).citizen?.oauth_provider === "guest"
                    ? '<div class="rounded bg-yellow-100 p-1 text-yellow-800 text-xs">Guest — no contact info</div>'
                    : (fullIncident as any).citizen?.number
                      ? `<p class="text-gray-700">${(fullIncident as any).citizen.number}</p>`
                      : ""
                }
              </div>
              <div>
                <p class="text-gray-600 text-xs">Category</p>
                <p class="font-semibold">${incident.category}</p>
              </div>
              <div>
                <p class="text-gray-600 text-xs">Location</p>
                <p class="font-mono text-xs">${incident.location.coordinates[1].toFixed(4)}, ${incident.location.coordinates[0].toFixed(4)}</p>
              </div>
              <button id="claim-btn-${incident.id}" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium">
                Claim Incident
              </button>
            </div>
          `;

          // Remove existing popup if open
          if (popupRef.current) {
            popupRef.current.remove();
          }

          // Create and show popup
          popupRef.current = new MaplibrePopup({ closeButton: true })
            .setLngLat([
              incident.location.coordinates[0],
              incident.location.coordinates[1],
            ])
            .setDOMContent(popupContent)
            .addTo(map);

          // Attach claim button handler
          const claimBtn = popupContent.querySelector(
            `#claim-btn-${incident.id}`
          ) as HTMLButtonElement | null;
          if (claimBtn) {
            claimBtn.addEventListener("click", async () => {
              setClaimingId(incident.id);
              claimBtn.disabled = true;
              claimBtn.textContent = "...";

              try {
                await claim(incident.id);
                toast.success("Incident claimed!");
                if (popupRef.current) {
                  popupRef.current.remove();
                  popupRef.current = null;
                }
              } catch (error: any) {
                const message =
                  error?.response?.status === 409
                    ? "This incident was already claimed"
                    : error?.response?.data?.message ||
                      "Failed to claim incident";
                toast.error(message);
                claimBtn.disabled = false;
                claimBtn.textContent = "Claim Incident";
              } finally {
                setClaimingId(null);
              }
            });
          }
        } catch (error) {
          console.error("Error fetching incident details:", error);
          toast.error("Failed to load incident details");
        }
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
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [map, isMapLoaded, queue, claim, claimingId]);

  return null;
};
