import { api, type ApiResponse, type PaginatedApiResponse } from "./client";
import type { Recipe, PaginatedResponse } from "@/lib/types";

export interface RecipeSearchParams {
  query?: string;
  style?: string;
  userId?: string;
  isPublic?: boolean;
  sortBy?: "name" | "created_at" | "brew_count" | "fork_count";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateRecipeParams {
  name: string;
  styleId: string;
  description?: string;
  batchSize: number;
  batchSizeUnit: "gallons" | "liters";
  fermentables: Array<{
    name: string;
    amount: number;
    unit: "lb" | "kg" | "oz" | "g";
  }>;
  hops: Array<{
    name: string;
    amount: number;
    unit: "oz" | "g";
    timing: number;
    use: "boil" | "dry_hop" | "whirlpool";
  }>;
  yeast: {
    name: string;
    amount?: number;
  };
  mashSteps?: Array<{
    name: string;
    temperature: number;
    duration: number;
  }>;
  instructions?: string;
  isPublic?: boolean;
}

export const recipesApi = {
  async search(params: RecipeSearchParams = {}): Promise<PaginatedResponse<Recipe>> {
    const response = await api.get<PaginatedApiResponse<Recipe>>("/recipes", { params });
    return { data: response.data.data, meta: response.data.meta };
  },

  async getBySlug(slug: string): Promise<Recipe> {
    const response = await api.get<ApiResponse<Recipe>>(`/recipes/${slug}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Recipe> {
    const response = await api.get<ApiResponse<Recipe>>(`/recipes/id/${id}`);
    return response.data.data;
  },

  async create(params: CreateRecipeParams): Promise<Recipe> {
    const response = await api.post<ApiResponse<Recipe>>("/recipes", params);
    return response.data.data;
  },

  async update(recipeId: string, params: Partial<CreateRecipeParams>): Promise<Recipe> {
    const response = await api.patch<ApiResponse<Recipe>>(`/recipes/${recipeId}`, params);
    return response.data.data;
  },

  async delete(recipeId: string): Promise<void> {
    await api.delete(`/recipes/${recipeId}`);
  },

  async fork(recipeId: string): Promise<Recipe> {
    const response = await api.post<ApiResponse<Recipe>>(`/recipes/${recipeId}/fork`);
    return response.data.data;
  },

  async markBrewed(recipeId: string): Promise<void> {
    await api.post(`/recipes/${recipeId}/brewed`);
  },

  async generateClone(beerId: string): Promise<Recipe> {
    const response = await api.post<ApiResponse<Recipe>>(`/beers/${beerId}/clone-recipe`);
    return response.data.data;
  },

  async getMyRecipes(page = 1, limit = 20): Promise<PaginatedResponse<Recipe>> {
    const response = await api.get<PaginatedApiResponse<Recipe>>("/recipes/mine", {
      params: { page, limit },
    });
    return { data: response.data.data, meta: response.data.meta };
  },

  async getPopular(limit = 10): Promise<Recipe[]> {
    const response = await api.get<ApiResponse<Recipe[]>>("/recipes/popular", { params: { limit } });
    return response.data.data;
  },
};
