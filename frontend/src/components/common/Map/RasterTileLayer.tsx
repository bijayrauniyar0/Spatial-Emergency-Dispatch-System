import { memo, useEffect, useMemo } from "react";

import { NEPAL_BOUNDS_ARRAY } from "@/constants/map";

import { IRasterTileLayerProps } from "./types";

function RasterTileLayer({
  map,
  id,
  url,
  isMapLoaded,
  visibleOnMap = true,
  tileSize = 256,
  minZoom = 0,
  maxZoom = 22,
  opacity = 1,
  bounds = NEPAL_BOUNDS_ARRAY,
}: IRasterTileLayerProps) {
  const sourceId = useMemo(() => id, [id]);

  useEffect(() => {
    if (!map || !isMapLoaded) return;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "raster",
        tiles: [url],
        tileSize,
        minzoom: minZoom,
        maxzoom: maxZoom,
        bounds,
      });
    }

    if (visibleOnMap && !map.getLayer(sourceId)) {
      map.addLayer({
        id: sourceId,
        type: "raster",
        source: sourceId,
        paint: {
          "raster-opacity": opacity,
        },
      });
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
    tileSize,
    visibleOnMap,
    minZoom,
    maxZoom,
    opacity,
    bounds,
  ]);

  return null;
}

export default memo(RasterTileLayer);
