import { api, type ApiResponse } from "./client";
import type { Review } from "@/lib/types";

export const imagesApi = {
  async generateReviewImage(reviewId: string): Promise<Review> {
    const response = await api.post<ApiResponse<Review>>("/images/review", { reviewId });
    return response.data.data;
  },

  async generateAvatar(prompt: string): Promise<{ imageUrl: string }> {
    const response = await api.post<ApiResponse<{ imageUrl: string }>>("/images/avatar", { prompt });
    return response.data.data;
  },
};
