"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { BeerCard } from "@/components/beer/BeerCard";
import { SkeletonBeerCard } from "@/components/ui/Skeleton";
import { AnimateOnScroll } from "./AnimateOnScroll";
import type { Beer } from "@/lib/types";

interface TrendingSectionProps {
  beers: Beer[];
  isLoading: boolean;
}

export function TrendingSection({ beers, isLoading }: TrendingSectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimateOnScroll>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
              <TrendingUp className="h-5 w-5 text-amber" />
            </div>
            <h2 className="text-2xl font-bold font-ui text-foreground">
              Trending Now
            </h2>
          </div>
          <Link
            href="/beers?sort=trending"
            className="text-sm font-medium text-amber hover:text-amber-600 transition-colors"
          >
            View all
          </Link>
        </div>
      </AnimateOnScroll>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBeerCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Desktop grid */}
          <div className="hidden lg:grid lg:grid-cols-6 gap-4">
            {beers.slice(0, 6).map((beer, i) => (
              <AnimateOnScroll key={beer.id} delay={i * 0.05}>
                <BeerCard beer={beer} variant="compact" />
              </AnimateOnScroll>
            ))}
          </div>

          {/* Mobile horizontal scroll */}
          <div className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4">
            {beers.slice(0, 6).map((beer, i) => (
              <AnimateOnScroll
                key={beer.id}
                delay={i * 0.05}
                className="snap-start shrink-0 w-[160px]"
              >
                <BeerCard beer={beer} variant="compact" />
              </AnimateOnScroll>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
