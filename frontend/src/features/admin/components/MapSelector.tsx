"use client";

import { Map, MapPin } from "lucide-react";
import { Marker } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import MapComponent from "@/components/common/Map";
import { Button } from "@/components/primitives/button";
import { FlexColumn, FlexRow } from "@/components/ui/layouts";

type MapMode = "location" | "zone";

interface MapSelectorProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
  onZoneSelect: (geojson: GeoJSON.Feature) => void;
  latitude?: number;
  longitude?: number;
  zone?: GeoJSON.Feature;
}

export const MapSelector: React.FC<MapSelectorProps> = ({
  onLocationSelect,
  onZoneSelect,
  latitude,
  longitude,
  zone,
}) => {
  const [mode, setMode] = useState<MapMode>("location");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(latitude && longitude ? { lat: latitude, lng: longitude } : null);
  const [polygonPoints, setPolygonPoints] = useState<Array<[number, number]>>(
    [],
  );

  return (
    <FlexColumn className="w-full gap-3">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "location" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setMode("location");
            setPolygonPoints([]);
          }}
        >
          <MapPin className="size-4" />
          Location Mode
        </Button>
        <Button
          type="button"
          variant={mode === "zone" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setMode("zone");
          }}
        >
          <Map className="size-4" />
          Zone Mode
        </Button>
      </div>

      <div className="h-64">
        <MapComponent
          mapOptions={{
            center:
              selectedLocation?.lng && selectedLocation?.lat
                ? [selectedLocation.lng, selectedLocation.lat]
                : [85.324, 27.7172],
            zoom: selectedLocation ? 12 : 7,
          }}
          disableRotation
        >
          <MapHandler
            mode={mode}
            onLocationSelect={(lat, lng) => {
              setSelectedLocation({ lat, lng });
              onLocationSelect(lat, lng);
            }}
            onZoneSelect={(feature) => {
              onZoneSelect(feature);
              setPolygonPoints([]);
            }}
            selectedLat={selectedLocation?.lat}
            selectedLng={selectedLocation?.lng}
            polygonPoints={polygonPoints}
            setPolygonPoints={setPolygonPoints}
            zone={zone}
          />
        </MapComponent>
      </div>

      {mode === "zone" && polygonPoints.length > 0 && (
        <div className="bg-muted flex items-center justify-between rounded-md p-2">
          <span className="text-xs">
            Polygon: {polygonPoints.length} points
          </span>
          <FlexRow className="gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setPolygonPoints([])}
            >
              Clear
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={polygonPoints.length < 3}
              onClick={() => {
                if (polygonPoints.length >= 3) {
                  const closedCoords = [...polygonPoints, polygonPoints[0]];
                  const feature: GeoJSON.Feature = {
                    type: "Feature",
                    geometry: {
                      type: "Polygon",
                      coordinates: [closedCoords],
                    },
                    properties: {},
                  };
                  onZoneSelect(feature);
                  setPolygonPoints([]);
                }
              }}
            >
              Save Polygon
            </Button>
          </FlexRow>
        </div>
      )}
    </FlexColumn>
  );
};

interface MapHandlerProps {
  mode: MapMode;
  onLocationSelect: (latitude: number, longitude: number) => void;
  onZoneSelect: (geojson: GeoJSON.Feature) => void;
  map?: any;
  isMapLoaded?: boolean;
  selectedLat?: number;
  selectedLng?: number;
  polygonPoints: Array<[number, number]>;
  setPolygonPoints: (points: Array<[number, number]>) => void;
  zone?: GeoJSON.Feature;
}

const MapHandler: React.FC<MapHandlerProps> = ({
  mode,
  onLocationSelect,
  onZoneSelect,
  map,
  isMapLoaded,
  selectedLat,
  selectedLng,
  polygonPoints,
  setPolygonPoints,
  zone,
}) => {
  const markerRef = useRef<Marker | null>(null);

  // Handle map clicks based on mode
  useEffect(() => {
    if (!map || !isMapLoaded) return;

    const handleMapClick = (e: any) => {
      if (e?.lngLat) {
        const { lng, lat } = e.lngLat;
        if (mode === "location") {
          onLocationSelect(lat, lng);
        } else if (mode === "zone") {
          setPolygonPoints([...polygonPoints, [lng, lat]]);
        }
      }
    };

    map.on("click", handleMapClick);
    map.getCanvas().style.cursor = mode === "zone" ? "crosshair" : "grab";

    return () => {
      map.off("click", handleMapClick);
      map.getCanvas().style.cursor = "grab";
    };
  }, [
    map,
    isMapLoaded,
    mode,
    onLocationSelect,
    polygonPoints,
    setPolygonPoints,
  ]);

  // Marker for location
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

    markerRef.current = new Marker()
      .setLngLat([selectedLng, selectedLat])
      .addTo(map);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, isMapLoaded, mode, selectedLat, selectedLng]);

  // Display polygon/zone on map
  useEffect(() => {
    if (!map || !isMapLoaded) return;

    if (map.getLayer("zone-layer")) {
      map.removeLayer("zone-layer");
    }
    if (map.getLayer("zone-line")) {
      map.removeLayer("zone-line");
    }
    if (map.getSource("zone-source")) {
      map.removeSource("zone-source");
    }

    const features: GeoJSON.Feature[] = [];

    if (mode === "zone" && polygonPoints.length >= 2) {
      features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: polygonPoints,
        },
        properties: {},
      });
    }

    if (zone) {
      features.push(zone);
    }

    if (features.length > 0) {
      map.addSource("zone-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
      });

      map.addLayer({
        id: "zone-layer",
        type: "fill",
        source: "zone-source",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "fill-color": "#3b82f6",
          "fill-opacity": 0.3,
          "fill-outline-color": "#1e40af",
        },
      });

      map.addLayer({
        id: "zone-line",
        type: "line",
        source: "zone-source",
        filter: ["==", ["geometry-type"], "LineString"],
        paint: {
          "line-color": "#ef4444",
          "line-width": 2,
        },
      });
    }
  }, [map, isMapLoaded, polygonPoints, zone, mode]);

  return null;
};
