import { HistoryResponse, HistoryFilters } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

export const historyClient = {
  fetchIncidents: async (filters?: HistoryFilters): Promise<HistoryResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.station_id) params.append('station_id', filters.station_id);
      if (filters.responder_id) params.append('responder_id', filters.responder_id);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
    }

    const response = await fetch(
      `${API_URL}/admin/incidents?${params.toString()}`,
      { credentials: 'include' },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch incidents: ${response.statusText}`);
    }

    return response.json();
  },
};
