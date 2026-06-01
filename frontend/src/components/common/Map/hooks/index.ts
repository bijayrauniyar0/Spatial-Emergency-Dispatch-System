"use client";

import { Map, NavigationControl } from "maplibre-gl";
import { useEffect, useState } from "react";

import { IMapOptions, MapInstanceType } from "../types";

export default function useMapLibreGLMap({
  mapOptions,
  enable3D = false,
  fullscreen = false,
  disableRotation = false,
  containerId = "maplibre-gl-map",
}: IMapOptions) {
  const [map, setMap] = useState<MapInstanceType | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [isMapIdle, setIsMapIdle] = useState(false);

  // setup map instance
  useEffect(() => {
    const mapInstance = new Map({
      container: containerId,
      style: { version: 8, sources: {}, layers: [] },
      center: [0, 0],
      zoom: 1,
      attributionControl: false,
      ...mapOptions,
    });

    setMap(mapInstance);

    mapInstance.on("load", () => {
      setIsMapLoaded(true);
    });

    return () => {
      if (mapInstance) mapInstance.remove();
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!map) return;
    const idleHandler = () => setIsMapIdle(true);
    map.on("idle", idleHandler);
    return () => {
      map.off("idle", idleHandler);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const nav = new NavigationControl({
      showCompass: false,
      showZoom: false,
    });
    map.addControl(nav, "top-right");
    return () => {
      map.removeControl(nav);
    };
  }, [map]);

  // add terrain source for 3D
  useEffect(() => {
    if (!map) return;
    const loadHandler = () => {
      if (!map.getSource("terrainSource")) {
        map.addSource("terrainSource", {
          type: "raster-dem",
          tiles: ["https://vtc-cdn.maptoolkit.net/terrainrgb/{z}/{x}/{y}.webp"],
          encoding: "mapbox",
          maxzoom: 14,
          minzoom: 4,
        });
      }
    };
    if (map.loaded()) {
      loadHandler();
    } else {
      map.on("load", loadHandler);
    }
  }, [map]);

  // add 3D terrain
  useEffect(() => {
    if (!map || !isMapLoaded) return;
    if (enable3D) {
      map.setTerrain({ source: "terrainSource", exaggeration: 0.6 });
    } else {
      map.setTerrain(null);
    }
  }, [map, isMapLoaded, enable3D]);

  // toggle fullscreen
  useEffect(() => {
    if (!map) return;
    if (fullscreen) {
      map
        .getContainer()
        .requestFullscreen()
        .catch(() => {});
    } else if (
      !fullscreen &&
      document.fullscreenElement === map.getContainer()
    ) {
      document.exitFullscreen().catch(() => {});
    }
  }, [map, fullscreen]);

  // disable map pane rotation
  useEffect(() => {
    if (!map) return;
    if (disableRotation) {
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();
    } else {
      map.dragRotate.enable();
      map.touchZoomRotate.enableRotation();
    }
  }, [map, disableRotation]);

  return { map, isMapLoaded, isMapIdle };
}
