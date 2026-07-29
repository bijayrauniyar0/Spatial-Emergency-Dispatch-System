export type IncidentCategory = 'POLICE' | 'FIRE' | 'MEDICAL';

export interface Incident {
  id: number;
  citizen_id: number;
  station_id: number;
  responder_id: number | null;
  category: IncidentCategory;
  status: 'PENDING' | 'RESPONDING' | 'RESOLVED';
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  Station?: {
    id: number;
    name: string;
    category: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateIncidentInput {
  category: IncidentCategory;
  latitude: number;
  longitude: number;
}

export interface IncidentStoreState {
  activeIncident: Incident | null;
  isLoading: boolean;
  error: string | null;
  fetchActiveIncident: () => Promise<void>;
  submitIncident: (data: CreateIncidentInput) => Promise<Incident>;
  setError: (error: string | null) => void;
  clearIncident: () => void;
}
