import { api, type ApiResponse } from "./client";
import type { Sighting, SightingSearchParams, PaginatedResponse, BeerFormat } from "@/lib/types";

export interface CreateSightingParams {
  beerId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  format: BeerFormat;
  price?: number;
  notes?: string;
  image?: File;
}

export const sightingsApi = {
  async create(params: CreateSightingParams): Promise<Sighting> {
    const formData = new FormData();
    formData.append("beerId", params.beerId);
    formData.append("locationName", params.locationName);
    formData.append("latitude", params.latitude.toString());
    formData.append("longitude", params.longitude.toString());
    formData.append("format", params.format);

    if (params.price !== undefined) {
      formData.append("price", params.price.toString());
    }
    if (params.notes) {
      formData.append("notes", params.notes);
    }
    if (params.image) {
      formData.append("image", params.image);
    }

    const response = await api.post<ApiResponse<Sighting>>("/sightings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  async search(params: SightingSearchParams = {}): Promise<PaginatedResponse<Sighting>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Sighting>>>("/sightings", { params });
    return response.data.data;
  },

  async getNearby(
    latitude: number,
    longitude: number,
    radius = 10,
    limit = 20
  ): Promise<Sighting[]> {
    const response = await api.get<ApiResponse<Sighting[]>>("/sightings/nearby", {
      params: { latitude, longitude, radius, limit },
    });
    return response.data.data;
  },

  async getForBeer(beerId: string, page = 1, limit = 20): Promise<PaginatedResponse<Sighting>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Sighting>>>(`/beers/${beerId}/sightings`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  async getById(sightingId: string): Promise<Sighting> {
    const response = await api.get<ApiResponse<Sighting>>(`/sightings/${sightingId}`);
    return response.data.data;
  },

  async confirm(sightingId: string): Promise<void> {
    await api.post(`/sightings/${sightingId}/confirm`);
  },

  async reportMissing(sightingId: string): Promise<void> {
    await api.post(`/sightings/${sightingId}/missing`);
  },

  async delete(sightingId: string): Promise<void> {
    await api.delete(`/sightings/${sightingId}`);
  },
};
