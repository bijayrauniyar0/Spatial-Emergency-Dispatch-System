import { api } from "@/lib/api-client/client";

import { CreateStationInput, Station } from "../types";

export const adminClient = {
  async fetchStations(): Promise<Station[]> {
    const response = await api.get<{
      message: string;
      data: Station[];
    }>("/admin/stations");
    return response.data.data;
  },

  async createStation(data: CreateStationInput): Promise<Station> {
    const response = await api.post<{
      message: string;
      data: { station: Station };
    }>("/admin/stations", data);
    return response.data.data.station;
  },
};
