"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Plus, Heart, MapPin, ChevronRight, Star, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IQScoreBadge, IQBreakdown } from "@/components/beer/IQScoreBadge";
import { FlavorTags } from "@/components/beer/FlavorTags";
import { BeerCard } from "@/components/beer/BeerCard";
import type { ScanResult as ScanResultType } from "@/lib/types";
import { formatABV, formatIBU } from "@/lib/utils/format";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSaveBeer, useAddToWishlist, useCheckIn } from "@/lib/hooks/useBeers";

interface ScanResultProps {
  result: ScanResultType;
  onScanAnother: () => void;
}

export function ScanResult({ result, onScanAnother }: ScanResultProps) {
  const { beer, confidence, iqAnalysis } = result;
  const { isAuthenticated } = useAuth();

  const saveMutation = useSaveBeer();
  const wishlistMutation = useAddToWishlist();
  const checkInMutation = useCheckIn();

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card padding="none" className="overflow-hidden">
        {/* Beer Header */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-amber via-amber-500 to-copper relative overflow-hidden">
            {beer.imageUrl && (
              <Image
                src={beer.imageUrl}
                alt={beer.name}
                fill
                className="object-cover opacity-30"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              {iqAnalysis ? (
                <IQScoreBadge
                  score={iqAnalysis.score}
                  tier={iqAnalysis.tier}
                  size="xl"
                />
              ) : (
                <div className="text-8xl">🍺</div>
              )}
            </div>
          </div>

          {/* Confidence indicator */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90">
              {Math.round(confidence * 100)}% match
            </Badge>
          </div>
        </div>

        {/* Beer Info */}
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">{beer.name}</h2>
            <Link
              href={`/breweries/${beer.brewery?.slug}`}
              className="text-amber hover:underline"
            >
              {beer.brewery?.name}
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{formatABV(beer.abv)}</Badge>
            {beer.ibu && <Badge variant="secondary">{formatIBU(beer.ibu)}</Badge>}
            {beer.style && <Badge variant="outline">{beer.style.name}</Badge>}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 mb-6">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => checkInMutation.mutate(beer.id)}
                  isLoading={checkInMutation.isPending}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Check In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => saveMutation.mutate(beer.id)}
                  isLoading={saveMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => wishlistMutation.mutate(beer.id)}
                  isLoading={wishlistMutation.isPending}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link href="/login" className="flex-1">
                <Button className="w-full">Sign in to save</Button>
              </Link>
            )}
          </div>

          {/* Description */}
          {beer.description && (
            <p className="text-muted-foreground mb-6">{beer.description}</p>
          )}
        </div>
      </Card>

      {/* IQ Analysis */}
      {iqAnalysis && (
        <Card>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-amber" />
            IQ Analysis
          </h3>

          <IQBreakdown breakdown={iqAnalysis.breakdown} className="mb-6" />

          {/* Tasting Notes */}
          {iqAnalysis.tastingNotes.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Tasting Notes
              </h4>
              <FlavorTags tags={iqAnalysis.tastingNotes} />
            </div>
          )}

          {/* Food Pairings */}
          {iqAnalysis.foodPairings.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Food Pairings
              </h4>
              <ul className="space-y-1">
                {iqAnalysis.foodPairings.slice(0, 4).map((pairing, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span>🍽️</span>
                    {pairing}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Where to Find */}
      <Card>
        <Link
          href={`/sightings?beer=${beer.id}`}
          className="flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-foreground group-hover:text-amber transition-colors">
                Where to Find
              </h4>
              <p className="text-sm text-muted-foreground">
                See nearby locations with this beer
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>
      </Card>

      {/* Try Next - Similar beers */}
      {iqAnalysis?.tryNext && iqAnalysis.tryNext.length > 0 && (
        <Card>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber" />
            Try Next
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {iqAnalysis.tryNext.slice(0, 4).map((b) => (
              <BeerCard key={b.id} beer={b} variant="compact" />
            ))}
          </div>
        </Card>
      )}

      {/* View Full Details */}
      <div className="flex gap-3">
        <Link href={`/beers/${beer.slug}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Full Details
          </Button>
        </Link>
        <Button onClick={onScanAnother} className="flex-1">
          Scan Another
        </Button>
      </div>
    </div>
  );
}
