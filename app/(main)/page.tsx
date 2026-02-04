"use client";

import Link from "next/link";
import {
  Camera,
  TrendingUp,
  MapPin,
  Trophy,
  ChevronRight,
  Beer,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonBeerCard } from "@/components/ui/Skeleton";
import { BeerCard } from "@/components/beer/BeerCard";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTrendingBeers, useScanHistory } from "@/lib/hooks";
import { formatRelativeTime } from "@/lib/utils/format";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const { data: trendingBeers, isLoading: trendingLoading } = useTrendingBeers(6);
  const { data: recentScans } = useScanHistory(1, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber via-amber-500 to-copper p-6 sm:p-8 lg:p-12">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stout-800">
            {isAuthenticated
              ? `Welcome back, ${user?.displayName || user?.username}!`
              : "Discover Your Next Favorite Beer"}
          </h1>
          <p className="mt-3 text-stout-700/90 sm:text-lg max-w-lg">
            Scan any beer to get instant AI-powered insights, ratings, and personalized recommendations.
          </p>
          <Link href="/scan">
            <Button size="xl" className="mt-6 bg-stout-800 text-white hover:bg-stout-700">
              <Camera className="mr-2 h-5 w-5" />
              Scan a Beer
            </Button>
          </Link>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute top-1/2 right-10 text-6xl sm:text-8xl opacity-20">
          🍺
        </div>
      </section>

      {/* Quick Stats - Only for authenticated users */}
      {isAuthenticated && (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-amber/10 text-amber">
                <Beer className="h-6 w-6" />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {user?.level || 1}
              </p>
              <p className="text-sm text-muted-foreground">Level</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-green-500/10 text-green-500">
                <Zap className="h-6 w-6" />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {user?.xp || 0}
              </p>
              <p className="text-sm text-muted-foreground">XP</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Camera className="h-6 w-6" />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {recentScans?.meta?.total || 0}
              </p>
              <p className="text-sm text-muted-foreground">Scans</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Trophy className="h-6 w-6" />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground capitalize">
                {user?.tier || "Free"}
              </p>
              <p className="text-sm text-muted-foreground">Tier</p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Recent Scans - Only for authenticated users */}
      {isAuthenticated && recentScans?.data && recentScans.data.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Scans</h2>
            <Link
              href="/profile?tab=scans"
              className="text-sm text-amber hover:text-amber-500 flex items-center"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentScans.data.map((scan) => (
              <Card key={scan.id} hover>
                <CardContent className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-lg bg-muted overflow-hidden">
                    {scan.imageUrl ? (
                      <img
                        src={scan.imageUrl}
                        alt="Scan"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">
                        📷
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {scan.results?.[0]?.beer?.name || "Processing..."}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatRelativeTime(scan.createdAt)}
                    </p>
                    <Badge
                      variant={scan.status === "completed" ? "success" : "secondary"}
                      size="sm"
                      className="mt-1"
                    >
                      {scan.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Trending Beers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber" />
            <h2 className="text-xl font-semibold text-foreground">Trending Beers</h2>
          </div>
          <Link
            href="/beers?sort=trending"
            className="text-sm text-amber hover:text-amber-500 flex items-center"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {trendingLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => <SkeletonBeerCard key={i} />)
            : trendingBeers?.map((beer) => (
                <BeerCard key={beer.id} beer={beer} variant="compact" />
              ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/sightings">
          <Card hover className="h-full">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle className="mt-4">Beer Sightings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Find where your favorite beers are available nearby. Like Waze, but for beer!
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/leaderboard">
          <Card hover className="h-full">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <Trophy className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle className="mt-4">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Compete with other beer enthusiasts. Earn XP by scanning, reviewing, and discovering.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/recipes">
          <Card hover className="h-full">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                <Star className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle className="mt-4">Homebrew Recipes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Clone your favorite commercial beers or discover community recipes to brew at home.
              </p>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* CTA for non-authenticated users */}
      {!isAuthenticated && (
        <section className="text-center py-8">
          <Card padding="lg" className="max-w-2xl mx-auto">
            <CardContent className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Join the BrewIQ Community
              </h2>
              <p className="text-muted-foreground">
                Create a free account to start scanning beers, tracking your favorites,
                and connecting with fellow beer enthusiasts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link href="/register">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
