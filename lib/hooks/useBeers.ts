"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { beersApi } from "@/lib/api/beers";
import type { BeerSearchParams } from "@/lib/types";
import { useUIStore } from "@/lib/stores/uiStore";

export const beerKeys = {
  all: ["beers"] as const,
  lists: () => [...beerKeys.all, "list"] as const,
  list: (params: BeerSearchParams) => [...beerKeys.lists(), params] as const,
  details: () => [...beerKeys.all, "detail"] as const,
  detail: (slug: string) => [...beerKeys.details(), slug] as const,
  trending: () => [...beerKeys.all, "trending"] as const,
  topRated: () => [...beerKeys.all, "top-rated"] as const,
  reviews: (beerId: string) => [...beerKeys.all, beerId, "reviews"] as const,
  similar: (beerId: string) => [...beerKeys.all, beerId, "similar"] as const,
};

export function useBeers(params: BeerSearchParams = {}) {
  return useQuery({
    queryKey: beerKeys.list(params),
    queryFn: () => beersApi.search(params),
    staleTime: 300000,
  });
}

export function useInfiniteBeers(params: Omit<BeerSearchParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: [...beerKeys.lists(), "infinite", params],
    queryFn: ({ pageParam = 1 }) => beersApi.search({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useBeer(slug: string) {
  return useQuery({
    queryKey: beerKeys.detail(slug),
    queryFn: () => beersApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 300000,
  });
}

export function useTrendingBeers(limit = 10) {
  return useQuery({
    queryKey: beerKeys.trending(),
    queryFn: () => beersApi.getTrending(limit),
  });
}

export function useTopRatedBeers(limit = 10) {
  return useQuery({
    queryKey: beerKeys.topRated(),
    queryFn: () => beersApi.getTopRated(limit),
  });
}

export function useBeerReviews(beerId: string, page = 1, limit = 10, enabled = true) {
  return useQuery({
    queryKey: [...beerKeys.reviews(beerId), page],
    queryFn: () => beersApi.getReviews(beerId, page, limit),
    enabled: !!beerId && enabled,
  });
}

export function useSimilarBeers(beerId: string, limit = 5, enabled = true) {
  return useQuery({
    queryKey: beerKeys.similar(beerId),
    queryFn: () => beersApi.getSimilar(beerId, limit),
    enabled: !!beerId && enabled,
  });
}

export function useSaveBeer() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (beerId: string) => beersApi.saveBeer(beerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "saved-beers"] });
      showSuccess("Beer saved", "Added to your saved beers");
    },
    onError: () => {
      showError("Failed to save", "Could not save this beer");
    },
  });
}

export function useUnsaveBeer() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (beerId: string) => beersApi.unsaveBeer(beerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "saved-beers"] });
      showSuccess("Beer removed", "Removed from your saved beers");
    },
    onError: () => {
      showError("Failed to remove", "Could not remove this beer");
    },
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (beerId: string) => beersApi.addToWishlist(beerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "wishlist"] });
      showSuccess("Added to wishlist", "You'll be notified when this beer is spotted nearby");
    },
    onError: () => {
      showError("Failed to add", "Could not add to wishlist");
    },
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (beerId: string) => beersApi.checkIn(beerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "stats"] });
      showSuccess("Checked in!", "Your beer log has been updated");
    },
    onError: () => {
      showError("Check-in failed", "Could not log this beer");
    },
  });
}
