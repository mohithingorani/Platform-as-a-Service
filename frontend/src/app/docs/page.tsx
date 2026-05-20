import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16">
        <div className="text-white text-2xl font-semibold">Docs</div>
        <div className="text-zinc-400 mt-3">
          Quick links to get you moving.
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="text-white font-medium">Deploy a repo</div>
            <div className="text-sm text-zinc-400 mt-2">
              Paste a GitHub repository URL in the Deploy tab.
            </div>
            <Link
              href="/home?tab=deploy"
              className="inline-flex mt-4 text-sm text-blue-400 hover:text-blue-300"
            >
              Go to Deploy
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="text-white font-medium">View logs</div>
            <div className="text-sm text-zinc-400 mt-2">
              Open a deployment and follow build/runtime logs.
            </div>
            <Link
              href="/home?tab=deployments"
              className="inline-flex mt-4 text-sm text-blue-400 hover:text-blue-300"
            >
              Go to Deployments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
