import type { Feature } from "geojson";
import {
  LayerSpecification,
  LngLatBoundsLike,
  MapMouseEvent,
} from "maplibre-gl";
import { useEffect, useMemo } from "react";

import getBbox from "@turf/bbox";

import { IVectorLayerProps } from "./types";

export default function VectorLayer({
  map,
  id,
  geojson,
  isMapLoaded,
  layerOptions,
  visibleOnMap = true,
  zoomToLayer = false,
  onClickFeature,
  onMouseEnter,
  onMouseLeave,
}: IVectorLayerProps) {
  const sourceId = useMemo(() => id, [id]);

  useEffect(() => {
    if (!map || !isMapLoaded) return;

    const cleanup = () => {
      map.off("click", sourceId, handleClick);
      map.off("mouseenter", sourceId, handleMouseEnter);
      map.off("mouseleave", sourceId, handleMouseLeave);

      if (map.getLayer(sourceId)) map.removeLayer(sourceId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };

    const handleClick = (e: MapMouseEvent) => {
      if (onClickFeature) onClickFeature(e);
    };

    const handleMouseEnter = (e: MapMouseEvent) => {
      map.getCanvas().style.cursor = "pointer";
      if (onMouseEnter) onMouseEnter(e);
    };

    const handleMouseLeave = (e: MapMouseEvent) => {
      map.getCanvas().style.cursor = "";
      if (onMouseLeave) onMouseLeave(e);
    };

    cleanup();

    map.setGlyphs(
      "https://openmaptiles.geo.data.gouv.fr/fonts/{fontstack}/{range}.pbf",
    );

    map.addSource(sourceId, {
      type: "geojson",
      data: geojson,
    });

    if (visibleOnMap) {
      map.addLayer({
        id: sourceId,
        type: "circle",
        source: sourceId,
        layout: {},
        ...layerOptions,
      } as LayerSpecification); // Use LayerSpecification instead of any
    }

    map.on("click", sourceId, handleClick);
    map.on("mouseenter", sourceId, handleMouseEnter);
    map.on("mouseleave", sourceId, handleMouseLeave);

    if (zoomToLayer && geojson?.features?.length) {
      const geometryFilterGeojson = geojson.features.filter(
        (feature: Feature) => !!feature.geometry,
      );
      if (geometryFilterGeojson.length) {
        const bbox = getBbox({
          type: "FeatureCollection",
          features: geometryFilterGeojson,
        });
        map.fitBounds(bbox as LngLatBoundsLike, {
          duration: 1500,
          padding: 150,
        });
      }
    }

    return () => {
      cleanup();
    };
  }, [
    map,
    sourceId,
    geojson,
    layerOptions,
    visibleOnMap,
    zoomToLayer,
    isMapLoaded,
    onClickFeature,
    onMouseEnter,
    onMouseLeave,
  ]);

  return null;
}
