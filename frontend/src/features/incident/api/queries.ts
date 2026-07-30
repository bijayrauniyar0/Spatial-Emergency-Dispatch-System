import { incidentResource } from "./resource";
import { CreateIncidentInput, Incident } from "../types";

export const useCreateIncident = () => {
  return incidentResource.useApiMutation<CreateIncidentInput>({
    pathKey: "createIncident",
  });
};

export const useGetMyRequest = () => {
  return incidentResource.useApiQuery<Incident | null>({
    pathKey: "getActiveIncident",
  });
};
