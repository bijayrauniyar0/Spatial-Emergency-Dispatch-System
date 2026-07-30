import { makeClientApiResource } from "@/lib/api-client";

import { incidentConfig } from "./config";

export const incidentResource = makeClientApiResource(incidentConfig);
