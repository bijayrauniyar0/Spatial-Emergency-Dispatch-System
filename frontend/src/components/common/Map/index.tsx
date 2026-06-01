"use client";

import { useState } from "react";

import BaseLayerSwitcher from "./BaseLayerSwitcher";
import useMapLibreGLMap from "./hooks";
import MapContainer from "./MapContainer";
import MapTools from "./MapTools";
import { IMapOptions } from "./types";

interface MapProps extends IMapOptions {
  children?: React.ReactNode;
}

export default function MapComponent({ children, ...mapOptions }: MapProps) {
  const { map, isMapLoaded } = useMapLibreGLMap(mapOptions);
  const [activeBaseLayer, setActiveBaseLayer] = useState("osm");

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <MapContainer
        map={map}
        isMapLoaded={isMapLoaded}
        className="h-full w-full"
      >
        {/* Child components like Layers can be passed here */}

        {/* Helper components that react to map state */}
        <BaseLayerSwitcher
          map={map!}
          isMapLoaded={isMapLoaded}
          activeLayer={activeBaseLayer}
        />
        {children}
      </MapContainer>

      {isMapLoaded && (
        <MapTools
          map={map}
          activeLayer={activeBaseLayer}
          onLayerChange={setActiveBaseLayer}
        />
      )}
    </div>
  );
}

// Re-export useful items
export { default as useMapLibreGLMap } from "./hooks";
export type { PopupActions, PopupData, PopupProps } from "./Popup";
export { default as Popup } from "./Popup";
export { default as TileLayer } from "./RasterTileLayer";
export * from "./types";
export { default as VectorLayer } from "./VectorLayer";
export { default as VectorTileLayer } from "./VectorTileLayer";
