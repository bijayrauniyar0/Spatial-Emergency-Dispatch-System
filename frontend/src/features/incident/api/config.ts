import { Config } from "@/lib/api-shared";

export const incidentConfig: Config = {
  resource: "incident",
  paths: {
    post: {
      createIncident: "/incidents",
    },
    get: {
      getActiveIncident: "/incidents/active",
      streamIncident: "/incidents/stream",
    },
  },
};
