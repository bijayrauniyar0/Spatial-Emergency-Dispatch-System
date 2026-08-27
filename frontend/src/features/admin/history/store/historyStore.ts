import { create } from 'zustand';
import { historyClient } from '../services/client';
import { HistoryStoreState, HistoryFilters } from '../types';

export const useHistoryStore = create<HistoryStoreState>((set) => ({
  incidents: [],
  total: 0,
  page: 1,
  limit: 20,
  filters: { page: 1, limit: 20 },
  isLoading: false,
  error: null,

  fetchIncidents: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await historyClient.fetchIncidents(filters);
      set({
        incidents: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch incidents';
      set({ error: errorMessage, isLoading: false });
    }
  },

  setFilters: (newFilters: Partial<HistoryFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  setError: (error: string | null) => set({ error }),
}));
