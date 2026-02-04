"use client";

import Link from "next/link";
import { Beaker, GitFork } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { Recipe } from "@/lib/types";
import { formatABV, formatIBU } from "@/lib/utils/format";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.slug}`}>
      <Card hover>
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
            <Beaker className="h-7 w-7 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{recipe.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {recipe.style?.name}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" size="sm">
                {formatABV(recipe.abv)}
              </Badge>
              <Badge variant="secondary" size="sm">
                {formatIBU(recipe.ibu)}
              </Badge>
              <Badge variant="outline" size="sm">
                {recipe.batchSize} {recipe.batchSizeUnit}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Avatar
              src={recipe.user.avatar}
              fallback={recipe.user.username}
              size="xs"
            />
            <span className="text-sm text-muted-foreground">
              {recipe.user.username}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Beaker className="h-3.5 w-3.5" />
              {recipe.brewCount}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-3.5 w-3.5" />
              {recipe.forkCount}
            </span>
          </div>
        </div>

        {recipe.clonedFromBeer && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Clone of{" "}
              <span className="text-amber font-medium">{recipe.clonedFromBeer.name}</span>
            </p>
          </div>
        )}
      </Card>
    </Link>
  );
}
