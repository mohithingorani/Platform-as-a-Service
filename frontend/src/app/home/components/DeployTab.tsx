"use client";

import { motion } from "framer-motion";
import { GitBranch, Loader2, Rocket } from "lucide-react";

export default function DeployTab({
  url,
  onUrl,
  error,
  loading,
  deployedUrl,
  onDeploy,
}: {
  url: string;
  onUrl: (next: string) => void;
  error: string | null;
  loading: boolean;
  deployedUrl: string;
  onDeploy: () => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/70 rounded-2xl p-7"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Rocket className="w-6 h-6 text-blue-500" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Deploy to Edge</h2>
            <p className="text-sm text-zinc-400">Connect your GitHub repository</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-zinc-400 text-sm font-medium mb-3">Repository</label>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <GitBranch className="w-5 h-5 text-zinc-500" />
              </div>

              <input
                type="text"
                value={url}
                onChange={(e) => onUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-12 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {deployedUrl && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-emerald-400 font-medium mb-2">Deployment successful</div>
              <a
                href={deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm"
              >
                {deployedUrl}
              </a>
            </div>
          )}

          <button
            onClick={onDeploy}
            disabled={loading || !url}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Deploy Repository
              </>
            )}
          </button>
        </div>
      </motion.div>

      <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/30 backdrop-blur-xl p-7">
        <div className="text-white font-semibold">What happens next</div>
        <div className="text-sm text-zinc-400 mt-2">
          Voltex clones your repository, builds in an isolated container, then publishes assets to a unique edge subdomain.
        </div>

        <div className="mt-6 space-y-3">
          {[
            "Clone repository",
            "Upload source to object storage",
            "Build in Docker",
            "Serve on <id>.deploy.<domain>",
          ].map((s, i) => (
            <div key={s} className="flex items-start gap-3">
              <div className="mt-0.5 h-6 w-6 rounded-lg border border-zinc-800 bg-zinc-950/40 flex items-center justify-center text-xs text-zinc-300">
                {i + 1}
              </div>
              <div className="text-sm text-zinc-300">{s}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-zinc-800/60 bg-zinc-950/30 p-4 font-mono text-xs text-zinc-300">
          <div className="text-zinc-500">Output</div>
          <div className="mt-2">http://&lt;id&gt;.deploy.mohit-hingorani.tech</div>
        </div>
      </div>
    </div>
  );
}
