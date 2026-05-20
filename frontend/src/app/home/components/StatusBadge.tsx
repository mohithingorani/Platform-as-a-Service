"use client";

import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";

export default function StatusBadge({
  status,
}: {
  status: "deployed" | "failed" | "building" | "pending" | string;
}) {
  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border";

  if (status === "deployed") {
    return (
      <span className={`${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-300`}>
        <CheckCircle2 className="h-3.5 w-3.5" />
        Deployed
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className={`${base} border-red-500/20 bg-red-500/10 text-red-300`}>
        <XCircle className="h-3.5 w-3.5" />
        Failed
      </span>
    );
  }

  if (status === "building") {
    return (
      <span className={`${base} border-blue-500/20 bg-blue-500/10 text-blue-300`}>
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Building
      </span>
    );
  }

  return (
    <span className={`${base} border-zinc-700/60 bg-zinc-900/30 text-zinc-300`}>
      <Clock className="h-3.5 w-3.5" />
      Pending
    </span>
  );
}
