"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BreweryCard } from "@/components/brewery/BreweryCard";
import { useInfiniteBreweries, useNearbyBreweries } from "@/lib/hooks/useBreweries";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import type { BrewerySearchParams } from "@/lib/api/breweries";

const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "rating", label: "Rating" },
  { value: "beers_count", label: "Most Beers" },
];

const countryOptions = [
  { value: "", label: "All Countries" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "BE", label: "Belgium" },
  { value: "AU", label: "Australia" },
  { value: "CA", label: "Canada" },
];

function BreweriesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { latitude, longitude, getCurrentPosition, isLoading: geoLoading } = useGeolocation();

  const initialParams: BrewerySearchParams = {
    query: searchParams.get("query") || undefined,
    country: searchParams.get("country") || undefined,
    sortBy: (searchParams.get("sort") as BrewerySearchParams["sortBy"]) || "rating",
  };

  const [filters, setFilters] = useState(initialParams);
  const [searchQuery, setSearchQuery] = useState(initialParams.query || "");
  const [showNearby, setShowNearby] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteBreweries(filters);

  const { data: nearbyBreweries, isLoading: nearbyLoading } = useNearbyBreweries(
    showNearby ? latitude : null,
    showNearby ? longitude : null
  );

  const breweries = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = data?.pages[0]?.meta?.total || 0;

  const updateFilters = (newFilters: Partial<BrewerySearchParams>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    const params = new URLSearchParams();
    if (updated.query) params.set("query", updated.query);
    if (updated.country) params.set("country", updated.country);
    if (updated.sortBy) params.set("sort", updated.sortBy);

    router.push(`/breweries?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNearby(false);
    updateFilters({ query: searchQuery || undefined });
  };

  const handleFindNearby = () => {
    if (!latitude || !longitude) {
      getCurrentPosition();
    }
    setShowNearby(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Breweries</h1>
        <p className="text-muted-foreground mt-1">
          Discover {totalCount.toLocaleString()} breweries worldwide
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder="Search breweries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>

        <div className="flex gap-2">
          <Select
            options={countryOptions}
            value={filters.country || ""}
            onChange={(e) => {
              setShowNearby(false);
              updateFilters({ country: e.target.value || undefined });
            }}
          />
          <Select
            options={sortOptions}
            value={filters.sortBy || "rating"}
            onChange={(e) =>
              updateFilters({
                sortBy: e.target.value as BrewerySearchParams["sortBy"],
              })
            }
          />
          <Button
            variant={showNearby ? "default" : "outline"}
            onClick={handleFindNearby}
            isLoading={geoLoading}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Nearby
          </Button>
        </div>
      </div>

      {/* Nearby Breweries Section */}
      {showNearby && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Breweries Near You
          </h2>
          {nearbyLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : nearbyBreweries && nearbyBreweries.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nearbyBreweries.map((brewery) => (
                <BreweryCard key={brewery.id} brewery={brewery} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MapPin className="h-8 w-8" />}
              title="No breweries nearby"
              description="We couldn't find any breweries in your area."
            />
          )}

          <div className="border-t border-border mt-8 pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              All Breweries
            </h2>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : breweries.length === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8" />}
          title="No breweries found"
          description="Try adjusting your search to find what you're looking for."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilters({});
                setShowNearby(false);
                router.push("/breweries");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {breweries.map((brewery) => (
              <BreweryCard key={brewery.id} brewery={brewery} />
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                Load more breweries
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BreweriesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        </div>
      }
    >
      <BreweriesPageContent />
    </Suspense>
  );
}
