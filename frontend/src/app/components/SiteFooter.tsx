import { Zap, Globe } from "lucide-react";
import { GitHubIcon, XIcon } from "./landing/BrandIcons";

const REPO_URL = "https://github.com/mohithingorani/Platform-as-a-Service";

const socials = [
  { icon: GitHubIcon, href: REPO_URL, label: "GitHub" },
  { icon: XIcon, href: "https://x.com/", label: "X" },
  { icon: Globe, href: "https://mohit.systems", label: "mohit.systems" },
];

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Architecture", href: "/#architecture" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/signup" },
      { label: "Dashboard", href: "/home" },
      { label: "Docs", href: "/docs" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Source code", href: REPO_URL },
      { label: "FAQ", href: "/#faq" },
      { label: "mohit.systems", href: "https://mohit.systems" },
    ],
  },
];

/**
 * The single, canonical footer rendered for every page from the root layout.
 * Keep all site-wide footer changes here so pages never drift apart.
 */
export default function SiteFooter() {
  return (
    <footer className="px-6 pt-16 pb-10 border-t border-border-subtle bg-bg-primary">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <a href="/" className="flex items-center gap-2.5 mb-4 w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg shadow-accent/20">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="text-text-primary font-semibold text-lg tracking-tight">Voltex</span>
            </a>
            <p className="text-text-secondary text-sm max-w-xs leading-relaxed mb-5">
              A from-scratch PaaS: GitHub URL in, live site out — with sandboxed Docker builds and
              real-time logs.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="text-text-primary font-medium text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-text-secondary text-sm hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-text-muted text-sm">
            © {new Date().getFullYear()} Voltex · Built by Mohit Hingorani
          </span>
          <a
            href="/status"
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
            All systems operational
          </a>
        </div>
      </div>
    </footer>
  );
}
