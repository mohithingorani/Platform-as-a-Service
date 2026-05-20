"use client";

import { useEffect, useState } from "react";

export default function HomeBootLoader({ durationMs = 2000 }: { durationMs?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - Math.pow(1 - t, 2.6);
      setValue(Math.min(100, Math.max(0, Math.round(eased * 100))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs]);

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.06] [mask-image:radial-gradient(circle_at_top,black,transparent_70%)]" />
      </div>

      <div className="absolute bottom-8 left-6 sm:bottom-10 sm:left-10">
        <div className="text-xs uppercase tracking-[0.26em] text-zinc-500">Loading</div>
        <div className="mt-2 font-semibold tabular-nums tracking-tight leading-none text-white">
          <span className="text-[88px] sm:text-[112px] md:text-[144px]">{value}</span>
          <span className="ml-2 text-zinc-500 text-[28px] sm:text-[34px] md:text-[40px] align-baseline">%</span>
        </div>
      </div>
    </div>
  );
}
