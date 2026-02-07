"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useTrendingBeers } from "@/lib/hooks";
import {
  HeroSection,
  StatsBar,
  HowItWorks,
  TrendingSection,
  FeatureGrid,
  PhilosophySection,
  SocialProof,
  CTASection,
} from "@/components/home";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const { data: trendingBeers, isLoading: trendingLoading } = useTrendingBeers(6);

  return (
    <div className="space-y-0">
      {/* Immersive Hero */}
      <HeroSection
        isAuthenticated={isAuthenticated}
        userName={user?.displayName || user?.username}
      />

      {/* Animated Stats Strip */}
      <StatsBar />

      {/* How It Works — 3 Step Flow */}
      <HowItWorks />

      {/* Trending Beers Carousel */}
      <TrendingSection beers={trendingBeers || []} isLoading={trendingLoading} />

      {/* Feature Showcase Grid */}
      <FeatureGrid />

      {/* Mission / Philosophy */}
      <PhilosophySection />

      {/* Social Proof — Brewery Carousel */}
      <SocialProof />

      {/* Final CTA (non-auth only) */}
      <CTASection isAuthenticated={isAuthenticated} />
    </div>
  );
}
