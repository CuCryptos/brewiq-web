"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Beaker,
  GitFork,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRecipe, useForkRecipe } from "@/lib/hooks/useRecipes";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatABV, formatIBU, formatDate } from "@/lib/utils/format";

export default function RecipeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isAuthenticated } = useAuth();

  const { data: recipe, isLoading } = useRecipe(slug);
  const forkMutation = useForkRecipe();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-48 w-full rounded-xl mb-6" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Recipe not found"
          description="The recipe you're looking for doesn't exist or has been removed."
          action={
            <Link href="/recipes">
              <Button>Browse recipes</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <Link
        href="/recipes"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to recipes
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="h-16 w-16 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
          <Beaker className="h-8 w-8 text-green-500" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{recipe.name}</h1>
          <p className="text-muted-foreground">{recipe.style?.name}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary">{formatABV(recipe.abv)}</Badge>
            <Badge variant="secondary">{formatIBU(recipe.ibu)}</Badge>
            <Badge variant="outline">
              {recipe.batchSize} {recipe.batchSizeUnit}
            </Badge>
          </div>
        </div>
      </div>

      {/* Author & Stats */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/profile/${recipe.user.username}`}
            className="flex items-center gap-3 hover:opacity-80"
          >
            <Avatar
              src={recipe.user.avatar}
              fallback={recipe.user.username}
              size="md"
            />
            <div>
              <p className="font-medium text-foreground">
                {recipe.user.displayName || recipe.user.username}
              </p>
              <p className="text-sm text-muted-foreground">
                Created {formatDate(recipe.createdAt)}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Beaker className="h-4 w-4" />
              {recipe.brewCount} brewed
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              {recipe.forkCount} forked
            </span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-2 mb-6">
        {isAuthenticated && (
          <>
            <Button
              onClick={() => forkMutation.mutate(recipe.id)}
              isLoading={forkMutation.isPending}
            >
              <GitFork className="h-4 w-4 mr-2" />
              Fork Recipe
            </Button>
            <Button variant="outline">
              <Check className="h-4 w-4 mr-2" />
              I Brewed This
            </Button>
          </>
        )}
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Clone info */}
      {recipe.clonedFromBeer && (
        <Card className="mb-6 bg-amber/5 border-amber/20">
          <p className="text-sm">
            This recipe is a clone of{" "}
            <Link
              href={`/beers/${recipe.clonedFromBeer.slug}`}
              className="text-amber font-medium hover:underline"
            >
              {recipe.clonedFromBeer.name}
            </Link>{" "}
            by {recipe.clonedFromBeer.brewery?.name}
          </p>
        </Card>
      )}

      {/* Description */}
      {recipe.description && (
        <Card className="mb-6">
          <h2 className="font-semibold text-foreground mb-2">Description</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {recipe.description}
          </p>
        </Card>
      )}

      {/* Recipe Stats */}
      <Card className="mb-6">
        <h2 className="font-semibold text-foreground mb-4">Recipe Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Original Gravity</p>
            <p className="font-medium text-foreground">{recipe.originalGravity.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Final Gravity</p>
            <p className="font-medium text-foreground">{recipe.finalGravity.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ABV</p>
            <p className="font-medium text-foreground">{recipe.abv.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">IBU</p>
            <p className="font-medium text-foreground">{recipe.ibu}</p>
          </div>
        </div>
      </Card>

      {/* Fermentables */}
      <Card className="mb-6">
        <h2 className="font-semibold text-foreground mb-4">Fermentables</h2>
        <div className="space-y-2">
          {recipe.fermentables.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <span className="text-foreground">{f.name}</span>
              <span className="text-muted-foreground">
                {f.amount} {f.unit}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Hops */}
      <Card className="mb-6">
        <h2 className="font-semibold text-foreground mb-4">Hops</h2>
        <div className="space-y-2">
          {recipe.hops.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <span className="text-foreground">{h.name}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({h.use}, {h.timing} min)
                </span>
              </div>
              <span className="text-muted-foreground">
                {h.amount} {h.unit}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Yeast */}
      <Card className="mb-6">
        <h2 className="font-semibold text-foreground mb-4">Yeast</h2>
        <div className="flex items-center justify-between">
          <span className="text-foreground">{recipe.yeast.name}</span>
          {recipe.yeast.brand && (
            <span className="text-muted-foreground">{recipe.yeast.brand}</span>
          )}
        </div>
      </Card>

      {/* Mash Steps */}
      {recipe.mashSteps && recipe.mashSteps.length > 0 && (
        <Card className="mb-6">
          <h2 className="font-semibold text-foreground mb-4">Mash Steps</h2>
          <div className="space-y-2">
            {recipe.mashSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-foreground">{step.name}</span>
                <span className="text-muted-foreground">
                  {step.temperature}°F for {step.duration} min
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Instructions */}
      {recipe.instructions && (
        <Card>
          <h2 className="font-semibold text-foreground mb-4">Instructions</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {recipe.instructions}
          </p>
        </Card>
      )}
    </div>
  );
}
