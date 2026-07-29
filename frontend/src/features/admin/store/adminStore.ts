import { create } from "zustand";

import { adminClient } from "../services/client";
import { AdminStoreState, CreateStationInput } from "../types";

export const useAdminStore = create<AdminStoreState>((set) => ({
  stations: [],
  isLoading: false,
  error: null,

  fetchStations: async () => {
    set({ isLoading: true, error: null });
    try {
      const stations = await adminClient.fetchStations();
      set({ stations, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch stations";
      set({ error: errorMessage, isLoading: false });
    }
  },

  addStation: async (data: CreateStationInput) => {
    set({ isLoading: true, error: null });
    try {
      await adminClient.createStation(data);
      // Refresh the station list after successful creation
      const stations = await adminClient.fetchStations();
      set({ stations, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create station";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),

  clearStations: () => set({ stations: [] }),
}));
