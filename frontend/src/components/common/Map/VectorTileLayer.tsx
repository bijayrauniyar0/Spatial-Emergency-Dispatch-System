/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { LayerSpecification, MapMouseEvent } from "maplibre-gl";
import { memo, useEffect, useMemo } from "react";

import { IVectorTileLayerProps } from "./types";

function VectorTileLayer({
  map,
  id,
  url,
  isMapLoaded,
  layerOptions,
  visibleOnMap = true,
  interactions = [],
  onFeatureSelect,
  sourceLayer = "default",
  layerType = "fill",
  onMouseLeave,
  onMouseMove,
}: IVectorTileLayerProps) {
  const sourceId = useMemo(() => id, [id]);
  // add source to map
  useEffect(() => {
    if (!map || !isMapLoaded) return;
    map.setGlyphs(
      "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    );

    // Add source only if it doesn't exist
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "vector",
        tiles: [url],
      });
    }

    // Add layer only if it doesn't exist
    if (visibleOnMap && !map.getLayer(sourceId)) {
      map.addLayer({
        id: sourceId,
        type: layerType,
        source: sourceId,
        "source-layer": sourceLayer,
        ...layerOptions,
      } as LayerSpecification);
    }

    return () => {
      if (map.getLayer(sourceId)) {
        map.removeLayer(sourceId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [
    map,
    isMapLoaded,
    sourceId,
    url,
    visibleOnMap,
    sourceLayer,
    layerOptions,
    layerType,
  ]);

  // change cursor to pointer on feature hover
  useEffect(() => {
    if (!map || !onMouseLeave || !onMouseMove) return () => {};
    map.on("mousemove", sourceId, onMouseMove);
    map.on("mouseleave", sourceId, onMouseLeave);

    // remove event handlers on unmount
    return () => {
      map.off("mousemove", sourceId, onMouseMove);
      map.off("mouseleave", sourceId, onMouseLeave);
    };
  }, [map, onMouseLeave, onMouseMove, sourceId]);

  // add select interaction & return properties on feature select
  useEffect(() => {
    if (!map || !interactions.includes("select")) return () => {};
    function handleSelectInteraction(event: MapMouseEvent) {
      if (!map) return;
      map.getCanvas().style.cursor = "pointer";
      // @ts-ignore
      const { features } = event;
      if (!features?.length) return;
      const { properties } = features[0];
      onFeatureSelect?.(properties);
    }
    map.on("click", sourceId, handleSelectInteraction);
    return () => map.off("click", sourceId, handleSelectInteraction);
  }, [map, interactions, sourceId]); // eslint-disable-line

  return null;
}

export default memo(VectorTileLayer);
