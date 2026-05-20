import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-800/60 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div className="text-white font-semibold">Voltex</div>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <Link href="/status" className="text-zinc-400 hover:text-white transition-colors">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Status
              </span>
            </Link>
            <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">
              Docs
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>

          <div className="text-xs text-zinc-500">© 2026 Voltex Inc.</div>
        </div>
      </div>
    </footer>
  );
}
