import { Zap } from "lucide-react";

const sizes = {
  sm: { box: "w-8 h-8 rounded-lg", icon: "w-4 h-4" },
  md: { box: "w-9 h-9 rounded-xl", icon: "w-[18px] h-[18px]" },
  lg: { box: "w-10 h-10 rounded-xl", icon: "w-5 h-5" },
} as const;

/**
 * The single Voltex logo mark — a gradient square with the Zap bolt.
 * Use this everywhere instead of hand-rolled "V" letters so the brand icon
 * stays identical across the landing page, auth, and dashboard.
 */
export default function BrandMark({
  size = "sm",
  className = "",
}: {
  size?: keyof typeof sizes;
  className?: string;
}) {
  const s = sizes[size];
  return (
    <div
      className={`${s.box} bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg shadow-accent/20 ${className}`}
    >
      <Zap className={`${s.icon} text-white`} fill="currentColor" />
    </div>
  );
}
