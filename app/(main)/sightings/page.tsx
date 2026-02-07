"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { MapPin, List, Plus, Navigation } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SightingCard } from "@/components/sighting/SightingCard";
import { useNearbySightings } from "@/lib/hooks/useSightings";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useAuth } from "@/lib/hooks/useAuth";

function SightingsPageContent() {
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const {
    latitude,
    longitude,
    getCurrentPosition,
    isLoading: geoLoading,
    error: geoError,
  } = useGeolocation();

  const { data: sightings, isLoading, refetch } = useNearbySightings(
    latitude,
    longitude,
    25, // 25km radius
    50
  );

  const userLocation =
    latitude && longitude ? { latitude, longitude } : null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Beer Sightings</h1>
          <p className="text-muted-foreground mt-1">
            Find where beers are available near you
          </p>
        </div>
        {isAuthenticated && (
          <Link href="/sightings/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Report Sighting
            </Button>
          </Link>
        )}
      </div>

      {/* Location Status */}
      {!userLocation && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Navigation className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Enable location</p>
                <p className="text-sm text-blue-700">
                  {geoError || "Find beer sightings near you"}
                </p>
              </div>
            </div>
            <Button
              onClick={getCurrentPosition}
              isLoading={geoLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Enable
            </Button>
          </div>
        </Card>
      )}

      {/* View Toggle */}
      <Tabs defaultValue="list" value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "map")}>
        <TabsList className="mb-6">
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            List
          </TabsTrigger>
          <TabsTrigger value="map">
            <MapPin className="h-4 w-4 mr-2" />
            Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {isLoading ? (
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-32 w-full" />
                  </Card>
                ))}
            </div>
          ) : !userLocation ? (
            <EmptyState
              icon={<Navigation className="h-8 w-8" />}
              title="Location required"
              description="Enable location services to see nearby beer sightings."
              action={
                <Button onClick={getCurrentPosition} isLoading={geoLoading}>
                  Enable Location
                </Button>
              }
            />
          ) : sightings && sightings.length > 0 ? (
            <div className="space-y-4">
              {sightings.map((sighting) => (
                <SightingCard
                  key={sighting.id}
                  sighting={sighting}
                  userLocation={userLocation}
                  onConfirm={() => refetch()}
                  onReportMissing={() => refetch()}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MapPin className="h-8 w-8" />}
              title="No sightings nearby"
              description="Be the first to report a beer sighting in your area!"
              action={
                isAuthenticated ? (
                  <Link href="/sightings/new">
                    <Button>Report Sighting</Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button>Sign in to report</Button>
                  </Link>
                )
              }
            />
          )}
        </TabsContent>

        <TabsContent value="map">
          <Card className="h-[500px] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground">Map View</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Map view requires a Mapbox API key. Set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SightingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-32 w-full" />
                </Card>
              ))}
          </div>
        </div>
      }
    >
      <SightingsPageContent />
    </Suspense>
  );
}
