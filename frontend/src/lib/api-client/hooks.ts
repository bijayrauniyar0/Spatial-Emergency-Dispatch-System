import { AxiosError, RawAxiosRequestHeaders } from "axios";
import { useEffect, useMemo, useRef } from "react";

import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Config,
  CustomOptions,
  MutationMethod,
  PaginatedResponse,
} from "@/lib/api-shared";
import { resolvePath } from "@/lib/api-shared";

import { api } from "./client";

/**
 * Generic query hook
 * @param queryParams - optional typed query params
 * @param options - optional useQuery options
 */
export const createUseApiQuery = (config: Config) => {
  return <
    TData = unknown,
    TSelect = TData,
    P extends Record<string, string | number> = Record<string, string | number>,
    Q extends Record<string, unknown> = Record<string, unknown>,
  >({
    pathParams,
    queryParams,
    options,
    pathKey,
  }: {
    pathParams?: P;
    queryParams?: Q;
    options?: CustomOptions<TData, AxiosError, TSelect>;
    pathKey: string;
  }) => {
    const path = config.paths?.get?.[pathKey];
    if (!path) {
      throw new Error("GET BY ID path is not defined in the config");
    }
    const resolvedPath = resolvePath(path, pathParams, config.rootPath);
    return useQuery<TData, AxiosError, TSelect>({
      queryKey: [config.resource, pathKey, pathParams],
      queryFn: async () => {
        const response = await api.get<TData>(resolvedPath, {
          params: queryParams,
        });
        return response.data;
      },
      ...options,
    });
  };
};

export const createUseApiInfiniteQuery = (config: Config) => {
  return <
    TData,
    P extends Record<string, string | number> = Record<string, string | number>,
    Q extends Record<string, unknown> = Record<string, unknown>,
  >({
    pathKey,
    pathParams,
    queryParams,
    options,
    initialData,
  }: {
    pathKey: string;
    pathParams?: P;
    queryParams?: Q;
    options?: Omit<
      UseInfiniteQueryOptions<
        PaginatedResponse<TData>,
        AxiosError,
        InfiniteData<PaginatedResponse<TData>>
      >,
      | "queryKey"
      | "queryFn"
      | "getNextPageParam"
      | "initialPageParam"
      | "initialData"
    > & { queryKey?: QueryKey };
    initialData?: PaginatedResponse<TData>;
  }) => {
    const path = config.paths?.get?.[pathKey];
    if (!path) throw new Error(`${pathKey}'s url path not defined`);
    const resolvedPath = resolvePath(path, pathParams, config.rootPath);

    const { data, ...query } = useInfiniteQuery<
      PaginatedResponse<TData>, // TQueryFnData
      AxiosError, // TError
      InfiniteData<PaginatedResponse<TData>> // TData (The shape of 'data' returned by the hook)
    >({
      queryKey: [config.resource, "infinite", pathParams, queryParams],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await api.get<PaginatedResponse<TData>>(resolvedPath, {
          params: { ...queryParams, page: pageParam },
        });
        return res.data;
      },
      getNextPageParam: (lastPage) => {
        const nextUrl = lastPage.links.next;
        if (!nextUrl) return undefined;

        try {
          const url = new URL(nextUrl);
          const nextPage = url.searchParams.get("page");
          return nextPage ? Number(nextPage) : undefined;
        } catch {
          return undefined;
        }
      },
      initialData: initialData
        ? { pages: [initialData], pageParams: [1] }
        : undefined,
      initialPageParam: 1,
      ...options,
      ...options,
    });
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!loadMoreRef.current) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              query.hasNextPage &&
              !query.isFetchingNextPage
            ) {
              query.fetchNextPage();
            }
          });
        },
        { rootMargin: "100px" },
      );
      observer.observe(loadMoreRef.current);
      return () => observer.disconnect();
    }, [query.hasNextPage, query.isFetchingNextPage]);

    // flatten all results arrays from pages
    const flatData = useMemo(() => {
      return data?.pages.flatMap((page) => page.results) ?? [];
    }, [data]);

    return { ...query, data, loadMoreRef, flatData };
  };
};
export const createUseApiMutation = (config: Config) => {
  return <
    Payload = unknown,
    T = unknown,
    P extends Record<string, string | number> = Record<string, string | number>,
    Q extends Record<string, unknown> = Record<string, unknown>,
  >({
    method = "post",
    pathParams,
    queryParams,
    options,
    pathKey,
    headers, // Added headers prop here
  }: {
    method?: MutationMethod;
    pathParams?: P;
    queryParams?: Q;
    options?: UseMutationOptions<T, AxiosError, Payload>;
    pathKey: string;
    headers?: RawAxiosRequestHeaders; // Type for custom headers
  }) => {
    const path = config.paths?.[method]?.[pathKey];

    if (!path) {
      throw new Error(
        `${method.toUpperCase()} path is not defined in the config`,
      );
    }

    const resolvedPath = resolvePath(path, pathParams, config.rootPath);

    return useMutation<T, AxiosError, Payload>({
      mutationFn: async (payload?: Payload) => {
        const axiosConfig = {
          params: queryParams,
          headers,
        };

        if (method === "delete") {
          // Note: delete usually takes config as the 2nd argument
          const response = await api[method]<T>(resolvedPath, axiosConfig);
          return response.data;
        }

        // POST, PUT, PATCH take payload as 2nd arg and config as 3rd
        const response = await api[method]<T>(
          resolvedPath,
          payload,
          axiosConfig,
        );
        return response.data;
      },
      ...options,
    });
  };
};

export const createUseInvalidateAll = (config: Config) => {
  return () => {
    const queryClient = useQueryClient();
    return () => {
      queryClient.invalidateQueries({ queryKey: [config.resource] });
    };
  };
};
