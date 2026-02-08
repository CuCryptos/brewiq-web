"use client";

import Link from "next/link";
import { MapPin, Clock, Check, X, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Sighting } from "@/lib/types";
import { formatRelativeTime, formatPrice, formatDistanceMiles } from "@/lib/utils/format";
import { sightingsApi } from "@/lib/api/sightings";
import { useUIStore } from "@/lib/stores/uiStore";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { AuthPrompt, useAuthPrompt } from "@/components/ui/AuthPrompt";

interface SightingCardProps {
  sighting: Sighting;
  userLocation?: { latitude: number; longitude: number } | null;
  onConfirm?: () => void;
  onReportMissing?: () => void;
}

const formatBadges: Record<string, string> = {
  draft: "🍺 Draft",
  can: "🥫 Can",
  bottle: "🍾 Bottle",
  crowler: "🫙 Crowler",
  growler: "🍶 Growler",
};

export function SightingCard({
  sighting,
  userLocation,
  onConfirm,
  onReportMissing,
}: SightingCardProps) {
  const { isAuthenticated } = useAuth();
  const { isOpen: authPromptOpen, config: authConfig, showAuthPrompt, closeAuthPrompt } = useAuthPrompt();
  const { showSuccess, showError } = useUIStore();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      showAuthPrompt("Confirm Sighting", "Sign up to confirm beer sightings and help others find great beers.");
      return;
    }
    setIsConfirming(true);
    try {
      await sightingsApi.confirm(sighting.id);
      showSuccess("Confirmed!", "Thanks for confirming this sighting");
      onConfirm?.();
    } catch {
      showError("Error", "Could not confirm sighting");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReportMissing = async () => {
    if (!isAuthenticated) {
      showAuthPrompt("Report Sighting", "Sign up to report sighting updates.");
      return;
    }
    setIsReporting(true);
    try {
      await sightingsApi.reportMissing(sighting.id);
      showSuccess("Reported", "Thanks for letting us know");
      onReportMissing?.();
    } catch {
      showError("Error", "Could not report sighting");
    } finally {
      setIsReporting(false);
    }
  };

  // Calculate distance if user location is available
  let distance: number | null = null;
  if (userLocation) {
    const R = 6371e3;
    const phi1 = (userLocation.latitude * Math.PI) / 180;
    const phi2 = (sighting.latitude * Math.PI) / 180;
    const deltaPhi = ((sighting.latitude - userLocation.latitude) * Math.PI) / 180;
    const deltaLambda = ((sighting.longitude - userLocation.longitude) * Math.PI) / 180;
    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance = R * c;
  }

  return (
    <>
    <Card hover>
      {/* Beer Info */}
      <div className="flex items-start gap-3 mb-4">
        <div className="h-12 w-12 rounded-lg bg-amber/10 flex items-center justify-center text-2xl shrink-0">
          🍺
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={`/beers/${sighting.beer.slug}`}
            className="font-semibold text-foreground hover:text-amber truncate block"
          >
            {sighting.beer.name}
          </Link>
          <p className="text-sm text-muted-foreground truncate">
            {sighting.beer.brewery?.name}
          </p>
        </div>
        <Badge variant="secondary">{formatBadges[sighting.format]}</Badge>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">{sighting.locationName}</p>
          {distance !== null && (
            <p className="text-xs text-muted-foreground">
              {formatDistanceMiles(distance)} away
            </p>
          )}
        </div>
      </div>

      {/* Price */}
      {sighting.price && (
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-4 w-4 text-green-500" />
          <p className="text-sm text-foreground">{formatPrice(sighting.price)}</p>
        </div>
      )}

      {/* Notes */}
      {sighting.notes && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {sighting.notes}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Avatar
            src={sighting.user.avatar}
            fallback={sighting.user.username}
            size="xs"
          />
          <span className="text-xs text-muted-foreground">
            {sighting.user.username}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(sighting.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Check className="h-3 w-3 text-green-500" />
          {sighting.confirmedCount}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleConfirm}
          isLoading={isConfirming}
          className="flex-1"
        >
          <Check className="h-4 w-4 mr-1" />
          Still here
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReportMissing}
          isLoading={isReporting}
          className="flex-1 text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Gone
        </Button>
      </div>
    </Card>
    <AuthPrompt isOpen={authPromptOpen} onClose={closeAuthPrompt} title={authConfig.title} message={authConfig.message} />
    </>
  );
}
