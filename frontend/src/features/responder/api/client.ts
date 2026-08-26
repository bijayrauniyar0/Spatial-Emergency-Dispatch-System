import { api } from "@/lib/api-client/client";
import { MyResponderProfile, StationQueueIncident } from "../types";

export const responderDashboardClient = {
  async getMyProfile(): Promise<MyResponderProfile> {
    const response = await api.get<{
      message: string;
      data: MyResponderProfile;
    }>("/responders/me");
    return response.data.data;
  },

  async getStationQueue(): Promise<StationQueueIncident[]> {
    const response = await api.get<{
      message: string;
      data: StationQueueIncident[];
    }>("/incidents/station-queue");
    return response.data.data || [];
  },

  async getMyTask(): Promise<StationQueueIncident | null> {
    const response = await api.get<{
      message: string;
      data: StationQueueIncident | null;
    }>("/incidents/my-task");
    return response.data.data || null;
  },

  async claimIncident(incidentId: string): Promise<StationQueueIncident> {
    const response = await api.patch<{
      message: string;
      data: StationQueueIncident;
    }>(`/incidents/${incidentId}/claim`);
    return response.data.data;
  },

  async arriveIncident(incidentId: string): Promise<StationQueueIncident> {
    const response = await api.patch<{
      message: string;
      data: StationQueueIncident;
    }>(`/incidents/${incidentId}/arrive`);
    return response.data.data;
  },

  async resolveIncident(incidentId: string): Promise<StationQueueIncident> {
    const response = await api.patch<{
      message: string;
      data: StationQueueIncident;
    }>(`/incidents/${incidentId}/resolve`);
    return response.data.data;
  },

  async getIncidentById(incidentId: string): Promise<StationQueueIncident> {
    const response = await api.get<{
      message: string;
      data: StationQueueIncident;
    }>(`/incidents/${incidentId}`);
    return response.data.data;
  },
};
