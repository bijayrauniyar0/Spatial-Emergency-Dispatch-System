import { AxiosError } from "axios";

import {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export type DynamicPath = `/${string}`;

export type QueryMethod = "get";
export type MutationMethod = "post" | "patch" | "delete";
export type Method = QueryMethod | MutationMethod;
export type Paths = {
  get?: Record<string, DynamicPath>;
  post?: Record<string, DynamicPath>;
  patch?: Record<string, DynamicPath>;
  delete?: Record<string, DynamicPath>;
};
export type Config = {
  resource: string;
  rootPath?: DynamicPath;
  paths: Paths;
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string>;
  prefetch?: boolean;
};

export type HttpMethod = keyof Paths;

export type PathKey<C extends Config, M extends HttpMethod> = keyof NonNullable<
  C["paths"][M]
>;

export type GetPathKey<C extends Config> = keyof NonNullable<C["paths"]["get"]>;

export type CustomOptions<TData, TError, TSelect> = Omit<
  UseQueryOptions<TData, TError, TSelect>,
  "queryKey"
> & { queryKey?: QueryKey };

export interface PaginatedResponse<T> {
  links: {
    next: string | null;
    previous: string | null;
  };
  total_pages: number;
  count: number;
  current_page: number;
  page_size: number;
  results: T[];
}

export type InfiniteScrollQueryArgs<
  TPage,
  Q extends Record<string, unknown> = Record<string, never>,
> = {
  path: string;
  queryParams?: Q;
  options?: Omit<
    UseInfiniteQueryOptions<TPage, AxiosError, InfiniteData<TPage>>,
    "getNextPageParam" | "initialData" | "initialPageParam"
  >;
  getNextPageParam: (lastPage: TPage, allPages: TPage[]) => unknown;
  initialData?: TPage; // optional SSR initial page
};
