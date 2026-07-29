import { create } from "zustand";
import { IncidentStoreState, CreateIncidentInput, Incident } from "../types";
import { incidentClient } from "../api/client";

export const useIncidentStore = create<IncidentStoreState>((set) => ({
  activeIncident: null,
  isLoading: false,
  error: null,

  fetchActiveIncident: async () => {
    set({ isLoading: true, error: null });
    try {
      const incident = await incidentClient.getActiveIncident();
      set({ activeIncident: incident, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch active incident";
      set({ error: errorMessage, isLoading: false });
    }
  },

  submitIncident: async (data: CreateIncidentInput) => {
    set({ isLoading: true, error: null });
    try {
      const incident = await incidentClient.createIncident(data);
      set({ activeIncident: incident, isLoading: false });
      return incident;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit incident";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),

  clearIncident: () => set({ activeIncident: null }),
}));
