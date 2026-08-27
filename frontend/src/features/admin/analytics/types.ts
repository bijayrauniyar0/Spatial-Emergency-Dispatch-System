export interface SummaryMetrics {
  total_incidents: number;
  active_incidents: number;
  avg_dispatch_seconds: number;
  avg_resolution_seconds: number;
}

export interface VolumeByDay {
  date: string;
  count: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
}

export interface StationMetrics {
  station_id: number;
  station_name: string;
  count: number;
  avg_resolution_seconds: number;
}

export interface ResponderMetrics {
  responder_id: number;
  responder_name: string;
  claimed: number;
  resolved: number;
  avg_resolution_seconds: number;
}

export interface AnalyticsData {
  summary: SummaryMetrics;
  volumeByDay: VolumeByDay[];
  byCategory: CategoryDistribution[];
  byStation: StationMetrics[];
  byResponder: ResponderMetrics[];
  period: {
    from: string;
    to: string;
  };
}

export interface AnalyticsStoreState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  dateRange: { from: string; to: string };
  fetchAnalytics: (from?: string, to?: string) => Promise<void>;
  setError: (error: string | null) => void;
}
