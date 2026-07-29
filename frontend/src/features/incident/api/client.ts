import { api } from "@/lib/api-client/client";
import { CreateIncidentInput, Incident } from "../types";

export const incidentClient = {
  async createIncident(data: CreateIncidentInput): Promise<Incident> {
    const response = await api.post<{
      message: string;
      data: Incident;
    }>("/incidents", data);
    return response.data.data;
  },

  async getActiveIncident(): Promise<Incident | null> {
    const response = await api.get<{
      message: string;
      data: Incident | null;
    }>("/incidents/active");
    return response.data.data;
  },
};
