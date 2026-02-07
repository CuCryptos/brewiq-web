"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Medal, Camera, Star, MapPin, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { useAuth } from "@/lib/hooks/useAuth";
import type { LeaderboardType, LeaderboardCategory, LeaderboardEntry } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const categoryIcons = {
  scans: <Camera className="h-4 w-4" />,
  reviews: <Star className="h-4 w-4" />,
  sightings: <MapPin className="h-4 w-4" />,
  xp: <Zap className="h-4 w-4" />,
};

function LeaderboardRow({
  entry,
  category,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  category: LeaderboardCategory;
  isCurrentUser: boolean;
}) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Medal className="h-5 w-5 text-tier-gold" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-tier-silver" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-tier-bronze" />;
    return <span className="text-muted-foreground font-medium">{rank}</span>;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg transition-colors",
        isCurrentUser && "bg-amber/5 border border-amber/20"
      )}
    >
      <div className="w-8 flex justify-center">{getRankBadge(entry.rank)}</div>
      <Link href={`/profile/${entry.user.username}`} className="flex items-center gap-3 flex-1">
        <Avatar
          src={entry.user.avatar}
          fallback={entry.user.displayName || entry.user.username}
          size="md"
        />
        <div>
          <p className="font-medium text-foreground">
            {entry.user.displayName || entry.user.username}
          </p>
          <p className="text-sm text-muted-foreground">@{entry.user.username}</p>
        </div>
      </Link>
      <div className="text-right">
        <p className="font-bold text-foreground">{entry.score.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">
          {category === "xp" ? "XP" : category}
        </p>
      </div>
      {entry.change !== undefined && entry.change !== 0 && (
        <div
          className={cn(
            "text-sm font-medium",
            entry.change > 0 ? "text-green-500" : "text-red-500"
          )}
        >
          {entry.change > 0 ? "+" : ""}
          {entry.change}
        </div>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState<LeaderboardType>("weekly");
  const [category, setCategory] = useState<LeaderboardCategory>("xp");

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard", timeFrame, category],
    queryFn: () => usersApi.getLeaderboard(timeFrame, category, 50),
  });

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Trophy className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top beer enthusiasts in the community
          </p>
        </div>
      </div>

      {/* Time Frame */}
      <Tabs defaultValue="weekly" value={timeFrame} onValueChange={(v) => setTimeFrame(v as LeaderboardType)}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="weekly" className="flex-1">
            This Week
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1">
            This Month
          </TabsTrigger>
          <TabsTrigger value="allTime" className="flex-1">
            All Time
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Category */}
      <div
        className="flex gap-2 mb-6"
        role="radiogroup"
        aria-label="Leaderboard category"
        onKeyDown={(e) => {
          const cats: LeaderboardCategory[] = ["xp", "scans", "reviews", "sightings"];
          const idx = cats.indexOf(category);
          let next: number | null = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            next = (idx + 1) % cats.length;
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            next = (idx - 1 + cats.length) % cats.length;
          }
          if (next !== null) {
            e.preventDefault();
            setCategory(cats[next]);
            const buttons = e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]');
            buttons[next]?.focus();
          }
        }}
      >
        {(["xp", "scans", "reviews", "sightings"] as LeaderboardCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            role="radio"
            aria-checked={category === cat}
            tabIndex={category === cat ? 0 : -1}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              category === cat
                ? "bg-amber text-stout-800"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {categoryIcons[cat]}
            <span className="capitalize">{cat}</span>
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      {isLoading ? (
        <div className="space-y-4">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
        </div>
      ) : leaderboard && leaderboard.length > 0 ? (
        <Card padding="none" className="divide-y divide-border overflow-hidden">
          {leaderboard.map((entry) => (
            <LeaderboardRow
              key={entry.user.id}
              entry={entry}
              category={category}
              isCurrentUser={user?.id === entry.user.id}
            />
          ))}
        </Card>
      ) : (
        <EmptyState
          icon={<Trophy className="h-8 w-8" />}
          title="No data yet"
          description="Start scanning beers and writing reviews to appear on the leaderboard!"
        />
      )}
    </div>
  );
}
