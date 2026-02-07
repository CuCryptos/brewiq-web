import { api } from "./client";
import type { Beer, BeerSearchParams, PaginatedResponse, Review } from "@/lib/types";

// API wraps responses in { success: boolean, data: T }
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const beersApi = {
  async search(params: BeerSearchParams = {}): Promise<PaginatedResponse<Beer>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Beer>>>("/beers", { params });
    return response.data.data;
  },

  async getBySlug(slug: string): Promise<Beer> {
    const response = await api.get<ApiResponse<Beer>>(`/beers/${slug}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Beer> {
    const response = await api.get<ApiResponse<Beer>>(`/beers/id/${id}`);
    return response.data.data;
  },

  async getTrending(limit = 10): Promise<Beer[]> {
    const response = await api.get<ApiResponse<Beer[]>>("/beers/trending", { params: { limit } });
    return response.data.data;
  },

  async getTopRated(limit = 10): Promise<Beer[]> {
    const response = await api.get<ApiResponse<Beer[]>>("/beers/top-rated", { params: { limit } });
    return response.data.data;
  },

  async getReviews(beerId: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(`/beers/${beerId}/reviews`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  async getSimilar(beerId: string, limit = 5): Promise<Beer[]> {
    const response = await api.get<ApiResponse<Beer[]>>(`/beers/${beerId}/similar`, { params: { limit } });
    return response.data.data;
  },

  async saveBeer(beerId: string): Promise<void> {
    await api.post(`/beers/${beerId}/save`);
  },

  async unsaveBeer(beerId: string): Promise<void> {
    await api.delete(`/beers/${beerId}/save`);
  },

  async addToWishlist(beerId: string): Promise<void> {
    await api.post(`/beers/${beerId}/wishlist`);
  },

  async removeFromWishlist(beerId: string): Promise<void> {
    await api.delete(`/beers/${beerId}/wishlist`);
  },

  async checkIn(beerId: string): Promise<void> {
    await api.post(`/beers/${beerId}/checkin`);
  },
};
