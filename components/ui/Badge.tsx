"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-amber/10 text-amber-700",
        secondary: "bg-muted text-muted-foreground",
        outline: "border border-border text-foreground",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        destructive: "bg-red-100 text-red-800",
        bronze: "bg-tier-bronze/20 text-tier-bronze",
        silver: "bg-tier-silver/20 text-stout-600",
        gold: "bg-tier-gold/20 text-amber-700",
        platinum: "bg-tier-platinum/30 text-stout-600",
        diamond: "bg-tier-diamond/30 text-cyan-700",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}

// Special badge for IQ tiers
interface IQBadgeProps {
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  score?: number;
  showScore?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function IQBadge({ tier, score, showScore = true, size = "default", className }: IQBadgeProps) {
  const tierLabels = {
    bronze: "Bronze",
    silver: "Silver",
    gold: "Gold",
    platinum: "Platinum",
    diamond: "Diamond",
  };

  return (
    <Badge variant={tier} size={size} className={cn("font-semibold", className)}>
      {showScore && score !== undefined ? `${score} IQ` : tierLabels[tier]}
    </Badge>
  );
}
