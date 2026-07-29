import { api } from "@/lib/api-client/client";

import {
  CreateResponderInput,
  Responder,
  UpdateResponderInput,
} from "../types";

export const responderClient = {
  async fetchResponders(): Promise<Responder[]> {
    const response = await api.get<{
      message: string;
      data: Responder[];
    }>("/admin/responders");
    return response.data.data;
  },

  async createResponder(data: CreateResponderInput): Promise<Responder> {
    const response = await api.post<{
      message: string;
      data: Responder;
    }>("/admin/responders", data);
    return response.data.data;
  },

  async updateResponder(
    id: number,
    data: UpdateResponderInput,
  ): Promise<Responder> {
    const response = await api.patch<{
      message: string;
      data: Responder;
    }>(`/admin/responders/${id}`, data);
    return response.data.data;
  },

  async deleteResponder(id: number): Promise<void> {
    await api.delete(`/admin/responders/${id}`);
  },
};
