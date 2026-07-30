import { makeClientApiResource } from "@/lib/api-client";

import { responderConfig } from "./config";

export const responderResource = makeClientApiResource(responderConfig);
