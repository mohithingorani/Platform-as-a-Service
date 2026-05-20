"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, ExternalLink, GitBranch, Plus, Rocket, Terminal } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Deployment } from "../types";
import { formatDuration, repoSlug, timeAgo } from "../utils";

export default function RecentDeploymentsCard({ deployments }: { deployments: Deployment[] }) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/40 backdrop-blur-xl overflow-hidden">
      <div className="px-5 sm:px-6 py-5 border-b border-zinc-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="text-white font-semibold tracking-tight">Recent Deployments</div>
          <div className="text-xs text-zinc-500 mt-1">Production-grade builds and rollouts.</div>
        </div>
        <button
          onClick={() => router.push("/home?tab=deploy")}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-950/40 border border-zinc-800 text-zinc-200 hover:bg-zinc-950/70 transition-colors w-full sm:w-auto"
        >
          New deployment
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {deployments.length === 0 ? (
        <div className="p-10">
          <div className="flex items-start gap-5">
            <div className="h-12 w-12 rounded-2xl border border-blue-500/20 bg-blue-500/10 flex items-center justify-center text-blue-300">
              <Rocket className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold">Deploy your first project</div>
              <div className="text-sm text-zinc-400 mt-1">
                Paste a GitHub repo URL and Voltex will build and ship it to a unique subdomain.
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => router.push("/home?tab=deploy")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New deployment
                </button>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/70 text-zinc-200 transition-colors"
                >
                  Read docs
                </Link>
              </div>
              <div className="mt-6 rounded-xl border border-zinc-800/60 bg-zinc-950/30 p-4 font-mono text-xs text-zinc-300">
                <div className="text-zinc-500">Example</div>
                <div className="mt-2">https://github.com/username/repo</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/60">
          {deployments.slice(0, 6).map((d) => (
            <motion.div
              key={d.id}
              whileHover={{ backgroundColor: "rgba(9,9,11,0.35)" }}
              className="px-5 sm:px-6 py-4 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="text-white font-medium truncate">{repoSlug(d.repoUrl) || d.id}</div>
                    <StatusBadge status={d.status} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5" />
                      {d.branch || "main"}
                    </span>
                    {d.commitSha ? (
                      <>
                        <span>•</span>
                        <span className="font-mono text-zinc-400">{d.commitSha.slice(0, 7)}</span>
                      </>
                    ) : null}
                    <span>•</span>
                    <span>{timeAgo(d.createdAt)}</span>
                    {formatDuration(d.durationMs) ? (
                      <>
                        <span>•</span>
                        <span className="truncate">{formatDuration(d.durationMs)}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => router.push(`/home?tab=deployments&id=${encodeURIComponent(d.id)}`)}
                    className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/70 text-zinc-200 text-sm transition-colors"
                  >
                    Logs
                    <Terminal className="w-4 h-4 text-zinc-500" />
                  </button>
                  {d.url ? (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
                    >
                      Open
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
