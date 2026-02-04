"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Beer, Building2, FileText, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useUIStore } from "@/lib/stores/uiStore";
import { beersApi } from "@/lib/api/beers";
import { breweriesApi } from "@/lib/api/breweries";
import { recipesApi } from "@/lib/api/recipes";
import type { Beer as BeerType, Brewery, Recipe } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface SearchResult {
  type: "beer" | "brewery" | "recipe";
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
}

export function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  // Search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [beersRes, breweriesRes, recipesRes] = await Promise.all([
          beersApi.search({ query, limit: 5 }).catch(() => ({ data: [] })),
          breweriesApi.search({ query, limit: 3 }).catch(() => ({ data: [] })),
          recipesApi.search({ query, limit: 3 }).catch(() => ({ data: [] })),
        ]);

        const searchResults: SearchResult[] = [
          ...beersRes.data.map((beer: BeerType) => ({
            type: "beer" as const,
            id: beer.id,
            slug: beer.slug,
            name: beer.name,
            subtitle: beer.brewery?.name,
          })),
          ...breweriesRes.data.map((brewery: Brewery) => ({
            type: "brewery" as const,
            id: brewery.id,
            slug: brewery.slug,
            name: brewery.name,
            subtitle: `${brewery.city}, ${brewery.country}`,
          })),
          ...recipesRes.data.map((recipe: Recipe) => ({
            type: "recipe" as const,
            id: recipe.id,
            slug: recipe.slug,
            name: recipe.name,
            subtitle: recipe.style?.name,
          })),
        ];

        setResults(searchResults);
        setSelectedIndex(0);
      } catch {
        // Ignore search errors
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setSearchOpen(false);
      switch (result.type) {
        case "beer":
          router.push(`/beers/${result.slug}`);
          break;
        case "brewery":
          router.push(`/breweries/${result.slug}`);
          break;
        case "recipe":
          router.push(`/recipes/${result.slug}`);
          break;
      }
    },
    [router, setSearchOpen]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case "Escape":
          setSearchOpen(false);
          break;
      }
    },
    [results, selectedIndex, handleSelect, setSearchOpen]
  );

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "beer":
        return <Beer className="h-4 w-4" />;
      case "brewery":
        return <Building2 className="h-4 w-4" />;
      case "recipe":
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Modal
      isOpen={isSearchOpen}
      onClose={() => setSearchOpen(false)}
      showCloseButton={false}
      size="lg"
      className="!p-0 overflow-hidden"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search beers, breweries, recipes..."
          className="w-full h-14 pl-12 pr-12 text-lg bg-transparent border-b border-border focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-amber" />
          </div>
        ) : results.length > 0 ? (
          <div className="py-2">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                  selectedIndex === index ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {getIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {result.name}
                  </p>
                  {result.subtitle && (
                    <p className="text-sm text-muted-foreground truncate">
                      {result.subtitle}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground capitalize">
                  {result.type}
                </span>
              </button>
            ))}
          </div>
        ) : query ? (
          <div className="py-12 text-center text-muted-foreground">
            No results found for &quot;{query}&quot;
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            Start typing to search...
          </div>
        )}
      </div>

      <div className="border-t border-border px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-muted">↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-muted">↵</kbd>
            Select
          </span>
        </div>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-muted">Esc</kbd>
          Close
        </span>
      </div>
    </Modal>
  );
}
