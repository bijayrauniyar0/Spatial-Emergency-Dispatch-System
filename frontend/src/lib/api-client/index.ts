import { Config } from "@/lib/api-shared";

import {
  createUseApiInfiniteQuery,
  createUseApiMutation,
  createUseApiQuery,
  createUseInvalidateAll,
} from "./hooks";

export const makeClientApiResource = (config: Config) => {
  const hooks = {
    useApiQuery: createUseApiQuery(config),
    useApiMutation: createUseApiMutation(config),
    useInvalidateAll: createUseInvalidateAll(config),
    useInfiniteApiQuery: createUseApiInfiniteQuery(config),
  };
  return hooks;
};
