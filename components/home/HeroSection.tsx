"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Camera, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface HeroSectionProps {
  isAuthenticated: boolean;
  userName?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function HeroSection({ isAuthenticated, userName }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-stout-800 py-20 lg:py-32">
      {/* Decorative background layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Large blurred amber circle — top right */}
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-amber-400/20 blur-3xl" />
        {/* Smaller copper circle — bottom left */}
        <div className="absolute -bottom-24 -left-24 h-[350px] w-[350px] rounded-full bg-copper/15 blur-3xl" />
        {/* Subtle hop dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #9A6200 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row lg:gap-16">
        {/* Left — Text content */}
        <motion.div
          className="flex max-w-2xl flex-1 flex-col items-center text-center lg:items-start lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={childVariants}
            className="font-ui text-4xl font-bold leading-tight tracking-tight text-foam sm:text-5xl lg:text-6xl"
          >
            {isAuthenticated
              ? `Welcome back, ${userName ?? "Brewer"}`
              : "Discover Your Next Favorite Beer"}
          </motion.h1>

          <motion.p
            variants={childVariants}
            className="mt-6 max-w-lg text-lg leading-relaxed text-stout-200"
          >
            AI-powered scanning, ratings, and personalized recommendations for
            craft beer enthusiasts.
          </motion.p>

          <motion.div
            variants={childVariants}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/scan"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 bg-amber text-stout-800 shadow-beer hover:bg-amber-500"
              )}
            >
              <Camera className="h-5 w-5" />
              Scan a Beer
            </Link>
            <Link
              href="/explore"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2 border-white/30 text-foam hover:bg-white/10 hover:text-foam"
              )}
            >
              <Search className="h-5 w-5" />
              Explore Beers
            </Link>
          </motion.div>
        </motion.div>

        {/* Right — Decorative composition */}
        <motion.div
          className="relative hidden flex-1 items-center justify-center lg:flex"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className="relative flex h-72 w-72 items-center justify-center xl:h-96 xl:w-96">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-2xl" />
            {/* Inner glass circle with ai-glow */}
            <div className="ai-glow absolute inset-8 rounded-full bg-gradient-beer opacity-20 animate-pulse-slow" />
            {/* Beer icon */}
            <span className="relative text-[120px] opacity-30 xl:text-[160px]">
              🍺
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
