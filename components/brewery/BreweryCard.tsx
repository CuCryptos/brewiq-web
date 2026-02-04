"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Beer } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Brewery } from "@/lib/types";

interface BreweryCardProps {
  brewery: Brewery;
  variant?: "default" | "compact";
}

export function BreweryCard({ brewery, variant = "default" }: BreweryCardProps) {
  if (variant === "compact") {
    return (
      <Link href={`/breweries/${brewery.slug}`}>
        <Card hover padding="sm" className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-muted">
            {brewery.logoUrl ? (
              <Image
                src={brewery.logoUrl}
                alt={brewery.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl">
                🏭
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{brewery.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {brewery.city}, {brewery.country}
            </p>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/breweries/${brewery.slug}`}>
      <Card hover padding="none" className="overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-32 bg-gradient-to-br from-copper to-amber-700">
          {brewery.coverImageUrl && (
            <Image
              src={brewery.coverImageUrl}
              alt={brewery.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          )}
          {/* Logo overlay */}
          <div className="absolute -bottom-8 left-4">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-card border-4 border-card shadow-lg">
              {brewery.logoUrl ? (
                <Image
                  src={brewery.logoUrl}
                  alt={brewery.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl bg-muted">
                  🏭
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="pt-10 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{brewery.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {brewery.city}, {brewery.country}
              </div>
            </div>
            {brewery.isVerified && (
              <Badge variant="success" size="sm">
                Verified
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-amber text-amber" />
              <span className="font-medium">{brewery.averageRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Beer className="h-4 w-4" />
              {brewery.beersCount} beers
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
