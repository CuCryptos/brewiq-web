"use client";

import { Camera, Zap, Users } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Scan",
    description:
      "Point your camera at any beer label, menu, or tap handle.",
  },
  {
    number: "02",
    icon: Zap,
    title: "Discover",
    description:
      "Get instant AI-powered IQ scores, tasting notes, and food pairings.",
  },
  {
    number: "03",
    icon: Users,
    title: "Share",
    description:
      "Rate, review, and help others find great beers nearby.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <AnimateOnScroll className="mb-16 text-center">
          <h2 className="font-ui text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-amber" />
        </AnimateOnScroll>

        {/* Steps grid */}
        <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Connecting dashed line — desktop only */}
          <div className="pointer-events-none absolute left-0 right-0 top-[72px] hidden md:block">
            <div className="mx-auto h-px max-w-[66%] border-t-2 border-dashed border-amber-200" />
          </div>

          {steps.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 0.15}>
              <div className="relative flex flex-col items-center text-center">
                {/* Large step number in background */}
                <span className="pointer-events-none absolute -top-4 font-ui text-7xl font-bold text-amber/10">
                  {step.number}
                </span>

                {/* Icon circle */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-amber/10">
                  <step.icon className="h-7 w-7 text-amber" />
                </div>

                {/* Text */}
                <h3 className="mt-6 font-ui text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
