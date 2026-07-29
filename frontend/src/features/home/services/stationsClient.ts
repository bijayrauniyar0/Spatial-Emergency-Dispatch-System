import { api } from "@/lib/api-client/client";

export const stationsClient = {
  async fetchStationsGeoJSON(
    categories?: string,
  ): Promise<GeoJSON.FeatureCollection> {
    const params = categories ? { categories } : {};
    const response = await api.get<GeoJSON.FeatureCollection>(
      "/admin/stations/geojson",
      { params },
    );
    return response.data;
  },

  async fetchZonesGeoJSON(
    categories?: string,
  ): Promise<GeoJSON.FeatureCollection> {
    const params = categories ? { categories } : {};
    const response = await api.get<GeoJSON.FeatureCollection>(
      "/admin/zones/geojson",
      { params },
    );
    return response.data;
  },
};
