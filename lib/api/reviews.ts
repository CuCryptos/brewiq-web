import { api } from "./client";
import type { Review, PaginatedResponse } from "@/lib/types";

export interface CreateReviewParams {
  beerId: string;
  rating: number;
  content: string;
  flavorTags?: string[];
}

export interface UpdateReviewParams {
  rating?: number;
  content?: string;
  flavorTags?: string[];
}

export const reviewsApi = {
  async create(params: CreateReviewParams): Promise<Review> {
    const response = await api.post<Review>("/reviews", params);
    return response.data;
  },

  async update(reviewId: string, params: UpdateReviewParams): Promise<Review> {
    const response = await api.patch<Review>(`/reviews/${reviewId}`, params);
    return response.data;
  },

  async delete(reviewId: string): Promise<void> {
    await api.delete(`/reviews/${reviewId}`);
  },

  async getById(reviewId: string): Promise<Review> {
    const response = await api.get<Review>(`/reviews/${reviewId}`);
    return response.data;
  },

  async getRecent(page = 1, limit = 20): Promise<PaginatedResponse<Review>> {
    const response = await api.get<PaginatedResponse<Review>>("/reviews", {
      params: { page, limit, sortBy: "createdAt", sortOrder: "desc" },
    });
    return response.data;
  },

  async getUserReviews(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<Review>> {
    const response = await api.get<PaginatedResponse<Review>>(`/users/${userId}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  async markHelpful(reviewId: string): Promise<void> {
    await api.post(`/reviews/${reviewId}/helpful`);
  },

  async unmarkHelpful(reviewId: string): Promise<void> {
    await api.delete(`/reviews/${reviewId}/helpful`);
  },

  async report(reviewId: string, reason: string): Promise<void> {
    await api.post(`/reviews/${reviewId}/report`, { reason });
  },
};
