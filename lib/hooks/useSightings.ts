"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sightingsApi, type CreateSightingParams } from "@/lib/api/sightings";
import type { SightingSearchParams } from "@/lib/types";
import { useUIStore } from "@/lib/stores/uiStore";

export const sightingKeys = {
  all: ["sightings"] as const,
  lists: () => [...sightingKeys.all, "list"] as const,
  list: (params: SightingSearchParams) => [...sightingKeys.lists(), params] as const,
  nearby: (lat: number, lon: number, radius?: number) =>
    [...sightingKeys.all, "nearby", lat, lon, radius] as const,
  forBeer: (beerId: string) => [...sightingKeys.all, "beer", beerId] as const,
};

export function useSightings(params: SightingSearchParams = {}) {
  return useQuery({
    queryKey: sightingKeys.list(params),
    queryFn: () => sightingsApi.search(params),
  });
}

export function useNearbySightings(
  latitude: number | null,
  longitude: number | null,
  radius = 10,
  limit = 20
) {
  return useQuery({
    queryKey: sightingKeys.nearby(latitude || 0, longitude || 0, radius),
    queryFn: () => sightingsApi.getNearby(latitude!, longitude!, radius, limit),
    enabled: latitude !== null && longitude !== null,
  });
}

export function useBeerSightings(beerId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [...sightingKeys.forBeer(beerId), page],
    queryFn: () => sightingsApi.getForBeer(beerId, page, limit),
    enabled: !!beerId,
  });
}

export function useCreateSighting() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (params: CreateSightingParams) => sightingsApi.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sightingKeys.all });
      showSuccess("Sighting reported!", "Thanks for helping the community");
    },
    onError: () => {
      showError("Error", "Failed to report sighting");
    },
  });
}

export function useConfirmSighting() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (sightingId: string) => sightingsApi.confirm(sightingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sightingKeys.all });
      showSuccess("Confirmed!", "Thanks for confirming");
    },
    onError: () => {
      showError("Error", "Could not confirm sighting");
    },
  });
}

export function useReportMissing() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (sightingId: string) => sightingsApi.reportMissing(sightingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sightingKeys.all });
      showSuccess("Reported", "Thanks for letting us know");
    },
    onError: () => {
      showError("Error", "Could not report");
    },
  });
}
