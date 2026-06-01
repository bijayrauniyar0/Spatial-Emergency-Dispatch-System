"use client";

import { useEffect, useRef } from "react";

import { BASE_LAYERS } from "./constants";
import { IBaseLayerSwitcherProps } from "./types";

export default function BaseLayerSwitcher({
  map,
  isMapLoaded,
  activeLayer = "osm",
}: IBaseLayerSwitcherProps) {
  const baseLayers = BASE_LAYERS;
  const previouslyActiveLayer = useRef(activeLayer);

  // add all base layers to map
  useEffect(() => {
    if (!map || !isMapLoaded) return;

    Object.entries(baseLayers).forEach(([key, layerConfig]) => {
      if (!map.getSource(key)) {
        map.addSource(key, layerConfig.source);
      }
      if (!map.getLayer(key)) {
        map.addLayer(layerConfig.layer);
      }
      // initially hide all
      map.setLayoutProperty(key, "visibility", "none");
    });

    // show active one
    if (map.getLayer(activeLayer)) {
      map.setLayoutProperty(activeLayer, "visibility", "visible");
      previouslyActiveLayer.current = activeLayer;
    }
  }, [map, baseLayers, isMapLoaded]); // eslint-disable-line

  // change visibility layout property based on active layer
  useEffect(() => {
    if (!map || !isMapLoaded) return;

    if (previouslyActiveLayer.current !== activeLayer) {
      if (map.getLayer(previouslyActiveLayer.current)) {
        map.setLayoutProperty(
          previouslyActiveLayer.current,
          "visibility",
          "none",
        );
      }
      if (map.getLayer(activeLayer)) {
        map.setLayoutProperty(activeLayer, "visibility", "visible");
        previouslyActiveLayer.current = activeLayer;
      }
    }
  }, [map, activeLayer, isMapLoaded]);

  return null;
}
