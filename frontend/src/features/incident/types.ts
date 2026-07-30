export type IncidentCategory = 'POLICE' | 'FIRE' | 'MEDICAL';

export interface Incident {
  id: number;
  citizen_id: number;
  station_id: number;
  responder_id: number | null;
  category: IncidentCategory;
  status: 'PENDING' | 'RESPONDING' | 'ARRIVED' | 'RESOLVED';
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  Station?: {
    id: number;
    name: string;
    category: string;
  };
  Responder?: {
    id: number;
    status: string;
    User?: {
      id: number;
      name: string;
      number: string | null;
    };
  };
  created_at: string;
  accepted_at?: string | null;
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
