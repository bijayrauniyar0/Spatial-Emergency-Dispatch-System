import { Config } from "@/lib/api-shared";

export const userConfig: Config = {
  resource: "user",
  paths: {
    get: {
      profile: "/user/profile",
      publicProfile: "/user/:user_id",
    },
  },
};
