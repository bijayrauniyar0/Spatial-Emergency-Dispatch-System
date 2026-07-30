import { create } from "zustand";

import { api } from "@/lib/api-client/client";

import {
  CreateIncidentInput,
  Incident,
  IncidentStoreState,
} from "../types";

export const useIncidentStore = create<IncidentStoreState>((set) => ({
  activeIncident: null,
  isLoading: false,
  error: null,

  fetchActiveIncident: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{
        message: string;
        data: Incident | null;
      }>("/incidents/my-request");
      set({ activeIncident: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch active incident";
      set({ error: errorMessage, isLoading: false });
    }
  },

  submitIncident: async (data: CreateIncidentInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<{
        message: string;
        data: Incident;
      }>("/incidents", data);
      set({ activeIncident: response.data.data, isLoading: false });
      return response.data.data;
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
