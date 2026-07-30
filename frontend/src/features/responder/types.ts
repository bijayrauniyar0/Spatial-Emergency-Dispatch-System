export interface Station {
  id: string;
  name: string;
  category: "POLICE" | "FIRE" | "MEDICAL";
}

export interface MyResponderProfile {
  id: string;
  user_id: string;
  station_id: string;
  status: "AVAILABLE" | "BUSY" | "OFF_DUTY";
  station: Station;
  has_active_task: boolean;
}

export interface StationQueueIncident {
  id: string;
  citizen_id: string;
  station_id: string;
  responder_id: string | null;
  category: "POLICE" | "FIRE" | "MEDICAL";
  status: "PENDING" | "RESPONDING" | "ARRIVED" | "RESOLVED";
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  created_at: string;
  updated_at: string;
  station: Station;
}

export interface DashboardStoreState {
  profile: MyResponderProfile | null;
  queue: StationQueueIncident[];
  myTask: StationQueueIncident | null;
  isLoading: boolean;
  error: string | null;
}
