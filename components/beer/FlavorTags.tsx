"use client";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

interface FlavorTagsProps {
  tags: string[];
  max?: number;
  interactive?: boolean;
  selected?: string[];
  onToggle?: (tag: string) => void;
  className?: string;
}

// Map of flavor tags to their associated colors
const flavorColors: Record<string, string> = {
  // Hop flavors
  citrus: "bg-yellow-100 text-yellow-800 border-yellow-200",
  tropical: "bg-orange-100 text-orange-800 border-orange-200",
  piney: "bg-green-100 text-green-800 border-green-200",
  floral: "bg-pink-100 text-pink-800 border-pink-200",
  herbal: "bg-emerald-100 text-emerald-800 border-emerald-200",
  grassy: "bg-lime-100 text-lime-800 border-lime-200",
  resinous: "bg-teal-100 text-teal-800 border-teal-200",

  // Malt flavors
  biscuit: "bg-amber-100 text-amber-800 border-amber-200",
  caramel: "bg-orange-100 text-orange-800 border-orange-200",
  chocolate: "bg-stone-200 text-stone-800 border-stone-300",
  coffee: "bg-stone-300 text-stone-900 border-stone-400",
  roasted: "bg-neutral-200 text-neutral-800 border-neutral-300",
  toffee: "bg-amber-100 text-amber-800 border-amber-200",
  bread: "bg-yellow-100 text-yellow-800 border-yellow-200",

  // Fruit flavors
  apple: "bg-red-100 text-red-800 border-red-200",
  berry: "bg-purple-100 text-purple-800 border-purple-200",
  cherry: "bg-rose-100 text-rose-800 border-rose-200",
  peach: "bg-orange-100 text-orange-800 border-orange-200",
  plum: "bg-violet-100 text-violet-800 border-violet-200",
  banana: "bg-yellow-100 text-yellow-800 border-yellow-200",

  // Spice/Other
  spicy: "bg-red-100 text-red-800 border-red-200",
  peppery: "bg-slate-100 text-slate-800 border-slate-200",
  clove: "bg-amber-100 text-amber-800 border-amber-200",
  vanilla: "bg-cream-100 text-amber-800 border-amber-200",

  // General
  bitter: "bg-emerald-100 text-emerald-800 border-emerald-200",
  sweet: "bg-pink-100 text-pink-800 border-pink-200",
  sour: "bg-yellow-100 text-yellow-800 border-yellow-200",
  crisp: "bg-blue-100 text-blue-800 border-blue-200",
  smooth: "bg-slate-100 text-slate-800 border-slate-200",
  dry: "bg-stone-100 text-stone-800 border-stone-200",
};

function getFlavorColor(tag: string): string {
  const normalizedTag = tag.toLowerCase();
  return flavorColors[normalizedTag] || "bg-muted text-muted-foreground border-border";
}

export function FlavorTags({
  tags,
  max,
  interactive = false,
  selected = [],
  onToggle,
  className,
}: FlavorTagsProps) {
  const displayTags = max ? tags.slice(0, max) : tags;
  const remainingCount = max && tags.length > max ? tags.length - max : 0;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {displayTags.map((tag) => {
        const isSelected = selected.includes(tag);
        const colorClass = getFlavorColor(tag);

        if (interactive) {
          return (
            <button
              key={tag}
              onClick={() => onToggle?.(tag)}
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all",
                colorClass,
                isSelected && "ring-2 ring-offset-1 ring-amber",
                "hover:opacity-80"
              )}
            >
              {tag}
            </button>
          );
        }

        return (
          <span
            key={tag}
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
              colorClass
            )}
          >
            {tag}
          </span>
        );
      })}
      {remainingCount > 0 && (
        <Badge variant="secondary" size="sm">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}

// Common flavor tags for selection UI
export const commonFlavorTags = [
  "Citrus",
  "Tropical",
  "Piney",
  "Floral",
  "Herbal",
  "Grassy",
  "Biscuit",
  "Caramel",
  "Chocolate",
  "Coffee",
  "Roasted",
  "Toffee",
  "Berry",
  "Cherry",
  "Peach",
  "Banana",
  "Spicy",
  "Vanilla",
  "Bitter",
  "Sweet",
  "Sour",
  "Crisp",
  "Smooth",
  "Dry",
];
