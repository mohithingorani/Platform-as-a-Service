export default function StatusPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16">
        <div className="text-white text-2xl font-semibold">Status</div>
        <div className="text-zinc-400 mt-3">
          All systems operational.
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex items-center justify-between">
            <div className="text-zinc-200">API</div>
            <div className="text-emerald-400 text-sm">Operational</div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-zinc-200">Deployments</div>
            <div className="text-emerald-400 text-sm">Operational</div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-zinc-200">Logs</div>
            <div className="text-emerald-400 text-sm">Operational</div>
          </div>
        </div>
      </div>
    </div>
  );
}
