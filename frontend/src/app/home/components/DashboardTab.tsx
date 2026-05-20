"use client";

import { Activity, Loader2, Settings, Sparkles } from "lucide-react";
import MetricCard from "./MetricCard";
import RecentDeploymentsCard from "./RecentDeploymentsCard";
import type { Deployment } from "../types";

export default function DashboardTab({
  total,
  deployed,
  building,
  failed,
  series,
  deployments,
}: {
  total: number;
  deployed: number;
  building: number;
  failed: number;
  series: number[];
  deployments: Deployment[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Deployments"
          value={total}
          icon={<Activity className="w-5 h-5" />}
          delta={total ? "Tracking builds and releases" : "Ready when you are"}
          deltaTone="neutral"
          series={series}
        />
        <MetricCard
          title="Deployed"
          value={deployed}
          icon={<Sparkles className="w-5 h-5" />}
          delta={deployed ? "Live on the edge" : "No live deployments"}
          deltaTone={deployed ? "positive" : "neutral"}
          series={series.map((v) => v + 1)}
        />
        <MetricCard
          title="Building"
          value={building}
          icon={<Loader2 className="w-5 h-5" />}
          delta={building ? "In progress" : "Idle"}
          deltaTone="neutral"
          series={series.map((v) => Math.max(1, v - 1))}
        />
        <MetricCard
          title="Failed"
          value={failed}
          icon={<Settings className="w-5 h-5" />}
          delta={failed ? "Needs attention" : "All green"}
          deltaTone={failed ? "negative" : "positive"}
          series={series.map((v) => (v === 1 ? 3 : 1))}
        />
      </div>

      <RecentDeploymentsCard deployments={deployments} />
    </div>
  );
}
