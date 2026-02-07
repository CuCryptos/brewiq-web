"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { StarRating } from "./StarRating";
import { FlavorTags, commonFlavorTags } from "@/components/beer/FlavorTags";
import { reviewSchema, type ReviewInput } from "@/lib/utils/validation";
import { reviewsApi } from "@/lib/api/reviews";
import { useUIStore } from "@/lib/stores/uiStore";
import { useQueryClient } from "@tanstack/react-query";

interface ReviewFormProps {
  beerId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ beerId, onSuccess, onCancel }: ReviewFormProps) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      content: "",
      flavorTags: [],
    },
  });

  const rating = watch("rating");

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setValue("flavorTags", newTags);
  };

  const onSubmit = async (data: ReviewInput) => {
    setIsSubmitting(true);
    try {
      await reviewsApi.create({
        beerId,
        rating: data.rating,
        content: data.content,
        flavorTags: data.flavorTags,
      });

      showSuccess("Review submitted!", "Thank you for your review");
      queryClient.invalidateQueries({ queryKey: ["beers", beerId, "reviews"] });
      reset();
      setSelectedTags([]);
      onSuccess?.();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit review";
      showError("Error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Write a Review
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Your Rating
          </label>
          <StarRating
            rating={rating}
            onRatingChange={(value) => setValue("rating", value)}
            size="lg"
            id="review-rating"
            aria-describedby={errors.rating ? "review-rating-error" : undefined}
          />
          {errors.rating && (
            <p id="review-rating-error" className="mt-1 text-sm text-destructive">{errors.rating.message}</p>
          )}
        </div>

        {/* Review content */}
        <Textarea
          label="Your Review"
          placeholder="Share your thoughts on this beer... What did you like? What stood out?"
          rows={4}
          error={errors.content?.message}
          {...register("content")}
        />

        {/* Flavor tags */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Flavor Notes (optional)
          </label>
          <FlavorTags
            tags={commonFlavorTags}
            interactive
            selected={selectedTags}
            onToggle={handleTagToggle}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={isSubmitting}>
            Submit Review
          </Button>
        </div>
      </form>
    </Card>
  );
}
