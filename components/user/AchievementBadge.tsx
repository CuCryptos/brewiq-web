"use client";

import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Achievement } from "@/lib/types";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
}

const tierColors = {
  bronze: "from-amber-600 to-amber-800 ring-amber-600/30",
  silver: "from-slate-300 to-slate-500 ring-slate-400/30",
  gold: "from-yellow-400 to-amber-500 ring-yellow-400/30",
  platinum: "from-slate-200 to-slate-400 ring-slate-300/30",
};

const sizeClasses = {
  sm: "h-12 w-12 text-xl",
  md: "h-16 w-16 text-2xl",
  lg: "h-20 w-20 text-3xl",
};

export function AchievementBadge({
  achievement,
  size = "md",
  showProgress = false,
}: AchievementBadgeProps) {
  const isUnlocked = !!achievement.unlockedAt;
  const progress = achievement.progress || 0;
  const maxProgress = achievement.maxProgress || 100;
  const progressPercent = (progress / maxProgress) * 100;

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full ring-4 transition-all",
          sizeClasses[size],
          isUnlocked
            ? `bg-gradient-to-br ${tierColors[achievement.tier]}`
            : "bg-muted ring-muted-foreground/20"
        )}
      >
        {isUnlocked ? (
          <span>{achievement.icon}</span>
        ) : (
          <Lock className="h-1/3 w-1/3 text-muted-foreground" />
        )}

        {/* Unlocked indicator */}
        {isUnlocked && (
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-card">
            <Check className="h-3 w-3 text-white" />
          </div>
        )}
      </div>

      <div>
        <p
          className={cn(
            "text-sm font-medium",
            isUnlocked ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {achievement.name}
        </p>
        <p className="text-xs text-muted-foreground max-w-[120px]">
          {achievement.description}
        </p>
      </div>

      {/* Progress bar */}
      {showProgress && !isUnlocked && achievement.maxProgress && (
        <div className="w-full max-w-[100px]">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-amber rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {progress}/{maxProgress}
          </p>
        </div>
      )}

      {/* XP Reward */}
      {isUnlocked && (
        <p className="text-xs text-amber font-medium">+{achievement.xpReward} XP</p>
      )}
    </div>
  );
}

interface AchievementGridProps {
  achievements: Achievement[];
  showAll?: boolean;
}

export function AchievementGrid({ achievements, showAll = false }: AchievementGridProps) {
  const displayed = showAll ? achievements : achievements.slice(0, 8);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
      {displayed.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size="sm"
          showProgress
        />
      ))}
    </div>
  );
}
