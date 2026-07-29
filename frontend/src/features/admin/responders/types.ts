export type ResponderStatus = "AVAILABLE" | "BUSY" | "OFF_DUTY";

export interface Responder {
  id: number;
  name: string;
  email: string;
  number: string | null;
  station_id: number;
  station_name: string;
  station_category: string;
  status: ResponderStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateResponderInput {
  name: string;
  email: string;
  password: string;
  number?: string;
  station_id: number;
}

export interface UpdateResponderInput {
  station_id?: number;
  status?: ResponderStatus;
}

export interface ResponderStoreState {
  responders: Responder[];
  isLoading: boolean;
  error: string | null;
  fetchResponders: () => Promise<void>;
  addResponder: (data: CreateResponderInput) => Promise<void>;
  editResponder: (id: number, data: UpdateResponderInput) => Promise<void>;
  removeResponder: (id: number) => Promise<void>;
  setError: (error: string | null) => void;
  clearResponders: () => void;
}
