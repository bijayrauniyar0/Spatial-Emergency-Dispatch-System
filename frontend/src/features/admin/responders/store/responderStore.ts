import { create } from "zustand";

import { responderClient } from "../services/client";
import {
  CreateResponderInput,
  ResponderStoreState,
  UpdateResponderInput,
} from "../types";

export const useResponderStore = create<ResponderStoreState>((set) => ({
  responders: [],
  isLoading: false,
  error: null,

  fetchResponders: async () => {
    set({ isLoading: true, error: null });
    try {
      const responders = await responderClient.fetchResponders();
      set({ responders, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch responders";
      set({ error: errorMessage, isLoading: false });
    }
  },

  addResponder: async (data: CreateResponderInput) => {
    set({ isLoading: true, error: null });
    try {
      await responderClient.createResponder(data);
      const responders = await responderClient.fetchResponders();
      set({ responders, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create responder";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  editResponder: async (id: number, data: UpdateResponderInput) => {
    set({ isLoading: true, error: null });
    try {
      await responderClient.updateResponder(id, data);
      const responders = await responderClient.fetchResponders();
      set({ responders, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update responder";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  removeResponder: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await responderClient.deleteResponder(id);
      const responders = await responderClient.fetchResponders();
      set({ responders, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete responder";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),

  clearResponders: () => set({ responders: [] }),
}));
