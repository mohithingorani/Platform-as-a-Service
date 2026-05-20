"use client";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
}: StatsCardProps) {
  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-text-muted",
  };

  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 hover:border-border-hover transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
          <p className="text-text-primary text-2xl font-semibold">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function StatsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  );
}