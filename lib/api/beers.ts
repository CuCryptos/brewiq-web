import { api } from "./client";
import type { Beer, BeerSearchParams, PaginatedResponse, Review } from "@/lib/types";

export const beersApi = {
  async search(params: BeerSearchParams = {}): Promise<PaginatedResponse<Beer>> {
    const response = await api.get<PaginatedResponse<Beer>>("/beers", { params });
    return response.data;
  },

  async getBySlug(slug: string): Promise<Beer> {
    const response = await api.get<Beer>(`/beers/${slug}`);
    return response.data;
  },

  async getById(id: string): Promise<Beer> {
    const response = await api.get<Beer>(`/beers/id/${id}`);
    return response.data;
  },

  async getTrending(limit = 10): Promise<Beer[]> {
    const response = await api.get<Beer[]>("/beers/trending", { params: { limit } });
    return response.data;
  },

  async getTopRated(limit = 10): Promise<Beer[]> {
    const response = await api.get<Beer[]>("/beers/top-rated", { params: { limit } });
    return response.data;
  },

  async getReviews(beerId: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> {
    const response = await api.get<PaginatedResponse<Review>>(`/beers/${beerId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  async getSimilar(beerId: string, limit = 5): Promise<Beer[]> {
    const response = await api.get<Beer[]>(`/beers/${beerId}/similar`, { params: { limit } });
    return response.data;
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
