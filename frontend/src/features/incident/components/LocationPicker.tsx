"use client";

import { Marker } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import MapComponent from "@/components/common/Map";
import { Button } from "@/components/primitives/button";
import { FlexColumn } from "@/components/ui/layouts";

interface LocationPickerProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLat,
  initialLng,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null,
  );
  const [isAutoLocating, setIsAutoLocating] = useState(false);

  // Auto-geolocation on mount
  useEffect(() => {
    if (selectedLocation) return; // Already have a location

    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    setIsAutoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation({ lat: latitude, lng: longitude });
        onLocationSelect(latitude, longitude);
        setIsAutoLocating(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        setIsAutoLocating(false);
      },
    );
  }, []);

  return (
    <FlexColumn className="w-full gap-3">
      <div className="relative h-80 w-full overflow-hidden rounded-md border bg-gray-100">
        <MapComponent
          mapOptions={{
            center:
              selectedLocation?.lng && selectedLocation?.lat
                ? [selectedLocation.lng, selectedLocation.lat]
                : [85.324, 27.7172],
            zoom: selectedLocation ? 13 : 7,
          }}
          containerId="location-picker-map"
          disableRotation
        >
          <MapHandler
            selectedLat={selectedLocation?.lat}
            selectedLng={selectedLocation?.lng}
            onLocationSelect={(lat, lng) => {
              setSelectedLocation({ lat, lng });
              onLocationSelect(lat, lng);
            }}
          />
        </MapComponent>
      </div>

      {selectedLocation && (
        <div className="bg-muted flex items-center justify-between rounded-md p-2">
          <span className="text-xs">
            Location: {selectedLocation.lat.toFixed(4)},{" "}
            {selectedLocation.lng.toFixed(4)}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedLocation(null);
              setIsAutoLocating(true);
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;
                    setSelectedLocation({ lat: latitude, lng: longitude });
                    onLocationSelect(latitude, longitude);
                    setIsAutoLocating(false);
                  },
                  (error) => {
                    console.error("Error getting user location:", error);
                    setIsAutoLocating(false);
                  },
                );
              }
            }}
            disabled={isAutoLocating}
          >
            {isAutoLocating ? "Locating..." : "Use My Location"}
          </Button>
        </div>
      )}
    </FlexColumn>
  );
};

interface MapHandlerProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
  map?: any;
  isMapLoaded?: boolean;
  selectedLat?: number;
  selectedLng?: number;
}

const MapHandler: React.FC<MapHandlerProps> = ({
  onLocationSelect,
  map,
  isMapLoaded,
  selectedLat,
  selectedLng,
}) => {
  const markerRef = useRef<Marker | null>(null);

  // Handle map clicks
  useEffect(() => {
    if (!map || !isMapLoaded) return;

    const handleMapClick = (e: any) => {
      if (e?.lngLat) {
        const { lng, lat } = e.lngLat;
        onLocationSelect(lat, lng);
      }
    };

    map.on("click", handleMapClick);
    map.getCanvas().style.cursor = "crosshair";

    return () => {
      map.off("click", handleMapClick);
      map.getCanvas().style.cursor = "grab";
    };
  }, [map, isMapLoaded, onLocationSelect]);

  // Marker for selected location
  useEffect(() => {
    if (!map || !isMapLoaded) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }

    if (!selectedLat || !selectedLng) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new Marker({ color: "#ef4444" })
      .setLngLat([selectedLng, selectedLat])
      .addTo(map);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, isMapLoaded, selectedLat, selectedLng]);

  return null;
};
