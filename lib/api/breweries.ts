import { api, type ApiResponse } from "./client";
import type { Brewery, Beer, PaginatedResponse } from "@/lib/types";

export interface BrewerySearchParams {
  query?: string;
  country?: string;
  state?: string;
  city?: string;
  sortBy?: "name" | "rating" | "beers_count";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const breweriesApi = {
  async search(params: BrewerySearchParams = {}): Promise<PaginatedResponse<Brewery>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Brewery>>>("/breweries", { params });
    return response.data.data;
  },

  async getBySlug(slug: string): Promise<Brewery> {
    const response = await api.get<ApiResponse<Brewery>>(`/breweries/${slug}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Brewery> {
    const response = await api.get<ApiResponse<Brewery>>(`/breweries/id/${id}`);
    return response.data.data;
  },

  async getBeers(breweryId: string, page = 1, limit = 20): Promise<PaginatedResponse<Beer>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Beer>>>(`/breweries/${breweryId}/beers`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  async getPopular(limit = 10): Promise<Brewery[]> {
    const response = await api.get<ApiResponse<Brewery[]>>("/breweries/popular", { params: { limit } });
    return response.data.data;
  },

  async getNearby(
    latitude: number,
    longitude: number,
    radius = 50,
    limit = 10
  ): Promise<Brewery[]> {
    const response = await api.get<ApiResponse<Brewery[]>>("/breweries/nearby", {
      params: { latitude, longitude, radius, limit },
    });
    return response.data.data;
  },
};
