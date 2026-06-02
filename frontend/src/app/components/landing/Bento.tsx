"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container, Globe, ListOrdered, ScrollText, Boxes } from "lucide-react";
import Reveal from "./Reveal";

const miniLogs = [
  { t: "npm install · 278 packages", c: "text-text-secondary" },
  { t: "vite v5 building for production…", c: "text-blue-400" },
  { t: "✓ 142 modules transformed", c: "text-emerald-400" },
  { t: "dist/index.html  0.46 kB", c: "text-text-secondary" },
  { t: "dist/assets/index-a9f2.js  184 kB", c: "text-text-secondary" },
  { t: "✓ built in 1.21s", c: "text-emerald-400" },
];

function LiveLogsCard() {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? miniLogs.length : 0);

  useEffect(() => {
    if (reduce) return;
    setN(0);
    const id = setInterval(() => {
      setN((prev) => {
        if (prev >= miniLogs.length) {
          // brief pause then loop
          return 0;
        }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="group relative md:col-span-2 md:row-span-2 spotlight overflow-hidden rounded-2xl border border-border-subtle bg-bg-secondary p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent/20 to-violet-500/10 border border-accent/20 flex items-center justify-center">
          <ScrollText className="w-5 h-5 text-accent-hover" />
        </div>
        <div>
          <h3 className="text-text-primary font-semibold tracking-tight">Live build logs</h3>
          <p className="text-text-muted text-xs">Redis pub/sub → WebSocket → your browser</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          streaming
        </span>
      </div>

      <div className="flex-1 rounded-xl border border-border-subtle bg-bg-primary/60 p-4 font-mono text-xs min-h-[180px]">
        {miniLogs.slice(0, n).map((l, i) => (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className={`leading-6 ${l.c}`}
          >
            {l.t}
          </motion.div>
        ))}
        {!reduce && n < miniLogs.length && (
          <span className="inline-block w-1.5 h-3.5 bg-text-muted align-middle animate-cursor-blink" />
        )}
      </div>
    </div>
  );
}

function MiniCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Container;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative spotlight overflow-hidden rounded-2xl border border-border-subtle bg-bg-secondary p-6">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent/20 to-violet-500/10 border border-accent/20 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-accent-hover" />
      </div>
      <h3 className="text-text-primary font-semibold tracking-tight mb-1">{title}</h3>
      <div className="text-text-secondary text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export default function Bento() {
  return (
    <section className="py-24 px-6 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4">
            See it in action
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            From clone to live URL, the platform handles the messy parts — and shows its work the
            whole way.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3 auto-rows-[minmax(0,1fr)]">
          <LiveLogsCard />

          <MiniCard icon={Container} title="Sandboxed builds">
            Each build runs in a throwaway{" "}
            <code className="font-mono text-text-primary">node:22</code> container, then it&apos;s gone.
          </MiniCard>

          <MiniCard icon={Boxes} title="Framework auto-detect">
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["React", "Vue", "Vite", "Svelte"].map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-border-subtle bg-bg-tertiary px-2 py-0.5 text-xs text-text-secondary"
                >
                  {f}
                </span>
              ))}
            </div>
          </MiniCard>

          <MiniCard icon={ListOrdered} title="Redis job queue">
            Deploys are queued and picked up by a background worker — status tracked end to end.
          </MiniCard>

          <MiniCard icon={Globe} title="Subdomain per deploy">
            <div className="mt-2 rounded-md border border-border-subtle bg-bg-primary/60 px-3 py-2 font-mono text-xs text-accent-hover truncate">
              a1b2c.deploy.mohit.systems
            </div>
          </MiniCard>
        </div>
      </div>
    </section>
  );
}
