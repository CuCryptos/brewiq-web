"use client";

import {
  Camera,
  Star,
  MapPin,
  BookOpen,
  Trophy,
  Users,
} from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const features = [
  {
    icon: Camera,
    color: "bg-amber-100 text-amber",
    title: "AI Beer Scanning",
    description:
      "Point, scan, and instantly identify any beer with our AI-powered recognition",
  },
  {
    icon: Star,
    color: "bg-signal/10 text-signal",
    title: "IQ Scores",
    description:
      "Every beer rated on quality, complexity, balance, and uniqueness",
  },
  {
    icon: MapPin,
    color: "bg-blue-100 text-blue-600",
    title: "Beer Sightings",
    description:
      "Crowdsourced availability tracking — like Waze, but for beer",
  },
  {
    icon: BookOpen,
    color: "bg-purple-100 text-purple-600",
    title: "Homebrew Recipes",
    description:
      "Clone commercial beers or discover community recipes to brew at home",
  },
  {
    icon: Trophy,
    color: "bg-amber-100 text-amber",
    title: "Achievements & XP",
    description:
      "Level up as you scan, review, and explore — compete on the leaderboard",
  },
  {
    icon: Users,
    color: "bg-green-100 text-green-600",
    title: "Community",
    description:
      "Connect with craft beer enthusiasts, share reviews, and discover together",
  },
] as const;

export function FeatureGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimateOnScroll>
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-ui text-foreground">
            Everything You Need
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            The smartest way to explore craft beer
          </p>
        </div>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <AnimateOnScroll key={feature.title} delay={i * 0.1}>
            <div className="rounded-xl border border-border p-6 card-hover bg-card">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full ${feature.color} mb-4`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold font-ui text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
