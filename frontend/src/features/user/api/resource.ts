import { makeClientApiResource } from "@/lib/api-client";

import { userConfig } from "./config";

export const userResource = makeClientApiResource(userConfig);
