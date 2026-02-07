"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge, IQBadge } from "@/components/ui/Badge";
import type { Beer } from "@/lib/types";
import { formatABV } from "@/lib/utils/format";

interface BeerCardProps {
  beer: Beer;
  variant?: "default" | "compact" | "horizontal";
  priority?: boolean;
}

export function BeerCard({ beer, variant = "default", priority = false }: BeerCardProps) {
  if (variant === "horizontal") {
    return (
      <Link href={`/beers/${beer.slug}`} className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl block">
        <Card hover padding="sm" className="flex gap-4">
          <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-muted">
            {beer.imageUrl ? (
              <Image
                src={beer.imageUrl}
                alt={beer.name}
                fill
                className="object-cover"
                sizes="80px"
                priority={priority}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <span className="text-2xl">🍺</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{beer.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {beer.brewery?.name}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {beer.iqScore && beer.iqTier && (
                <IQBadge tier={beer.iqTier} score={beer.iqScore} size="sm" />
              )}
              <Badge variant="secondary" size="sm">
                {formatABV(beer.abv)}
              </Badge>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/beers/${beer.slug}`} className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl block">
        <Card hover padding="sm" className="text-center">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted mb-3">
            {beer.imageUrl ? (
              <Image
                src={beer.imageUrl}
                alt={beer.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                priority={priority}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <span className="text-4xl">🍺</span>
              </div>
            )}
            {beer.iqScore && beer.iqTier && (
              <div className="absolute top-2 right-2">
                <IQBadge tier={beer.iqTier} score={beer.iqScore} size="sm" />
              </div>
            )}
          </div>
          <h3 className="font-medium text-foreground text-sm truncate">{beer.name}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {beer.brewery?.name}
          </p>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/beers/${beer.slug}`} className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl block">
      <Card hover padding="none" className="overflow-hidden">
        <div className="relative aspect-[4/3] w-full bg-muted">
          {beer.imageUrl ? (
            <Image
              src={beer.imageUrl}
              alt={beer.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <span className="text-6xl">🍺</span>
            </div>
          )}
          {beer.iqScore && beer.iqTier && (
            <div className="absolute top-3 right-3">
              <IQBadge tier={beer.iqTier} score={beer.iqScore} />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground truncate">{beer.name}</h3>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {beer.brewery?.name}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-amber text-amber" />
              <span className="font-medium">{(beer.averageRating ?? 0).toFixed(1)}</span>
              <span className="text-muted-foreground">({beer.reviewCount ?? 0})</span>
            </div>
            <div className="flex gap-1.5">
              <Badge variant="secondary" size="sm">
                {formatABV(beer.abv)}
              </Badge>
              {beer.style && (
                <Badge variant="outline" size="sm">
                  {beer.style.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
