"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Settings, Beer, Bookmark, Heart, Star, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Skeleton, SkeletonBeerCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BeerCard } from "@/components/beer/BeerCard";
import { UserStats, LevelProgress } from "@/components/user/UserStats";
import { AchievementGrid } from "@/components/user/AchievementBadge";
import { useAuth, useRequireAuth } from "@/lib/hooks/useAuth";
import { useScanHistory } from "@/lib/hooks/useScanner";
import { PageLoader } from "@/components/ui/Spinner";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { formatRelativeTime } from "@/lib/utils/format";

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "overview";
  const { user } = useAuth();
  const { isLoading: authLoading } = useRequireAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user", user?.id, "stats"],
    queryFn: () => usersApi.getStats(user!.id),
    enabled: !!user?.id,
  });

  const { data: achievements } = useQuery({
    queryKey: ["user", user?.id, "achievements"],
    queryFn: () => usersApi.getAchievements(user!.id),
    enabled: !!user?.id,
  });

  const { data: savedBeers, isLoading: savedLoading } = useQuery({
    queryKey: ["user", "saved-beers"],
    queryFn: () => usersApi.getSavedBeers(),
    enabled: !!user?.id,
  });

  const { data: wishlist, isLoading: wishlistLoading } = useQuery({
    queryKey: ["user", "wishlist"],
    queryFn: () => usersApi.getWishlist(),
    enabled: !!user?.id,
  });

  const { data: scans, isLoading: scansLoading } = useScanHistory(1, 10);

  if (authLoading) {
    return <PageLoader message="Loading profile..." />;
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Profile Header */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar
            src={user.avatar}
            fallback={user.displayName || user.username}
            size="xl"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">
                {user.displayName || user.username}
              </h1>
              <Badge variant={user.tier === "free" ? "secondary" : "gold"} className="capitalize">
                {user.tier}
              </Badge>
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.bio && <p className="mt-2 text-foreground">{user.bio}</p>}
          </div>
          <Link href="/profile/settings">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </Card>

      {/* Level Progress */}
      <div className="mb-6">
        <LevelProgress level={user.level} xp={user.xp} nextLevelXp={1000} />
      </div>

      {/* Stats */}
      <div className="mb-6">
        {statsLoading || !stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="h-24">
                  <Skeleton className="h-10 w-10 mx-auto rounded-lg mb-2" />
                  <Skeleton className="h-6 w-16 mx-auto" />
                </Card>
              ))}
          </div>
        ) : (
          <UserStats stats={stats} />
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="scans">Scans</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Recent Achievements */}
          {achievements && achievements.length > 0 && (
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Achievements</h3>
                <Link href="/achievements" className="text-sm text-amber hover:underline">
                  View all
                </Link>
              </div>
              <AchievementGrid achievements={achievements.slice(0, 8)} />
            </Card>
          )}

          {/* Recent Activity placeholder */}
          <Card>
            <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
            <EmptyState
              title="No recent activity"
              description="Your beer discoveries, reviews, and sightings will appear here."
              icon={<Beer className="h-8 w-8" />}
            />
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          {savedLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <SkeletonBeerCard key={i} />
                ))}
            </div>
          ) : savedBeers?.data && savedBeers.data.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {savedBeers.data.map((beer) => (
                <BeerCard key={beer.id} beer={beer} variant="horizontal" />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No saved beers"
              description="Beers you save will appear here for easy access."
              icon={<Bookmark className="h-8 w-8" />}
              action={
                <Link href="/beers">
                  <Button>Discover Beers</Button>
                </Link>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="wishlist">
          {wishlistLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <SkeletonBeerCard key={i} />
                ))}
            </div>
          ) : wishlist?.data && wishlist.data.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {wishlist.data.map((beer) => (
                <BeerCard key={beer.id} beer={beer} variant="horizontal" />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Empty wishlist"
              description="Add beers to your wishlist to try them later."
              icon={<Heart className="h-8 w-8" />}
              action={
                <Link href="/beers">
                  <Button>Discover Beers</Button>
                </Link>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="scans">
          {scansLoading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-20 w-full" />
                  </Card>
                ))}
            </div>
          ) : scans?.data && scans.data.length > 0 ? (
            <div className="space-y-4">
              {scans.data.map((scan) => (
                <Card key={scan.id} hover>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                      {scan.imageUrl ? (
                        <Image
                          src={scan.imageUrl}
                          alt="Scan"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl">
                          📷
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {scan.results?.[0]?.beer?.name || "Unknown Beer"}
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
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No scans yet"
              description="Scan beer labels to build your beer history."
              icon={<Camera className="h-8 w-8" />}
              action={
                <Link href="/scan">
                  <Button>Scan a Beer</Button>
                </Link>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="achievements">
          {achievements && achievements.length > 0 ? (
            <Card>
              <AchievementGrid achievements={achievements} showAll />
            </Card>
          ) : (
            <EmptyState
              title="No achievements yet"
              description="Earn achievements by scanning beers, writing reviews, and more."
              icon={<Star className="h-8 w-8" />}
              action={
                <Link href="/scan">
                  <Button>Start Scanning</Button>
                </Link>
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<PageLoader message="Loading profile..." />}>
      <ProfilePageContent />
    </Suspense>
  );
}
