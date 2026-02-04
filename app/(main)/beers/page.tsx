"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Grid, List, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SkeletonBeerCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BeerCard } from "@/components/beer/BeerCard";
import { useInfiniteBeers } from "@/lib/hooks/useBeers";
import { cn } from "@/lib/utils/cn";
import type { BeerSearchParams, IQTier } from "@/lib/types";

const sortOptions = [
  { value: "iq_score", label: "IQ Score" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A-Z)" },
];

const styleOptions = [
  { value: "", label: "All Styles" },
  { value: "ipa", label: "IPA" },
  { value: "stout", label: "Stout" },
  { value: "lager", label: "Lager" },
  { value: "pilsner", label: "Pilsner" },
  { value: "wheat", label: "Wheat Beer" },
  { value: "sour", label: "Sour" },
  { value: "porter", label: "Porter" },
  { value: "pale-ale", label: "Pale Ale" },
  { value: "amber", label: "Amber/Red" },
  { value: "belgian", label: "Belgian" },
];

const tierOptions = [
  { value: "", label: "All Tiers" },
  { value: "diamond", label: "Diamond" },
  { value: "platinum", label: "Platinum" },
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "bronze", label: "Bronze" },
];

function BeersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Get initial values from URL
  const initialParams: BeerSearchParams = {
    query: searchParams.get("query") || undefined,
    style: searchParams.get("style") || undefined,
    iqTier: (searchParams.get("tier") as IQTier) || undefined,
    sortBy: (searchParams.get("sort") as BeerSearchParams["sortBy"]) || "iq_score",
    minAbv: searchParams.get("minAbv") ? Number(searchParams.get("minAbv")) : undefined,
    maxAbv: searchParams.get("maxAbv") ? Number(searchParams.get("maxAbv")) : undefined,
  };

  const [filters, setFilters] = useState(initialParams);
  const [searchQuery, setSearchQuery] = useState(initialParams.query || "");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteBeers(filters);

  const beers = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = data?.pages[0]?.meta?.total || 0;

  const updateFilters = (newFilters: Partial<BeerSearchParams>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    // Update URL
    const params = new URLSearchParams();
    if (updated.query) params.set("query", updated.query);
    if (updated.style) params.set("style", updated.style);
    if (updated.iqTier) params.set("tier", updated.iqTier);
    if (updated.sortBy) params.set("sort", updated.sortBy);
    if (updated.minAbv) params.set("minAbv", updated.minAbv.toString());
    if (updated.maxAbv) params.set("maxAbv", updated.maxAbv.toString());

    router.push(`/beers?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ query: searchQuery || undefined });
  };

  const clearFilter = (key: keyof BeerSearchParams) => {
    const updated = { ...filters };
    delete updated[key];
    setFilters(updated);
    updateFilters(updated);
  };

  const activeFilterCount = [
    filters.style,
    filters.iqTier,
    filters.minAbv,
    filters.maxAbv,
  ].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Discover Beers</h1>
        <p className="text-muted-foreground mt-1">
          Explore {totalCount.toLocaleString()} beers from around the world
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder="Search beers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" size="sm" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"
              )}
              aria-label="Grid view"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"
              )}
              aria-label="List view"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <Card className="mb-6 animate-slide-down">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Select
              label="Style"
              options={styleOptions}
              value={filters.style || ""}
              onChange={(e) =>
                updateFilters({ style: e.target.value || undefined })
              }
            />
            <Select
              label="IQ Tier"
              options={tierOptions}
              value={filters.iqTier || ""}
              onChange={(e) =>
                updateFilters({ iqTier: (e.target.value as IQTier) || undefined })
              }
            />
            <Select
              label="Sort By"
              options={sortOptions}
              value={filters.sortBy || "iq_score"}
              onChange={(e) =>
                updateFilters({
                  sortBy: e.target.value as BeerSearchParams["sortBy"],
                })
              }
            />
            <div className="flex gap-2">
              <Input
                label="Min ABV"
                type="number"
                placeholder="0"
                min={0}
                max={20}
                step={0.1}
                value={filters.minAbv || ""}
                onChange={(e) =>
                  updateFilters({
                    minAbv: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
              <Input
                label="Max ABV"
                type="number"
                placeholder="20"
                min={0}
                max={20}
                step={0.1}
                value={filters.maxAbv || ""}
                onChange={(e) =>
                  updateFilters({
                    maxAbv: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>
        </Card>
      )}

      {/* Active Filters */}
      {(filters.query || activeFilterCount > 0) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.query && (
            <Badge variant="secondary" className="pl-3">
              Search: {filters.query}
              <button
                onClick={() => {
                  setSearchQuery("");
                  clearFilter("query");
                }}
                className="ml-2 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.style && (
            <Badge variant="secondary" className="pl-3">
              Style: {filters.style}
              <button
                onClick={() => clearFilter("style")}
                className="ml-2 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.iqTier && (
            <Badge variant="secondary" className="pl-3">
              Tier: {filters.iqTier}
              <button
                onClick={() => clearFilter("iqTier")}
                className="ml-2 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(filters.minAbv || filters.maxAbv) && (
            <Badge variant="secondary" className="pl-3">
              ABV: {filters.minAbv || 0}% - {filters.maxAbv || 20}%
              <button
                onClick={() => {
                  clearFilter("minAbv");
                  clearFilter("maxAbv");
                }}
                className="ml-2 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          )}
        >
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <SkeletonBeerCard key={i} />
            ))}
        </div>
      ) : beers.length === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8" />}
          title="No beers found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilters({});
                router.push("/beers");
              }}
            >
              Clear all filters
            </Button>
          }
        />
      ) : (
        <>
          <div
            className={cn(
              "grid gap-4",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}
          >
            {beers.map((beer) => (
              <BeerCard
                key={beer.id}
                beer={beer}
                variant={viewMode === "list" ? "horizontal" : "default"}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                Load more beers
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BeersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <BeersPageContent />
    </Suspense>
  );
}
