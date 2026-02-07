"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 50, suffix: "K+", label: "Beers Scanned" },
  { value: 12, suffix: "K+", label: "Reviews Written" },
  { value: 5, suffix: "K+", label: "Breweries" },
  { value: 0, suffix: "AI", label: "Powered IQ Scores" },
];

function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current || target === 0) return;
    hasAnimated.current = true;

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return count;
}

function StatItem({ stat, inView }: { stat: Stat; inView: boolean }) {
  const count = useCountUp(stat.value, inView);

  return (
    <div className="flex flex-col items-center gap-1 py-4">
      <span className="font-ui text-3xl font-bold text-amber sm:text-4xl">
        {stat.value === 0 ? stat.suffix : `${count}${stat.suffix}`}
      </span>
      <span className="text-sm text-stout-300">{stat.label}</span>
    </div>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-10 mx-auto -mt-8 max-w-5xl px-6"
    >
      <div className="glass rounded-2xl shadow-card">
        <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-border">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} inView={inView} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
