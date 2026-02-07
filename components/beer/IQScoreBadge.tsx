"use client";

import { cn } from "@/lib/utils/cn";
import type { IQTier } from "@/lib/types";

interface IQScoreBadgeProps {
  score: number;
  tier: IQTier;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  className?: string;
}

const tierStyles: Record<IQTier, { bg: string; text: string; ring: string }> = {
  bronze: {
    bg: "bg-gradient-to-br from-amber-600 to-amber-800",
    text: "text-white",
    ring: "ring-amber-600/30",
  },
  silver: {
    bg: "bg-gradient-to-br from-slate-300 to-slate-500",
    text: "text-slate-900",
    ring: "ring-slate-400/30",
  },
  gold: {
    bg: "bg-gradient-to-br from-yellow-400 to-amber-500",
    text: "text-amber-900",
    ring: "ring-yellow-400/30",
  },
  platinum: {
    bg: "bg-gradient-to-br from-slate-200 to-slate-400",
    text: "text-slate-800",
    ring: "ring-slate-300/30",
  },
  diamond: {
    bg: "bg-gradient-to-br from-cyan-300 to-blue-400",
    text: "text-blue-900",
    ring: "ring-cyan-300/30",
  },
};

const sizeStyles = {
  sm: "h-10 w-10 text-xs",
  md: "h-14 w-14 text-sm",
  lg: "h-20 w-20 text-lg",
  xl: "h-28 w-28 text-2xl",
};

export function IQScoreBadge({
  score,
  tier,
  size = "md",
  showLabel = true,
  className,
}: IQScoreBadgeProps) {
  const style = tierStyles[tier];

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full font-bold shadow-lg ring-4",
          style.bg,
          style.text,
          style.ring,
          sizeStyles[size]
        )}
      >
        <span>{score}</span>
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent" />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {tier} IQ
        </span>
      )}
    </div>
  );
}

// Detailed breakdown component
interface IQBreakdownProps {
  breakdown: {
    quality: number;
    complexity: number;
    balance: number;
    uniqueness: number;
  };
  className?: string;
}

export function IQBreakdown({ breakdown, className }: IQBreakdownProps) {
  const categories = [
    { label: "Quality", value: breakdown.quality, color: "bg-green-500" },
    { label: "Complexity", value: breakdown.complexity, color: "bg-blue-500" },
    { label: "Balance", value: breakdown.balance, color: "bg-amber-500" },
    { label: "Uniqueness", value: breakdown.uniqueness, color: "bg-purple-500" },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {categories.map((cat) => (
        <div key={cat.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{cat.label}</span>
            <span className="font-medium">{cat.value}/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", cat.color)}
              style={{ width: `${cat.value}%` }}
              role="progressbar"
              aria-valuenow={cat.value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={cat.label}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
