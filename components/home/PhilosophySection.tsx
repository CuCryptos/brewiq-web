"use client";

import { Brain, BarChart3, Users } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const miniStats = [
  {
    icon: Brain,
    title: "Smart Scanning",
    description: "Instant beer identification powered by AI",
  },
  {
    icon: BarChart3,
    title: "Precision Ratings",
    description: "Data-driven IQ scores across 4 dimensions",
  },
  {
    icon: Users,
    title: "Community Sourced",
    description: "Real sightings and reviews from real enthusiasts",
  },
];

export function PhilosophySection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: editorial content */}
        <AnimateOnScroll direction="left">
          <div>
            <div className="w-16 h-1 bg-amber rounded-full mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display leading-tight text-foreground mb-6">
              Where Craft Meets Intelligence
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              BrewIQ combines centuries of brewing tradition with cutting-edge AI
              to help you discover, understand, and appreciate great beer. Whether
              you&apos;re a seasoned connoisseur or just starting your craft beer
              journey, our intelligent platform guides you to your next favorite
              pour.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Right: mini stat cards */}
        <AnimateOnScroll direction="right">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {miniStats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-xl border border-border p-5 bg-card"
              >
                <stat.icon className="h-6 w-6 text-amber mb-3" />
                <h3 className="font-semibold font-ui text-foreground mb-1">
                  {stat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
