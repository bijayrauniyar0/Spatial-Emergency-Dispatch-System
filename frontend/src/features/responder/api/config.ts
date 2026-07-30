import { Config } from "@/lib/api-shared";

export const responderConfig: Config = {
  resource: "responder",
  paths: {
    get: {
      getMyProfile: "/responders/me",
      getStationQueue: "/incidents/station-queue",
      getMyTask: "/incidents/my-task",
    },
    patch: {
      claimIncident: "/incidents/:id/claim",
    },
  },
};
