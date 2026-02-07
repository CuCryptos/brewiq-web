"use client";

import { AnimateOnScroll } from "./AnimateOnScroll";

const breweries = [
  "Sierra Nevada",
  "Dogfish Head",
  "Stone Brewing",
  "Lagunitas",
  "Bell's Brewery",
  "Founders Brewing",
  "Deschutes",
  "Firestone Walker",
];

export function SocialProof() {
  return (
    <section className="py-20 overflow-hidden">
      <AnimateOnScroll>
        <h2 className="text-2xl sm:text-3xl font-bold font-ui text-foreground text-center mb-12 px-4">
          Trusted by Craft Beer Lovers Everywhere
        </h2>
      </AnimateOnScroll>

      {/* Infinite scroll carousel */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-scroll">
          {/* First set */}
          <div className="flex shrink-0 gap-6 pr-6">
            {breweries.map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-muted-foreground font-medium whitespace-nowrap bg-card"
              >
                {name}
              </span>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex shrink-0 gap-6 pr-6">
            {breweries.map((name) => (
              <span
                key={`dup-${name}`}
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-muted-foreground font-medium whitespace-nowrap bg-card"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <AnimateOnScroll>
        <blockquote className="mt-14 text-center px-4 max-w-2xl mx-auto">
          <p className="text-lg italic text-foreground/80 leading-relaxed">
            &ldquo;BrewIQ completely changed how I discover new beers. The AI
            scanning is like magic.&rdquo;
          </p>
          <footer className="mt-4 text-sm text-muted-foreground">
            &mdash; @craftbeernerd
          </footer>
        </blockquote>
      </AnimateOnScroll>
    </section>
  );
}
