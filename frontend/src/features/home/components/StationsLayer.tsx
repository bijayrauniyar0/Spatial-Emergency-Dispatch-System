"use client";

import { Popup } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import { stationsClient } from "../services/stationsClient";
import { useHomeStore } from "../store/homeStore";

const STATION_ICONS = {
  POLICE: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
    <path d="M16 8 L20 14 L12 14 Z" fill="#ffffff"/>
    <rect x="12" y="14" width="8" height="8" fill="#ffffff" rx="1"/>
    <circle cx="14" cy="19" r="1" fill="#3b82f6"/>
    <circle cx="18" cy="19" r="1" fill="#3b82f6"/>
  </svg>`,

  FIRE: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
    <path d="M16 8 Q14 12 14 15 Q14 19 16 22 Q18 19 18 15 Q18 12 16 8" fill="#ffffff"/>
    <path d="M12 16 Q11 18 11 20 Q11 22 13 23 Q12 21 12 19" fill="#ffdc00"/>
    <path d="M20 16 Q21 18 21 20 Q21 22 19 23 Q20 21 20 19" fill="#ffdc00"/>
  </svg>`,

  MEDICAL: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
    <g fill="#ffffff">
      <rect x="15" y="10" width="2" height="12" rx="1"/>
      <rect x="10" y="15" width="12" height="2" rx="1"/>
    </g>
  </svg>`,
};

interface StationsLayerProps {
  map?: any;
  isMapLoaded?: boolean;
}

export const StationsLayer: React.FC<StationsLayerProps> = ({
  map,
  isMapLoaded,
}) => {
  const popupRef = useRef<Popup | null>(null);
  const [stationsGeojson, setStationsGeojson] =
    useState<GeoJSON.FeatureCollection | null>(null);
  const [zonesGeojson, setZonesGeojson] =
    useState<GeoJSON.FeatureCollection | null>(null);
  const { selectedCategories, getCategoriesQueryParam } = useHomeStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = getCategoriesQueryParam();
        const [stations, zones] = await Promise.all([
          stationsClient.fetchStationsGeoJSON(categories),
          stationsClient.fetchZonesGeoJSON(categories),
        ]);
        setStationsGeojson(stations);
        setZonesGeojson(zones);
      } catch (error) {
        console.error("Failed to fetch stations or zones:", error);
      }
    };

    fetchData();
  }, [selectedCategories, getCategoriesQueryParam]);

  useEffect(() => {
    if (!map || !isMapLoaded || !stationsGeojson || !zonesGeojson) return;

    // Add images to map
    Object.entries(STATION_ICONS).forEach(([category, svgString]) => {
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        if (!map.hasImage(`icon-${category}`)) {
          map.addImage(`icon-${category}`, img);
        }
      };
      img.src = url;
    });

    // Remove existing sources/layers
    const layersToRemove = [
      "zones-outline-layer",
      "zones-layer",
      "stations-layer",
    ];
    layersToRemove.forEach((layer) => {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    });

    const sourcesToRemove = ["zones-source", "stations-source"];
    sourcesToRemove.forEach((source) => {
      if (map.getSource(source)) {
        map.removeSource(source);
      }
    });

    // Add zones source and layer
    map.addSource("zones-source", {
      type: "geojson",
      data: zonesGeojson,
    });

    // Add zones layer with category colors
    map.addLayer({
      id: "zones-layer",
      type: "fill",
      source: "zones-source",
      paint: {
        "fill-color": [
          "match",
          ["get", "category"],
          "POLICE",
          "#3b82f6",
          "FIRE",
          "#ef4444",
          "MEDICAL",
          "#10b981",
          "#cccccc",
        ],
        "fill-opacity": 0.3,
      },
    });

    // Add zones outline layer
    map.addLayer({
      id: "zones-outline-layer",
      type: "line",
      source: "zones-source",
      paint: {
        "line-color": [
          "match",
          ["get", "category"],
          "POLICE",
          "#3b82f6",
          "FIRE",
          "#ef4444",
          "MEDICAL",
          "#10b981",
          "#cccccc",
        ],
        "line-width": 1.5,
        "line-opacity": 0.7,
      },
    });

    // Add stations source
    map.addSource("stations-source", {
      type: "geojson",
      data: stationsGeojson,
    });

    // Add stations layer
    map.addLayer({
      id: "stations-layer",
      type: "symbol",
      source: "stations-source",
      layout: {
        "icon-image": ["concat", "icon-", ["get", "category"]],
        "icon-size": 1,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "text-field": ["get", "name"],
        "text-size": 10,
        "text-offset": [0, 2.2],
        "text-anchor": "top",
        "text-allow-overlap": true,
        "text-ignore-placement": true,
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
        "text-opacity": ["interpolate", ["linear"], ["zoom"], 11, 0, 12, 1],
      },
    });

    // Handle station clicks
    map.on("click", "stations-layer", (e: any) => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        const { name, category } = feature.properties;
        const { coordinates } = feature.geometry;

        if (popupRef.current) {
          popupRef.current.remove();
        }

        const categoryLabels: Record<string, string> = {
          POLICE: "🚔 Police Station",
          FIRE: "🚒 Fire Station",
          MEDICAL: "🏥 Medical Center",
        };

        popupRef.current = new Popup({ offset: 25 })
          .setLngLat(coordinates)
          .setHTML(
            `<div class="p-3 rounded">
              <h3 class="font-semibold text-sm">${name}</h3>
              <p class="text-xs text-gray-600">${categoryLabels[category] || category}</p>
            </div>`,
          )
          .addTo(map);
      }
    });

    // Change cursor on hover
    const onMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const onMouseLeave = () => {
      map.getCanvas().style.cursor = "grab";
    };

    map.on("mouseenter", "stations-layer", onMouseEnter);
    map.on("mouseleave", "stations-layer", onMouseLeave);

    return () => {
      map.off("click", "stations-layer");
      map.off("mouseenter", "stations-layer", onMouseEnter);
      map.off("mouseleave", "stations-layer", onMouseLeave);
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [map, isMapLoaded, stationsGeojson, zonesGeojson]);

  return null;
};
