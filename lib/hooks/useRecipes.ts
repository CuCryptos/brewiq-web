"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { recipesApi, type RecipeSearchParams, type CreateRecipeParams } from "@/lib/api/recipes";
import { useUIStore } from "@/lib/stores/uiStore";

export const recipeKeys = {
  all: ["recipes"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  list: (params: RecipeSearchParams) => [...recipeKeys.lists(), params] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
  detail: (slug: string) => [...recipeKeys.details(), slug] as const,
  mine: () => [...recipeKeys.all, "mine"] as const,
  popular: () => [...recipeKeys.all, "popular"] as const,
};

export function useRecipes(params: RecipeSearchParams = {}) {
  return useQuery({
    queryKey: recipeKeys.list(params),
    queryFn: () => recipesApi.search(params),
  });
}

export function useInfiniteRecipes(params: Omit<RecipeSearchParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: [...recipeKeys.lists(), "infinite", params],
    queryFn: ({ pageParam = 1 }) => recipesApi.search({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useRecipe(slug: string) {
  return useQuery({
    queryKey: recipeKeys.detail(slug),
    queryFn: () => recipesApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useMyRecipes(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...recipeKeys.mine(), page],
    queryFn: () => recipesApi.getMyRecipes(page, limit),
  });
}

export function usePopularRecipes(limit = 10) {
  return useQuery({
    queryKey: recipeKeys.popular(),
    queryFn: () => recipesApi.getPopular(limit),
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (params: CreateRecipeParams) => recipesApi.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
      showSuccess("Recipe created!", "Your recipe has been saved");
    },
    onError: () => {
      showError("Error", "Failed to create recipe");
    },
  });
}

export function useForkRecipe() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (recipeId: string) => recipesApi.fork(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
      showSuccess("Recipe forked!", "The recipe has been added to your collection");
    },
    onError: () => {
      showError("Error", "Failed to fork recipe");
    },
  });
}

export function useGenerateCloneRecipe() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (beerId: string) => recipesApi.generateClone(beerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
      showSuccess("Clone recipe generated!", "Check out your new recipe");
    },
    onError: () => {
      showError("Error", "Failed to generate clone recipe");
    },
  });
}
