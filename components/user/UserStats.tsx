"use client";

import { Beer, Star, MapPin, FileText, Users, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { UserStats as UserStatsType } from "@/lib/types";

interface UserStatsProps {
  stats: UserStatsType;
}

export function UserStats({ stats }: UserStatsProps) {
  const statItems = [
    {
      icon: Beer,
      label: "Beers Scanned",
      value: stats.beersScanned,
      color: "text-amber",
      bg: "bg-amber/10",
    },
    {
      icon: Star,
      label: "Reviews",
      value: stats.reviewsWritten,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      icon: MapPin,
      label: "Sightings",
      value: stats.sightingsReported,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: FileText,
      label: "Recipes",
      value: stats.recipesCreated,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: Users,
      label: "Followers",
      value: stats.followersCount,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      icon: UserPlus,
      label: "Following",
      value: stats.followingCount,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="text-center">
          <div
            className={`h-10 w-10 mx-auto rounded-lg ${item.bg} flex items-center justify-center`}
          >
            <item.icon className={`h-5 w-5 ${item.color}`} />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {item.value.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}

interface LevelProgressProps {
  level: number;
  xp: number;
  nextLevelXp?: number;
}

export function LevelProgress({ level, xp, nextLevelXp = 1000 }: LevelProgressProps) {
  const progress = (xp / nextLevelXp) * 100;

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber to-copper flex items-center justify-center text-white font-bold">
            {level}
          </div>
          <div>
            <p className="font-medium text-foreground">Level {level}</p>
            <p className="text-xs text-muted-foreground">Beer Enthusiast</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {xp.toLocaleString()} XP
          </p>
          <p className="text-xs text-muted-foreground">
            {(nextLevelXp - xp).toLocaleString()} to next level
          </p>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber to-copper rounded-full transition-all"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </Card>
  );
}
