import { create } from 'zustand';
import { analyticsClient } from '../services/client';
import { AnalyticsStoreState } from '../types';

export const useAnalyticsStore = create<AnalyticsStoreState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  dateRange: {
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  },

  fetchAnalytics: async (from, to) => {
    set({ isLoading: true, error: null });
    try {
      const data = await analyticsClient.fetchAnalytics(from, to);
      set({ data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics';
      set({ error: errorMessage, isLoading: false });
    }
  },

  setError: (error: string | null) => set({ error }),
}));
