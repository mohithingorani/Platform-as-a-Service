"use client";

import { useState } from "react";

interface Deployment {
  id: string;
  repoUrl: string;
  status: "deployed" | "failed" | "building" | "pending";
  createdAt: string;
  url?: string;
}

interface DeploymentTableProps {
  deployments: Deployment[];
  onSelect?: (id: string) => void;
  selectedId?: string;
}

export default function DeploymentTable({
  deployments,
  onSelect,
  selectedId,
}: DeploymentTableProps) {
  const [sortBy, setSortBy] = useState<"date" | "status">("date");

  const sortedDeployments = [...deployments].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const statusColors = {
    deployed: "badge-success",
    failed: "badge-error",
    building: "badge-warning",
    pending: "badge-pending",
  };

  const statusLabels = {
    deployed: "Deployed",
    failed: "Failed",
    building: "Building",
    pending: "Pending",
  };

  return (
    <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-text-primary font-semibold">Recent Deployments</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "status")}
          className="bg-bg-primary border border-border rounded-lg px-3 py-1.5 text-sm text-text-secondary focus:outline-none focus:border-border-hover"
        >
          <option value="date">Sort by Date</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-text-muted text-sm font-medium">
                Deployment ID
              </th>
              <th className="text-left px-4 py-3 text-text-muted text-sm font-medium">
                Repository
              </th>
              <th className="text-left px-4 py-3 text-text-muted text-sm font-medium">
                Status
              </th>
              <th className="text-left px-4 py-3 text-text-muted text-sm font-medium">
                Date
              </th>
              <th className="text-left px-4 py-3 text-text-muted text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDeployments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  No deployments yet. Deploy your first repository!
                </td>
              </tr>
            ) : (
              sortedDeployments.map((deployment) => (
                <tr
                  key={deployment.id}
                  className={`border-b border-border hover:bg-bg-surface-hover transition-colors cursor-pointer ${
                    selectedId === deployment.id ? "bg-accent/5" : ""
                  }`}
                  onClick={() => onSelect?.(deployment.id)}
                >
                  <td className="px-4 py-3">
                    <span className="text-text-primary font-mono text-sm">
                      {deployment.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-text-secondary text-sm truncate max-w-[200px] block">
                      {deployment.repoUrl.replace("https://github.com/", "")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusColors[deployment.status]}`}>
                      {statusLabels[deployment.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted text-sm">
                    {new Date(deployment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {deployment.url && (
                        <a
                          href={deployment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent-hover text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit
                        </a>
                      )}
                      <button
                        className="text-text-muted hover:text-text-secondary text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect?.(deployment.id);
                        }}
                      >
                        View Logs
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}