"use client";

import { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, ChevronRight } from "lucide-react";
import HomeTopNav from "./components/HomeTopNav";
import HomeFooter from "./components/HomeFooter";
import HomeBootLoader from "./components/HomeBootLoader";
import DashboardTab from "./components/DashboardTab";
import DeployTab from "./components/DeployTab";
import DeploymentsTab from "./components/DeploymentsTab";
import SettingsTab from "./components/SettingsTab";
import type { Deployment, UserSessionData } from "./types";
import { deploymentHostUrl } from "./utils";

const githubUrlSchema = z
  .string()
  .url()
  .regex(
    /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/,
    "Must be a valid GitHub repository URL"
  );

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "dashboard";
  const selectedFromQuery = searchParams.get("id");

  const [authChecked, setAuthChecked] = useState(false);
  const [minDelayDone, setMinDelayDone] = useState(false);
  const [shouldRunBoot, setShouldRunBoot] = useState(false);

  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deployedUrl, setDeployedUrl] = useState<string>("");
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | undefined>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("deploymentId") || undefined;
    }
    return undefined;
  });
  

  const [userData, setUserData] = useState<UserSessionData | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  const setTab = (tab: string) => router.push(`/home?tab=${tab}`);

  useEffect(() => {
    async function getData() {
      try {
        const userdata = await axios.get("/api/me");
        setUserData(userdata.data);
      } catch (e) {
        router.push("/login");
      } finally {
        setAuthChecked(true);
      }
    }
    getData();
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = "voltex:homeBoot:v1";
    if (sessionStorage.getItem(key) === "1") return;

    setShouldRunBoot(true);
    // Only once per tab session.
    sessionStorage.setItem(key, "1");

    const t = window.setTimeout(() => setMinDelayDone(true), 2000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (selectedDeploymentId) {
      localStorage.setItem("deploymentId", selectedDeploymentId);
    }
  }, [selectedDeploymentId]);

  useEffect(() => {
    if (!deployments.length) return;
    if (selectedFromQuery && deployments.some((d) => d.id === selectedFromQuery)) return;
    if (selectedDeploymentId && deployments.some((d) => d.id === selectedDeploymentId)) return;
    setSelectedDeploymentId(deployments[0].id);
  }, [deployments, selectedDeploymentId, selectedFromQuery]);

  useEffect(() => {
    if (!selectedFromQuery) return;
    if (selectedDeploymentId === selectedFromQuery) return;

    if (deployments.some((d) => d.id === selectedFromQuery)) {
      setSelectedDeploymentId(selectedFromQuery);
      localStorage.setItem("deploymentId", selectedFromQuery);
    }
  }, [deployments, selectedDeploymentId, selectedFromQuery]);

  const fetchDeployments = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DEPLOYMENTS_URL}`
      );
      if (res.data && Array.isArray(res.data)) {
        setDeployments(
          res.data.map((d: any) => ({
            id: d.id,
            repoUrl: d.repoUrl || "",
            status: d.status || "pending",
            createdAt: d.createdAt || new Date().toISOString(),
            url: d.url,
            branch: d.branch,
            commitSha: d.commitSha,
            startedAt: d.startedAt,
            completedAt: d.completedAt,
            durationMs: typeof d.durationMs === "number" ? d.durationMs : undefined,
            failureReason: d.failureReason,
            rawStatus: d.rawStatus,
          }))
        );
      }
    } catch (e) {
      console.error("Failed to fetch deployments");
    }
  }, []);

  useEffect(() => {
    fetchDeployments();
    const interval = setInterval(fetchDeployments, 5000);
    return () => clearInterval(interval);
  }, [fetchDeployments]);

  async function deploy() {
    const result = githubUrlSchema.safeParse(url);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);
    setLoading(true);
    setDeployedUrl("");

    try {
      const deployRepo = await axios.post(
        `${process.env.NEXT_PUBLIC_UPLOAD_URL}`,
        { repoUrl: url }
      );

      const deploymentId = deployRepo.data.id;
      setSelectedDeploymentId(deploymentId);
      localStorage.setItem("deploymentId", deploymentId);

      setDeployments((prev) => [
        {
          id: deploymentId,
          repoUrl: url,
          status: "building",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      router.push("/home?tab=dashboard");

      const intervalId = setInterval(async () => {
        try {
          const statusRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STATUS_BACKEND}?id=${deploymentId}`
          );
          if (statusRes.data.status === "deployed") {
            clearInterval(intervalId);
            setLoading(false);
            const liveUrl = deploymentHostUrl(deploymentId);
            setDeployedUrl(liveUrl);
            setDeployments((prev) =>
              prev.map((d) =>
                d.id === deploymentId
                  ? { ...d, status: "deployed" as const, url: liveUrl }
                  : d
              )
            );
          } else if (statusRes.data.status === "failed") {
            clearInterval(intervalId);
            setLoading(false);
            setDeployments((prev) =>
              prev.map((d) =>
                d.id === deploymentId ? { ...d, status: "failed" as const } : d
              )
            );
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 2000);
    } catch (err) {
      console.error("Deployment failed", err);
      setError("Failed to deploy repository.");
      setLoading(false);
    }
  }
  

  const stats = {
    total: deployments.length,
    deployed: deployments.filter((d) => d.status === "deployed").length,
    building: deployments.filter((d) => d.status === "building").length,
    failed: deployments.filter((d) => d.status === "failed").length,
  };

  const deploymentsSorted = [...deployments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const series = useMemo(() => {
    // Lightweight pseudo-trend: last N deployments by status weights.
    // This is intentionally derived from existing data (no backend changes).
    const weights = deploymentsSorted.slice(0, 16).reverse().map((d) => {
      if (d.status === "deployed") return 4;
      if (d.status === "building") return 3;
      if (d.status === "pending") return 2;
      return 1;
    });
    return weights.length ? weights : [1, 2, 2, 3, 4, 3, 3, 4];
  }, [deploymentsSorted]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            total={stats.total}
            deployed={stats.deployed}
            building={stats.building}
            failed={stats.failed}
            series={series}
            deployments={deploymentsSorted}
          />
        );

      case "deploy":
        return (
          <DeployTab
            url={url}
            onUrl={setUrl}
            error={error}
            loading={loading}
            deployedUrl={deployedUrl}
            onDeploy={deploy}
          />
        );

      case "deployments":
        return (
          <DeploymentsTab
            deployments={deploymentsSorted}
            selectedDeploymentId={selectedDeploymentId}
            onSelect={setSelectedDeploymentId}
          />
        );

      case "settings":
        return <SettingsTab user={userData} />;

      default:
        return <div className="text-white">Invalid tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <AnimatePresence>
        {shouldRunBoot && !(authChecked && minDelayDone) ? (
          <motion.div
            key="homeBoot"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <HomeBootLoader durationMs={2000} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.06] [mask-image:radial-gradient(circle_at_top,black,transparent_65%)]" />
      </div>

      <HomeTopNav
        activeTab={activeTab}
        onTab={setTab}
        onNew={() => setTab("deploy")}
        user={userData}
      />

      <main className="flex-1 pb-12 px-4 md:px-6 pt-8 md:pt-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="text-xs text-zinc-500 tracking-wide">Voltex Edge</div>
                <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-white">
                  {activeTab === "dashboard"
                    ? "Dashboard"
                    : activeTab[0].toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="text-zinc-400 mt-1">
                  {userData?.name?.split(" ")[0] || "Developer"}, ship faster with deterministic builds and streaming logs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTab("deploy")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New deploy
                </button>
                <button
                  onClick={() => setTab("deployments")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/70 text-zinc-200 transition-colors"
                >
                  View deployments
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>
          </div>

          {renderContent()}
        </div>
      </main>

      <HomeFooter />
    </div>
    
  );
}


export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="text-zinc-500">Loading...</div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
