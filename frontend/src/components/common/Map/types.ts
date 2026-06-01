import type { FeatureCollection } from "geojson";
import type {
  LayerSpecification,
  Map,
  MapMouseEvent,
  MapOptions,
  SourceSpecification,
} from "maplibre-gl";
import type { CSSProperties, ReactNode } from "react";

export type MapInstanceType = Map;

export interface IMapOptions {
  mapOptions?: Partial<MapOptions>;
  enable3D?: boolean;
  fullscreen?: boolean;
  disableRotation?: boolean;
  containerId?: string;
}

export interface IMapContainerProps {
  children?: ReactNode;
  map: MapInstanceType | null;
  isMapLoaded: boolean;
  style?: CSSProperties;
  className?: string;
  id?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export interface IBaseLayerSwitcherProps {
  map: MapInstanceType;
  activeLayer?: string;
  isMapLoaded?: boolean;
}

export interface ILayerProps {
  id: string;
  map?: MapInstanceType | null;
  isMapLoaded?: boolean;
  visibleOnMap?: boolean;
  layerOptions?: Partial<LayerSpecification>;
  sourceOptions?: Partial<SourceSpecification>;
}

export interface IVectorLayerProps extends ILayerProps {
  geojson: FeatureCollection;
  zoomToLayer?: boolean;
  onClickFeature?: (e: MapMouseEvent) => void;
  onMouseEnter?: (e: MapMouseEvent) => void;
  onMouseLeave?: (e: MapMouseEvent) => void;
}

export type InteractionsType = "hover" | "select";

export interface IVectorTileLayerProps extends ILayerProps {
  url: string;
  sourceLayer?: string;
  interactions?: InteractionsType[];
  onFeatureSelect?: (properties: Record<string, any>) => void;
  onMouseMove?: (e: MapMouseEvent) => void;
  onMouseLeave?: (e: MapMouseEvent) => void;
  layerType?: LayerSpecification["type"];
}

export interface IRasterTileLayerProps extends ILayerProps {
  url: string;
  tileSize?: number;
  minZoom?: number;
  maxZoom?: number;
  opacity?: number;
  bounds?: [number, number, number, number];
}
