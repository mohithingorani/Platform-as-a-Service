"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, GitBranch, Terminal } from "lucide-react";
import LogsCard from "../../components/LogsCard";
import StatusBadge from "./StatusBadge";
import type { Deployment } from "../types";
import { deploymentHostUrl, formatDuration, timeAgo } from "../utils";

export default function DeploymentsTab({
  deployments,
  selectedDeploymentId,
  onSelect,
}: {
  deployments: Deployment[];
  selectedDeploymentId: string | undefined;
  onSelect: (id: string) => void;
}) {
  const router = useRouter();
  const selected = deployments.find((d) => d.id === selectedDeploymentId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800/70 flex items-center justify-between">
          <div className="text-white font-semibold">Deployments</div>
          <button
            onClick={() => router.push("/home?tab=deploy")}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            New
          </button>
        </div>

        <div className="max-h-[560px] overflow-y-auto scrollbar-thin">
          {deployments.length === 0 ? (
            <div className="p-5 text-sm text-zinc-500">No deployments yet.</div>
          ) : (
            deployments.map((deployment) => {
              const isSelected = deployment.id === selectedDeploymentId;
              return (
                <button
                  key={deployment.id}
                  onClick={() => onSelect(deployment.id)}
                  className={`w-full text-left px-5 py-4 border-b border-zinc-800/50 hover:bg-zinc-950/40 transition-colors ${
                    isSelected ? "bg-zinc-950/50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-white font-medium truncate">
                        {deployment.repoUrl || "(no repo url)"}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {new Date(deployment.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <StatusBadge status={deployment.status} />
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-6">
        {deployments.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <div className="text-white font-semibold text-lg">0 total deployments</div>
            <div className="text-sm text-zinc-400 mt-2">No deployments yet</div>
            <div className="text-sm text-zinc-500 mt-2">
              Deploy your first GitHub repository to get started with Voltex Edge.
            </div>

            <button
              onClick={() => router.push("/home?tab=deploy")}
              className="mt-6 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium"
            >
              Deploy your first project
            </button>
          </div>
        ) : !selected ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-zinc-300">
            Select a deployment to view details.
          </div>
        ) : (
          <>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-white font-semibold truncate">{selected.repoUrl || "Deployment"}</div>
                  <div className="text-xs text-zinc-500 mt-1 break-all">{selected.id}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span>{timeAgo(selected.createdAt)}</span>
                    {selected.branch ? (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1.5">
                          <GitBranch className="w-3.5 h-3.5" />
                          {selected.branch}
                        </span>
                      </>
                    ) : null}
                    {selected.commitSha ? (
                      <>
                        <span>•</span>
                        <span className="font-mono text-zinc-400">{selected.commitSha.slice(0, 7)}</span>
                      </>
                    ) : null}
                    {formatDuration(selected.durationMs) ? (
                      <>
                        <span>•</span>
                        <span>Build {formatDuration(selected.durationMs)}</span>
                      </>
                    ) : null}
                    {selected.failureReason ? (
                      <>
                        <span>•</span>
                        <span className="text-red-300/80 truncate">{selected.failureReason}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={selected.status} />

                  {selected.url && (
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {!selected.url && selected.status === "deployed" ? (
                <div className="mt-4 text-sm text-zinc-400">
                  Live URL: <span className="text-zinc-200">{deploymentHostUrl(selected.id)}</span>
                </div>
              ) : null}
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white font-semibold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-400" />
                  Logs
                </div>
              </div>

              <LogsCard id={selected.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
