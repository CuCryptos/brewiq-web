"use client";

import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AchievementBadge } from "@/components/user/AchievementBadge";
import { useRequireAuth, useAuth } from "@/lib/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { PageLoader } from "@/components/ui/Spinner";

export default function AchievementsPage() {
  const { user } = useAuth();
  const { isLoading: authLoading } = useRequireAuth();

  const { data: achievements, isLoading } = useQuery({
    queryKey: ["user", user?.id, "achievements"],
    queryFn: () => usersApi.getAchievements(user!.id),
    enabled: !!user?.id,
  });

  if (authLoading) {
    return <PageLoader message="Loading achievements..." />;
  }

  const unlockedAchievements = achievements?.filter((a) => a.unlockedAt) || [];
  const lockedAchievements = achievements?.filter((a) => !a.unlockedAt) || [];
  const totalXP = unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <Link
        href="/profile"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to profile
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-amber/10 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
            <p className="text-muted-foreground">
              {unlockedAchievements.length} of {achievements?.length || 0} unlocked
            </p>
          </div>
        </div>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-amber">+{totalXP.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">XP Earned</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All ({achievements?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="unlocked">
            Unlocked ({unlockedAchievements.length})
          </TabsTrigger>
          <TabsTrigger value="locked">
            Locked ({lockedAchievements.length})
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-6">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
          </div>
        ) : !achievements || achievements.length === 0 ? (
          <EmptyState
            icon={<Trophy className="h-8 w-8" />}
            title="No achievements available"
            description="Check back later for new achievements to unlock!"
          />
        ) : (
          <>
            <TabsContent value="all">
              <Card>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                  {achievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      size="md"
                      showProgress
                    />
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="unlocked">
              {unlockedAchievements.length === 0 ? (
                <EmptyState
                  icon={<Trophy className="h-8 w-8" />}
                  title="No achievements unlocked yet"
                  description="Start scanning beers and writing reviews to unlock achievements!"
                />
              ) : (
                <Card>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                    {unlockedAchievements.map((achievement) => (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        size="md"
                      />
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="locked">
              {lockedAchievements.length === 0 ? (
                <EmptyState
                  icon={<Trophy className="h-8 w-8" />}
                  title="All achievements unlocked!"
                  description="Congratulations! You've unlocked all available achievements."
                />
              ) : (
                <Card>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                    {lockedAchievements.map((achievement) => (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        size="md"
                        showProgress
                      />
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
