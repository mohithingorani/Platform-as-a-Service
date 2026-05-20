"use client";

import { useMemo } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Sparkline({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  const d = useMemo(() => {
    if (!values.length) return "";

    const w = 120;
    const h = 36;
    const padX = 2;
    const padY = 4;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const step = (w - padX * 2) / Math.max(1, values.length - 1);
    const points = values.map((v, i) => {
      const x = padX + i * step;
      const t = (v - min) / range;
      const y = padY + (1 - clamp(t, 0, 1)) * (h - padY * 2);
      return { x, y };
    });

    // Build a smooth-ish path with quadratic segments.
    let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = ((prev.x + curr.x) / 2).toFixed(2);
      const cy = ((prev.y + curr.y) / 2).toFixed(2);
      path += ` Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} ${cx} ${cy}`;
    }
    const last = points[points.length - 1];
    path += ` T ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
    return path;
  }, [values]);

  return (
    <svg
      viewBox="0 0 120 36"
      className={className}
      role="img"
      aria-label="trend"
    >
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(59,130,246,0.25)" />
          <stop offset="60%" stopColor="rgba(59,130,246,0.9)" />
          <stop offset="100%" stopColor="rgba(96,165,250,0.6)" />
        </linearGradient>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(59,130,246,0.18)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </linearGradient>
      </defs>

      {d ? (
        <>
          <path
            d={d + " L 118 36 L 2 36 Z"}
            fill="url(#sparkFill)"
            stroke="none"
          />
          <path
            d={d}
            fill="none"
            stroke="url(#spark)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : (
        <rect x="0" y="0" width="120" height="36" fill="transparent" />
      )}
    </svg>
  );
}
