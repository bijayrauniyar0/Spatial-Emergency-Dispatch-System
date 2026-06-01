"use client";

import { AxiosError } from "axios";
import { useEffect, useMemo, useRef } from "react";

import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

import { PaginatedResponse } from "@/lib/api-shared";

import { api } from "./client"; // your axios instance

export function useInfiniteScrollQuery<
  TData,
  P extends Record<string, string | number> = Record<string, string | number>,
  Q extends Record<string, unknown> = Record<string, any>,
>({
  path,
  queryParams,
  options,
  initialData,
}: {
  path: string;
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
}) {
  // wrap SSR initial data for React Query
  const infiniteInitialData = initialData
    ? { pages: [initialData], pageParams: [undefined] }
    : undefined;

  const { data, ...query } = useInfiniteQuery<
    PaginatedResponse<TData>,
    AxiosError,
    InfiniteData<PaginatedResponse<TData>>
  >({
    queryKey: [path, queryParams, ...(options?.queryKey ?? [])],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<PaginatedResponse<TData>>(path, {
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
    initialData: infiniteInitialData,
    initialPageParam: 1,
    ...options,
  });

  // intersection observer for infinite scroll
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
  }, [query]);

  const flatData = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) ?? [];
  }, [data]);

  return { ...query, loadMoreRef, flatData, data };
}
