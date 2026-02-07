"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  showValue = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((value) => {
          const filled = displayRating >= value;
          const halfFilled = !filled && displayRating >= value - 0.5;

          return (
            <button
              key={value}
              type="button"
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={cn(
                "relative transition-transform",
                !readonly && "hover:scale-110 cursor-pointer",
                readonly && "cursor-default"
              )}
              aria-label={`Rate ${value} stars`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  filled || halfFilled
                    ? "fill-amber text-amber"
                    : "fill-transparent text-muted-foreground/50"
                )}
              />
              {/* Half star overlay */}
              {halfFilled && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: "50%" }}
                >
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "fill-amber text-amber"
                    )}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-foreground">
          {(rating ?? 0).toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Display-only star rating with count
interface RatingDisplayProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingDisplay({
  rating,
  count,
  size = "sm",
  className,
}: RatingDisplayProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Star className={cn(sizeClasses[size], "fill-amber text-amber")} />
      <span className="font-medium text-foreground">{(rating ?? 0).toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
