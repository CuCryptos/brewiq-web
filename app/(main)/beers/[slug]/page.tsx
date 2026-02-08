"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  MapPin,
  ExternalLink,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Skeleton, SkeletonReview } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AuthPrompt, useAuthPrompt } from "@/components/ui/AuthPrompt";
import { IQScoreBadge, IQBreakdown } from "@/components/beer/IQScoreBadge";
import { FlavorTags } from "@/components/beer/FlavorTags";
import { BeerCard } from "@/components/beer/BeerCard";
import { RatingDisplay } from "@/components/review/StarRating";
import { ReviewCard } from "@/components/review/ReviewCard";
import { useBeer, useBeerReviews, useSimilarBeers, useSaveBeer, useAddToWishlist, useCheckIn } from "@/lib/hooks/useBeers";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatABV, formatIBU } from "@/lib/utils/format";

const ReviewForm = dynamic(
  () => import("@/components/review/ReviewForm").then((m) => ({ default: m.ReviewForm })),
  { ssr: false }
);

export default function BeerDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isAuthenticated } = useAuth();
  const { isOpen: authPromptOpen, config: authConfig, showAuthPrompt, closeAuthPrompt } = useAuthPrompt();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const { data: beer, isLoading } = useBeer(slug);
  const { data: reviewsData, isLoading: reviewsLoading } = useBeerReviews(beer?.id || "", 1, 10, activeTab === "reviews");
  const { data: similarBeers } = useSimilarBeers(beer?.id || "", 5, activeTab === "details");

  const saveMutation = useSaveBeer();
  const wishlistMutation = useAddToWishlist();
  const checkInMutation = useCheckIn();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Skeleton className="aspect-square rounded-2xl" />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!beer) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Beer not found"
          description="The beer you're looking for doesn't exist or has been removed."
          action={
            <Link href="/beers">
              <Button>Browse beers</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const reviews = reviewsData?.data || [];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <Link
        href="/beers"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to beers
      </Link>

      {/* Hero section */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Image */}
        <div className="lg:col-span-1">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            {beer.imageUrl ? (
              <Image
                src={beer.imageUrl}
                alt={beer.name}
                fill
                className="object-cover"
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-8xl">
                🍺
              </div>
            )}
            {beer.iqScore && beer.iqTier && (
              <div className="absolute top-4 right-4">
                <IQScoreBadge score={beer.iqScore} tier={beer.iqTier} size="lg" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{beer.name}</h1>
            <Link
              href={`/breweries/${beer.brewery?.slug}`}
              className="text-lg text-amber hover:underline"
            >
              {beer.brewery?.name}
            </Link>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <RatingDisplay
              rating={beer.averageRating}
              count={beer.reviewCount}
              size="md"
            />
            <Badge variant="secondary">{formatABV(beer.abv)}</Badge>
            {beer.ibu && <Badge variant="secondary">{formatIBU(beer.ibu)}</Badge>}
            {beer.style && <Badge variant="outline">{beer.style.name}</Badge>}
            {beer.isVerified && (
              <Badge variant="success" icon={<Check className="h-3 w-3" />}>
                Verified
              </Badge>
            )}
          </div>

          {beer.description && (
            <p className="text-muted-foreground">{beer.description}</p>
          )}

          {beer.tastingNotes && beer.tastingNotes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                Tasting Notes
              </h3>
              <FlavorTags tags={beer.tastingNotes} />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              onClick={() => isAuthenticated
                ? checkInMutation.mutate(beer.id)
                : showAuthPrompt("Check In", "Sign up to track the beers you've tried.")
              }
              isLoading={checkInMutation.isPending}
            >
              <Check className="h-4 w-4 mr-2" />
              I&apos;ve had this
            </Button>
            <Button
              variant="outline"
              onClick={() => isAuthenticated
                ? saveMutation.mutate(beer.id)
                : showAuthPrompt("Save Beer", "Sign up to save beers to your collection.")
              }
              isLoading={saveMutation.isPending}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => isAuthenticated
                ? wishlistMutation.mutate(beer.id)
                : showAuthPrompt("Wishlist", "Sign up to add beers to your wishlist.")
              }
              isLoading={wishlistMutation.isPending}
            >
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({beer.reviewCount})</TabsTrigger>
          <TabsTrigger value="sightings">Where to Find</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* IQ Breakdown */}
            {beer.iqScore && beer.flavorProfile && (
              <Card>
                <h3 className="font-semibold text-foreground mb-4">IQ Score Breakdown</h3>
                <IQBreakdown
                  breakdown={{
                    quality: 85,
                    complexity: 78,
                    balance: 82,
                    uniqueness: 70,
                  }}
                />
              </Card>
            )}

            {/* Food Pairings */}
            {beer.foodPairings && beer.foodPairings.length > 0 && (
              <Card>
                <h3 className="font-semibold text-foreground mb-4">Food Pairings</h3>
                <ul className="space-y-2">
                  {beer.foodPairings.map((pairing, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <span>🍽️</span>
                      {pairing}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Brewery Info */}
            <Card>
              <h3 className="font-semibold text-foreground mb-4">Brewery</h3>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center text-3xl">
                  🏭
                </div>
                <div className="flex-1">
                  <Link
                    href={`/breweries/${beer.brewery?.slug}`}
                    className="font-medium text-foreground hover:text-amber"
                  >
                    {beer.brewery?.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {beer.brewery?.city}, {beer.brewery?.country}
                  </p>
                  {beer.brewery?.website && (
                    <a
                      href={beer.brewery.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-amber hover:underline mt-1"
                    >
                      Visit website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </Card>

            {/* Similar Beers */}
            {similarBeers && similarBeers.length > 0 && (
              <Card className="sm:col-span-2">
                <h3 className="font-semibold text-foreground mb-4">Try Next</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {similarBeers.slice(0, 4).map((b) => (
                    <BeerCard key={b.id} beer={b} variant="compact" />
                  ))}
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          {/* Review Form */}
          {!showReviewForm && (
            <Button
              onClick={() => isAuthenticated
                ? setShowReviewForm(true)
                : showAuthPrompt("Write a Review", "Sign up to share your tasting notes and rate this beer.")
              }
              className="mb-6"
            >
              Write a Review
            </Button>
          )}

          {showReviewForm && (
            <div className="mb-6">
              <ReviewForm
                beerId={beer.id}
                onSuccess={() => setShowReviewForm(false)}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <SkeletonReview key={i} />
                ))}
            </div>
          ) : reviews.length === 0 ? (
            <EmptyState
              title="No reviews yet"
              description="Be the first to review this beer!"
              action={
                <Button
                  onClick={() => isAuthenticated
                    ? setShowReviewForm(true)
                    : showAuthPrompt("Write a Review", "Sign up to share your tasting notes and rate this beer.")
                  }
                >
                  Write a Review
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sightings">
          <Card>
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-foreground">Find this beer nearby</h3>
              <p className="text-sm text-muted-foreground mt-1">
                See where other users have spotted this beer
              </p>
              <Link href={`/sightings?beer=${beer.id}`}>
                <Button className="mt-4">
                  View Sightings
                </Button>
              </Link>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <AuthPrompt isOpen={authPromptOpen} onClose={closeAuthPrompt} title={authConfig.title} message={authConfig.message} />
    </div>
  );
}
