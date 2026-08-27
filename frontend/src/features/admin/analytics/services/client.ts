import { AnalyticsData } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

export const analyticsClient = {
  fetchAnalytics: async (from?: string, to?: string): Promise<AnalyticsData> => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);

    const response = await fetch(
      `${API_URL}/admin/analytics?${params.toString()}`,
      { credentials: 'include' },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch analytics: ${response.statusText}`);
    }

    return response.json();
  },
};
