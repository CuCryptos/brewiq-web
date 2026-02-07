"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Globe,
  ExternalLink,
  Beer,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Skeleton, SkeletonBeerCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BeerCard } from "@/components/beer/BeerCard";
import { RatingDisplay } from "@/components/review/StarRating";
import { useBrewery, useBreweryBeers } from "@/lib/hooks/useBreweries";

export default function BreweryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: brewery, isLoading } = useBrewery(slug);
  const { data: beersData, isLoading: beersLoading } = useBreweryBeers(
    brewery?.id || "",
    1,
    20
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-48 w-full rounded-2xl mb-6" />
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!brewery) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Brewery not found"
          description="The brewery you're looking for doesn't exist or has been removed."
          action={
            <Link href="/breweries">
              <Button>Browse breweries</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const beers = beersData?.data || [];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <Link
        href="/breweries"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to breweries
      </Link>

      {/* Hero */}
      <div className="relative mb-8">
        {/* Cover image */}
        <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-copper to-amber-700">
          {brewery.coverImageUrl && (
            <Image
              src={brewery.coverImageUrl}
              alt={brewery.name}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Logo */}
        <div className="absolute -bottom-12 left-6">
          <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-card border-4 border-card shadow-lg">
            {brewery.logoUrl ? (
              <Image
                src={brewery.logoUrl}
                alt={brewery.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl bg-muted">
                🏭
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-8 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{brewery.name}</h1>
              {brewery.isVerified && (
                <Badge variant="success" icon={<Check className="h-3 w-3" />}>
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {brewery.city && `${brewery.city}, `}
                {brewery.state && `${brewery.state}, `}
                {brewery.country}
              </div>
              {brewery.website && (
                <a
                  href={brewery.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-amber hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <RatingDisplay rating={brewery.averageRating} size="md" />
              <p className="text-xs text-muted-foreground mt-1">Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Beer className="h-5 w-5 text-amber" />
                <span className="text-lg font-semibold">{brewery.beersCount}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Beers</p>
            </div>
          </div>
        </div>

        {brewery.description && (
          <p className="mt-4 text-muted-foreground">{brewery.description}</p>
        )}

        {brewery.address && (
          <Card className="mt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Address</p>
                <p className="text-sm text-muted-foreground">{brewery.address}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="beers">
        <TabsList>
          <TabsTrigger value="beers">
            Beers ({brewery.beersCount})
          </TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="beers">
          {beersLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <SkeletonBeerCard key={i} />
                ))}
            </div>
          ) : beers.length === 0 ? (
            <EmptyState
              icon={<Beer className="h-8 w-8" />}
              title="No beers listed"
              description="This brewery doesn't have any beers in our database yet."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {beers.map((beer) => (
                <BeerCard key={beer.id} beer={beer} variant="horizontal" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <h3 className="font-semibold text-foreground mb-4">About {brewery.name}</h3>
            <div className="space-y-4 text-muted-foreground">
              {brewery.description ? (
                <p>{brewery.description}</p>
              ) : (
                <p>No additional information available for this brewery.</p>
              )}

              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Location</span>
                  <span className="text-foreground">
                    {brewery.city && `${brewery.city}, `}
                    {brewery.country}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Beers</span>
                  <span className="text-foreground">{brewery.beersCount ?? 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Rating</span>
                  <span className="text-foreground">
                    {(brewery.averageRating ?? 0).toFixed(1)} / 5.0
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
