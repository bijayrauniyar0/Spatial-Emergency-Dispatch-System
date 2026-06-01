"use client";

import { Marker } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

interface UserLocationProps {
  map?: any;
  isMapLoaded?: boolean;
}

export const UserLocation: React.FC<UserLocationProps> = ({
  map,
  isMapLoaded,
}) => {
  const markerRef = useRef<Marker | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting user location:", error);
      },
    );
  }, []);

  useEffect(() => {
    if (!map || !isMapLoaded || !location) return;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const el = document.createElement("div");
    el.innerHTML = `
      <style>
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7);
          }
          70% {
            box-shadow: 0 0 0 32px rgba(168, 85, 247, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(168, 85, 247, 0);
          }
        }

        .user-location-marker {
          width:24px;
          height:24px;
          border-radius: 50%;
          background-color: #a855f7;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #a855f7;
          animation: pulse-ring 2s infinite;
          position: relative;
        }

        .user-location-marker::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        }
      </style>
      <div class="user-location-marker"></div>
    `;

    markerRef.current = new Marker({ element: el, anchor: "center" })
      .setLngLat([location.lng, location.lat])
      .addTo(map);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, isMapLoaded, location]);

  return null;
};
