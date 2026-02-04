"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { sightingSchema, type SightingInput } from "@/lib/utils/validation";
import { sightingsApi } from "@/lib/api/sightings";
import { beersApi } from "@/lib/api/beers";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useUIStore } from "@/lib/stores/uiStore";
import type { Beer } from "@/lib/types";

interface ReportSightingFormProps {
  preselectedBeer?: Beer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const formatOptions = [
  { value: "draft", label: "🍺 Draft" },
  { value: "can", label: "🥫 Can" },
  { value: "bottle", label: "🍾 Bottle" },
  { value: "crowler", label: "🫙 Crowler" },
  { value: "growler", label: "🍶 Growler" },
];

export function ReportSightingForm({
  preselectedBeer,
  onSuccess,
  onCancel,
}: ReportSightingFormProps) {
  const { showSuccess, showError } = useUIStore();
  const { latitude, longitude, getCurrentPosition, isLoading: geoLoading } = useGeolocation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [beerSearch, setBeerSearch] = useState("");
  const [beerResults, setBeerResults] = useState<Beer[]>([]);
  const [selectedBeer, setSelectedBeer] = useState<Beer | null>(preselectedBeer || null);
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SightingInput>({
    resolver: zodResolver(sightingSchema),
    defaultValues: {
      beerId: preselectedBeer?.id || "",
      format: "can",
    },
  });

  // Get user location on mount
  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  // Update form with location
  useEffect(() => {
    if (latitude && longitude) {
      setValue("latitude", latitude);
      setValue("longitude", longitude);
    }
  }, [latitude, longitude, setValue]);

  // Search beers
  useEffect(() => {
    if (!beerSearch.trim() || selectedBeer) {
      setBeerResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await beersApi.search({ query: beerSearch, limit: 5 });
        setBeerResults(results.data);
      } catch {
        // Ignore search errors
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [beerSearch, selectedBeer]);

  const handleSelectBeer = (beer: Beer) => {
    setSelectedBeer(beer);
    setValue("beerId", beer.id);
    setBeerSearch("");
    setBeerResults([]);
  };

  const handleClearBeer = () => {
    setSelectedBeer(null);
    setValue("beerId", "");
  };

  const onSubmit = async (data: SightingInput) => {
    if (!latitude || !longitude) {
      showError("Location required", "Please enable location services");
      return;
    }

    setIsSubmitting(true);
    try {
      await sightingsApi.create({
        ...data,
        latitude,
        longitude,
      });

      showSuccess("Sighting reported!", "Thanks for helping the community");
      reset();
      setSelectedBeer(null);
      onSuccess?.();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to report sighting";
      showError("Error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Beer Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Beer
        </label>
        {selectedBeer ? (
          <Card padding="sm" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber/10 flex items-center justify-center text-xl">
                🍺
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedBeer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedBeer.brewery?.name}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearBeer}
            >
              Change
            </Button>
          </Card>
        ) : (
          <div className="relative">
            <Input
              placeholder="Search for a beer..."
              value={beerSearch}
              onChange={(e) => setBeerSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              rightIcon={isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
              error={errors.beerId?.message}
            />
            {beerResults.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                {beerResults.map((beer) => (
                  <button
                    key={beer.id}
                    type="button"
                    onClick={() => handleSelectBeer(beer)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted text-left transition-colors"
                  >
                    <div className="h-8 w-8 rounded bg-amber/10 flex items-center justify-center text-lg">
                      🍺
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {beer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {beer.brewery?.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location */}
      <div>
        <Input
          label="Location Name"
          placeholder="e.g., Joe's Liquor Store, Main Street Bar"
          error={errors.locationName?.message}
          {...register("locationName")}
        />
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {geoLoading ? (
            <span>Getting your location...</span>
          ) : latitude && longitude ? (
            <span>Location detected ✓</span>
          ) : (
            <button
              type="button"
              onClick={getCurrentPosition}
              className="text-amber hover:underline"
            >
              Enable location
            </button>
          )}
        </div>
      </div>

      {/* Format */}
      <Select
        label="Format"
        options={formatOptions}
        error={errors.format?.message}
        {...register("format")}
      />

      {/* Price */}
      <Input
        label="Price (optional)"
        type="number"
        step="0.01"
        placeholder="0.00"
        leftIcon={<span className="text-muted-foreground">$</span>}
        {...register("price", { valueAsNumber: true })}
      />

      {/* Notes */}
      <Textarea
        label="Notes (optional)"
        placeholder="Any additional details (freshness, quantity, etc.)"
        rows={3}
        {...register("notes")}
      />

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!selectedBeer || !latitude || !longitude}
          className="flex-1"
        >
          Report Sighting
        </Button>
      </div>
    </form>
  );
}
