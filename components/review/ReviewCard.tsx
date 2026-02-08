"use client";

import Link from "next/link";
import Image from "next/image";
import { ThumbsUp, Flag, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "./StarRating";
import { FlavorTags } from "@/components/beer/FlavorTags";
import type { Review } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils/format";
import { useState, useRef, useEffect } from "react";
import { reviewsApi } from "@/lib/api/reviews";
import { useUIStore } from "@/lib/stores/uiStore";
import { useAuth } from "@/lib/hooks/useAuth";
import { AuthPrompt, useAuthPrompt } from "@/components/ui/AuthPrompt";

interface ReviewCardProps {
  review: Review;
  showBeer?: boolean;
}

export function ReviewCard({ review, showBeer = false }: ReviewCardProps) {
  const { isAuthenticated } = useAuth();
  const { isOpen: authPromptOpen, config: authConfig, showAuthPrompt, closeAuthPrompt } = useAuthPrompt();
  const { showSuccess, showError } = useUIStore();
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [isMarkedHelpful, setIsMarkedHelpful] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const actionsTriggerRef = useRef<HTMLButtonElement>(null);
  const reportBtnRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showActions) return;
    function handleClickOutside(event: MouseEvent) {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showActions]);

  // Focus first menu item when dropdown opens
  useEffect(() => {
    if (showActions) {
      requestAnimationFrame(() => {
        reportBtnRef.current?.focus();
      });
    }
  }, [showActions]);

  const handleActionsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setShowActions(false);
      actionsTriggerRef.current?.focus();
    }
  };

  const handleMarkHelpful = async () => {
    if (!isAuthenticated) {
      showAuthPrompt("Vote on Reviews", "Sign up to vote on reviews and help the community.");
      return;
    }
    try {
      if (isMarkedHelpful) {
        await reviewsApi.unmarkHelpful(review.id);
        setHelpfulCount((c) => c - 1);
        setIsMarkedHelpful(false);
      } else {
        await reviewsApi.markHelpful(review.id);
        setHelpfulCount((c) => c + 1);
        setIsMarkedHelpful(true);
      }
    } catch {
      showError("Error", "Could not update helpful status");
    }
  };

  const handleReport = async () => {
    try {
      await reviewsApi.report(review.id, "inappropriate");
      showSuccess("Reported", "Thank you for helping keep BrewIQ safe");
      setShowActions(false);
    } catch {
      showError("Error", "Could not report review");
    }
  };

  return (
    <>
    <Card padding="md">
      <div className="flex items-start gap-3">
        <Link href={`/profile/${review.user.username}`}>
          <Avatar
            src={review.user.avatar}
            fallback={review.user.displayName || review.user.username}
            size="md"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={`/profile/${review.user.username}`}
                className="font-medium text-foreground hover:underline"
              >
                {review.user.displayName || review.user.username}
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={review.rating} readonly size="sm" />
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(review.createdAt)}
                </span>
              </div>
            </div>
            <div className="relative" ref={actionsRef}>
              <Button
                ref={actionsTriggerRef}
                variant="ghost"
                size="icon"
                onClick={() => setShowActions(!showActions)}
                aria-label="Review actions"
                aria-haspopup="menu"
                aria-expanded={showActions}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {showActions && (
                <div
                  role="menu"
                  aria-label="Review actions"
                  onKeyDown={handleActionsKeyDown}
                  className="absolute right-0 mt-1 w-32 rounded-lg border border-border bg-card shadow-lg z-10"
                >
                  <button
                    ref={reportBtnRef}
                    role="menuitem"
                    onClick={handleReport}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"
                  >
                    <Flag className="h-4 w-4" />
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>

          {showBeer && review.beer && (
            <Link
              href={`/beers/${review.beer.slug}`}
              className="mt-2 inline-flex items-center gap-2 text-sm text-amber hover:underline"
            >
              <span className="text-lg">🍺</span>
              {review.beer.name}
            </Link>
          )}

          {review.imageUrl && (
            <div className="mt-3 relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={review.imageUrl}
                alt={`AI-generated image for ${review.beer?.name || 'beer'} review`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          )}

          <p className="mt-3 text-foreground whitespace-pre-wrap">
            {review.content}
          </p>

          {review.flavorTags && review.flavorTags.length > 0 && (
            <div className="mt-3">
              <FlavorTags tags={review.flavorTags} max={6} />
            </div>
          )}

          {review.isVerified && (
            <Badge variant="success" size="sm" className="mt-3">
              Verified Purchase
            </Badge>
          )}

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
            <button
              onClick={handleMarkHelpful}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isMarkedHelpful
                  ? "text-amber"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${isMarkedHelpful ? "fill-amber" : ""}`} />
              Helpful {helpfulCount > 0 && `(${helpfulCount})`}
            </button>
          </div>
        </div>
      </div>
    </Card>
    <AuthPrompt isOpen={authPromptOpen} onClose={closeAuthPrompt} title={authConfig.title} message={authConfig.message} />
    </>
  );
}
