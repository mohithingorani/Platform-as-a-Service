"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Sparkline from "./Sparkline";

export default function MetricCard({
  title,
  value,
  icon,
  delta,
  deltaTone = "neutral",
  series,
}: {
  title: string;
  value: number;
  icon?: React.ReactNode;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  series?: number[];
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(display, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const deltaClass = useMemo(() => {
    if (!delta) return "";
    if (deltaTone === "positive") return "text-emerald-400";
    if (deltaTone === "negative") return "text-red-400";
    return "text-zinc-400";
  }, [delta, deltaTone]);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative overflow-hidden rounded-2xl border border-zinc-800/70 bg-zinc-900/40 backdrop-blur-xl"
    >
 

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium tracking-wide text-zinc-400">
              {title}
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {display}
            </div>
            {delta ? (
              <div className={`mt-2 text-xs ${deltaClass}`}>{delta}</div>
            ) : null}
          </div>

          <div className="flex flex-col items-end gap-3">
            {icon ? (
              <div className="h-10 w-10 rounded-xl border border-blue-500/15 bg-blue-500/10 text-blue-300 flex items-center justify-center">
                {icon}
              </div>
            ) : null}
            {series?.length ? (
              <Sparkline values={series} className="h-9 w-[120px]" />
            ) : (
              <div className="h-9 w-[120px] rounded-lg border border-zinc-800/60 bg-zinc-950/30" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
