"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { stats, type Stat } from "./data";

function CountUp({ stat, play }: { stat: Stat; play: boolean }) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? stat.value : 0);

  useEffect(() => {
    if (!play || reduce) {
      setVal(stat.value);
      return;
    }
    let raf = 0;
    const duration = 1100;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * stat.value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, reduce, stat.value]);

  return (
    <span>
      {stat.prefix}
      {val}
      {stat.suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-6 section-subtle">
      <div ref={ref} className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl md:text-5xl font-bold tracking-tighter text-gradient">
              <CountUp stat={s} play={inView} />
            </div>
            <div className="mt-2 text-sm text-text-secondary max-w-[14rem] mx-auto">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
