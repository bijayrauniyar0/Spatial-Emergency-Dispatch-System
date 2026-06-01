import type { LayerSpecification, SourceSpecification } from "maplibre-gl";

export const LINE_STRING_TYPES = ["LineString", "MultiLineString"];
export const POLYGON_TYPES = ["Polygon", "MultiPolygon"];

export interface BaseLayerConfig {
  source: SourceSpecification;
  layer: LayerSpecification;
}

export const BASE_LAYERS: Record<string, BaseLayerConfig> = {
  osm: {
    source: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        'Map tiles by <a target="_top" rel="noopener" href="https://tile.openstreetmap.org/">OpenStreetMap tile servers</a>, under the <a target="_top" rel="noopener" href="https://operations.osmfoundation.org/policies/tiles/">tile usage policy</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>',
    },
    layer: {
      id: "osm",
      type: "raster",
      source: "osm",
      layout: {
        visibility: "none",
      },
    } as LayerSpecification,
  },
  "osm-light": {
    source: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        'Map tiles by <a target="_top" rel="noopener" href="https://tile.openstreetmap.org/">OpenStreetMap tile servers</a>, under the <a target="_top" rel="noopener" href="https://operations.osmfoundation.org/policies/tiles/">tile usage policy</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>',
      maxzoom: 18,
    },
    layer: {
      id: "osm-light",
      type: "raster",
      source: "osm-light",
      layout: {
        visibility: "none",
      },
    } as LayerSpecification,
  },
  satellite: {
    source: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "ArcGIS",
      maxzoom: 18,
    } as SourceSpecification,
    layer: {
      id: "satellite",
      type: "raster",
      source: "satellite",
      layout: {
        visibility: "none",
      },
    } as LayerSpecification,
  },
  topo: {
    source: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      ],
      attribution: "ArcGIS",
    } as SourceSpecification,
    layer: {
      id: "topo",
      type: "raster",
      source: "topo",
      layout: {
        visibility: "none",
      },
    } as LayerSpecification,
  },
  hybrid: {
    source: {
      type: "raster",
      tiles: ["https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"],
      attribution: "ArcGIS",
    } as SourceSpecification,
    layer: {
      id: "hybrid",
      type: "raster",
      source: "hybrid",
      layout: {
        visibility: "none",
      },
    } as LayerSpecification,
  },
};

export const BASE_LAYERS_LIST = [
  {
    id: "osm",
    name: "OSM",
    image: "/assets/images/map/osm.png",
  },
  {
    id: "satellite",
    name: "Satellite",
    image: "/assets/images/map/satellite.png",
  },
  {
    id: "topo",
    name: "Outdoor",
    image: "/assets/images/map/outdoor.png",
  },
  {
    id: "osm-light",
    name: "OSM light",
    image: "/assets/images/map/osmLight.png",
  },
  {
    id: "none",
    name: "None",
    image: "/assets/images/map/none.png",
  },
];
