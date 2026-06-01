import { makeClientApiResource } from "@/lib/api-client";

import { authConfig } from "./config";

export const authResource = makeClientApiResource(authConfig);
