export interface IncidentHistoryItem {
  id: number;
  citizen_id: number;
  station_id: number;
  responder_id: number | null;
  category: 'POLICE' | 'FIRE' | 'MEDICAL';
  status: 'PENDING' | 'RESPONDING' | 'ARRIVED' | 'RESOLVED';
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  station?: {
    id: number;
    name: string;
    category: string;
  };
  citizen?: {
    id: number;
    email: string;
  };
  responder?: {
    id: number;
    user: {
      id: number;
      email: string;
    };
  };
}

export interface HistoryFilters {
  status?: string;
  category?: string;
  station_id?: string;
  responder_id?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface HistoryResponse {
  data: IncidentHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface HistoryStoreState {
  incidents: IncidentHistoryItem[];
  total: number;
  page: number;
  limit: number;
  filters: HistoryFilters;
  isLoading: boolean;
  error: string | null;
  fetchIncidents: (filters?: HistoryFilters) => Promise<void>;
  setFilters: (filters: Partial<HistoryFilters>) => void;
  setError: (error: string | null) => void;
}
