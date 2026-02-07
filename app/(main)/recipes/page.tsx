"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Plus, Beaker } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { useInfiniteRecipes } from "@/lib/hooks/useRecipes";
import { useAuth } from "@/lib/hooks/useAuth";
import type { RecipeSearchParams } from "@/lib/api/recipes";

const sortOptions = [
  { value: "created_at", label: "Newest" },
  { value: "brew_count", label: "Most Brewed" },
  { value: "fork_count", label: "Most Forked" },
  { value: "name", label: "Name (A-Z)" },
];

const styleOptions = [
  { value: "", label: "All Styles" },
  { value: "ipa", label: "IPA" },
  { value: "stout", label: "Stout" },
  { value: "lager", label: "Lager" },
  { value: "pale-ale", label: "Pale Ale" },
  { value: "wheat", label: "Wheat Beer" },
  { value: "porter", label: "Porter" },
  { value: "sour", label: "Sour" },
  { value: "belgian", label: "Belgian" },
];

function RecipesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const initialParams: RecipeSearchParams = {
    query: searchParams.get("query") || undefined,
    style: searchParams.get("style") || undefined,
    sortBy: (searchParams.get("sort") as RecipeSearchParams["sortBy"]) || "brew_count",
    isPublic: true,
  };

  const [filters, setFilters] = useState(initialParams);
  const [searchQuery, setSearchQuery] = useState(initialParams.query || "");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRecipes(filters);

  const recipes = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = data?.pages[0]?.meta?.total || 0;

  const updateFilters = (newFilters: Partial<RecipeSearchParams>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    const params = new URLSearchParams();
    if (updated.query) params.set("query", updated.query);
    if (updated.style) params.set("style", updated.style);
    if (updated.sortBy) params.set("sort", updated.sortBy);

    router.push(`/recipes?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ query: searchQuery || undefined });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Homebrew Recipes</h1>
          <p className="text-muted-foreground mt-1">
            {totalCount.toLocaleString()} recipes from the community
          </p>
        </div>
        {isAuthenticated && (
          <Link href="/recipes/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Recipe
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>

        <div className="flex gap-2">
          <Select
            options={styleOptions}
            value={filters.style || ""}
            onChange={(e) => updateFilters({ style: e.target.value || undefined })}
          />
          <Select
            options={sortOptions}
            value={filters.sortBy || "brew_count"}
            onChange={(e) =>
              updateFilters({ sortBy: e.target.value as RecipeSearchParams["sortBy"] })
            }
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
        </div>
      ) : recipes.length === 0 ? (
        <EmptyState
          icon={<Beaker className="h-8 w-8" />}
          title="No recipes found"
          description="Try adjusting your search or be the first to create one!"
          action={
            isAuthenticated ? (
              <Link href="/recipes/new">
                <Button>Create Recipe</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button>Sign in to create</Button>
              </Link>
            )
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                Load more recipes
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
          </div>
        </div>
      }
    >
      <RecipesPageContent />
    </Suspense>
  );
}
