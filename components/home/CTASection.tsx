"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface CTASectionProps {
  isAuthenticated: boolean;
}

export function CTASection({ isAuthenticated }: CTASectionProps) {
  if (isAuthenticated) return null;

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-stout-800 overflow-hidden">
      {/* Subtle amber gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber/5 via-transparent to-amber/10" />

      {/* Decorative amber glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber/8 blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold font-ui text-foam leading-tight"
        >
          Ready to Discover Your Next Favorite Beer?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 text-lg text-wheat/70 max-w-xl mx-auto"
        >
          Join thousands of craft beer enthusiasts using AI to explore, rate, and
          share
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-amber px-8 py-3.5 text-base font-semibold text-white shadow-beer hover:bg-amber-600 transition-colors focus-ring"
          >
            Get Started Free
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-8 py-3.5 text-base font-semibold text-foam hover:bg-white/10 transition-colors focus-ring"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
