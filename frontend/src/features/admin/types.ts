export type StationCategory = "POLICE" | "FIRE" | "MEDICAL";

export interface Station {
  id: number;
  name: string;
  category: StationCategory;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface CreateStationInput {
  name: string;
  category: StationCategory;
  latitude: number;
  longitude: number;
  zoneGeoJson: GeoJSONPolygon;
}

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface AdminStoreState {
  stations: Station[];
  isLoading: boolean;
  error: string | null;
  fetchStations: () => Promise<void>;
  addStation: (data: CreateStationInput) => Promise<void>;
  setError: (error: string | null) => void;
  clearStations: () => void;
}
