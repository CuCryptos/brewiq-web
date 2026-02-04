import { api } from "./client";
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
    const response = await api.get<PaginatedResponse<Recipe>>("/recipes", { params });
    return response.data;
  },

  async getBySlug(slug: string): Promise<Recipe> {
    const response = await api.get<Recipe>(`/recipes/${slug}`);
    return response.data;
  },

  async getById(id: string): Promise<Recipe> {
    const response = await api.get<Recipe>(`/recipes/id/${id}`);
    return response.data;
  },

  async create(params: CreateRecipeParams): Promise<Recipe> {
    const response = await api.post<Recipe>("/recipes", params);
    return response.data;
  },

  async update(recipeId: string, params: Partial<CreateRecipeParams>): Promise<Recipe> {
    const response = await api.patch<Recipe>(`/recipes/${recipeId}`, params);
    return response.data;
  },

  async delete(recipeId: string): Promise<void> {
    await api.delete(`/recipes/${recipeId}`);
  },

  async fork(recipeId: string): Promise<Recipe> {
    const response = await api.post<Recipe>(`/recipes/${recipeId}/fork`);
    return response.data;
  },

  async markBrewed(recipeId: string): Promise<void> {
    await api.post(`/recipes/${recipeId}/brewed`);
  },

  async generateClone(beerId: string): Promise<Recipe> {
    const response = await api.post<Recipe>(`/beers/${beerId}/clone-recipe`);
    return response.data;
  },

  async getMyRecipes(page = 1, limit = 20): Promise<PaginatedResponse<Recipe>> {
    const response = await api.get<PaginatedResponse<Recipe>>("/recipes/mine", {
      params: { page, limit },
    });
    return response.data;
  },

  async getPopular(limit = 10): Promise<Recipe[]> {
    const response = await api.get<Recipe[]>("/recipes/popular", { params: { limit } });
    return response.data;
  },
};
