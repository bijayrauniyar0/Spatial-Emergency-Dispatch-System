"use client";

import type { MapLayerMouseEvent } from "maplibre-gl";
import { Popup as MaplibrePopup } from "maplibre-gl";
import { useCallback, useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";

import { MapInstanceType } from "./types";

export interface PopupData {
  coordinates: [number, number];
  properties: Record<string, any>;
  layerId: string;
}

export interface PopupActions {
  close: () => void;
}

export interface PopupProps {
  map?: MapInstanceType | null;
  isMapLoaded?: boolean;
  layerId: string;
  children: (data: PopupData, actions: PopupActions) => React.ReactNode;
  trigger?: "click" | "hover";
  closeButton?: boolean;
  closeOnClick?: boolean;
  offset?: number | [number, number];
  className?: string;
}

export default function Popup({
  map,
  isMapLoaded,
  layerId,
  children,
  trigger = "click",
  closeButton = false,
  closeOnClick,
  offset,
  className = "",
}: PopupProps) {
  const popupRef = useRef<MaplibrePopup | null>(null);

  // Close action to be passed to children
  const closePopup = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.remove();
    }
  }, []);

  const handleLayerInteraction = useCallback(
    (e: MapLayerMouseEvent) => {
      if (!map || !e.features || e.features.length === 0) return;

      const feature = e.features[0];
      const coordinates = e.lngLat;
      const properties = feature.properties || {};

      const data: PopupData = {
        coordinates: coordinates.toArray() as [number, number],
        properties,
        layerId,
      };

      // Create actions object
      const actions: PopupActions = {
        close: closePopup,
      };

      // Render content with data and actions
      const renderedContent = children(data, actions);
      const htmlContent = renderToString(renderedContent as React.ReactElement);

      // Create popup instance if it doesn't exist
      if (!popupRef.current) {
        // Determine close behavior based on props or trigger
        const shouldShowCloseButton = closeButton ?? trigger === "click";
        const shouldCloseOnClick = closeOnClick ?? trigger === "click";

        popupRef.current = new MaplibrePopup({
          closeButton: shouldShowCloseButton,
          closeOnClick: shouldCloseOnClick,
          offset,
          maxWidth: "none",
          className: className ? `custom-popup ${className}` : "custom-popup",
        });

        // Handle close event - clean up ref so popup can be recreated
        popupRef.current.on("close", () => {
          popupRef.current = null;
        });
      }

      // Set position, content, and add to map
      popupRef.current.setLngLat(coordinates).setHTML(htmlContent).addTo(map);
    },
    [
      map,
      layerId,
      children,
      trigger,
      closeButton,
      closeOnClick,
      offset,
      className,
      closePopup,
    ],
  );

  const handleMouseLeave = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  }, []);

  // Add event listeners to layer
  useEffect(() => {
    if (!map || !isMapLoaded) return;

    // Check if layer exists before adding listeners
    if (!map.getLayer(layerId)) {
      console.warn(
        `Layer "${layerId}" not found on map. Popup listeners not attached.`,
      );
      return;
    }

    // Add event listeners based on trigger type
    if (trigger === "click") {
      map.on("click", layerId, handleLayerInteraction);
    } else if (trigger === "hover") {
      map.on("mouseenter", layerId, handleLayerInteraction);
      map.on("mouseleave", layerId, handleMouseLeave);
    }

    return () => {
      // Remove event listeners
      if (trigger === "click") {
        map.off("click", layerId, handleLayerInteraction);
      } else if (trigger === "hover") {
        map.off("mouseenter", layerId, handleLayerInteraction);
        map.off("mouseleave", layerId, handleMouseLeave);
      }
      // Cleanup popup
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [
    map,
    isMapLoaded,
    layerId,
    trigger,
    handleLayerInteraction,
    handleMouseLeave,
  ]);

  return null;
}
