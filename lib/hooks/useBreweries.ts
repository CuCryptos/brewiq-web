"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { breweriesApi, type BrewerySearchParams } from "@/lib/api/breweries";

export const breweryKeys = {
  all: ["breweries"] as const,
  lists: () => [...breweryKeys.all, "list"] as const,
  list: (params: BrewerySearchParams) => [...breweryKeys.lists(), params] as const,
  details: () => [...breweryKeys.all, "detail"] as const,
  detail: (slug: string) => [...breweryKeys.details(), slug] as const,
  beers: (id: string) => [...breweryKeys.all, id, "beers"] as const,
  popular: () => [...breweryKeys.all, "popular"] as const,
  nearby: (lat: number, lon: number) => [...breweryKeys.all, "nearby", lat, lon] as const,
};

export function useBreweries(params: BrewerySearchParams = {}) {
  return useQuery({
    queryKey: breweryKeys.list(params),
    queryFn: () => breweriesApi.search(params),
    staleTime: 300000,
  });
}

export function useInfiniteBreweries(params: Omit<BrewerySearchParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: [...breweryKeys.lists(), "infinite", params],
    queryFn: ({ pageParam = 1 }) => breweriesApi.search({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useBrewery(slug: string) {
  return useQuery({
    queryKey: breweryKeys.detail(slug),
    queryFn: () => breweriesApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 300000,
  });
}

export function useBreweryBeers(breweryId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [...breweryKeys.beers(breweryId), page],
    queryFn: () => breweriesApi.getBeers(breweryId, page, limit),
    enabled: !!breweryId,
  });
}

export function usePopularBreweries(limit = 10) {
  return useQuery({
    queryKey: breweryKeys.popular(),
    queryFn: () => breweriesApi.getPopular(limit),
  });
}

export function useNearbyBreweries(
  latitude: number | null,
  longitude: number | null,
  radius = 50,
  limit = 10
) {
  return useQuery({
    queryKey: breweryKeys.nearby(latitude || 0, longitude || 0),
    queryFn: () => breweriesApi.getNearby(latitude!, longitude!, radius, limit),
    enabled: latitude !== null && longitude !== null,
  });
}
