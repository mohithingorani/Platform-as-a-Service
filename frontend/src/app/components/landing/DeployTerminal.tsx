"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { deployScript, type LogLine } from "./data";

const lineColor: Record<LogLine["kind"], string> = {
  cmd: "text-text-primary",
  step: "text-blue-400",
  ok: "text-emerald-400",
  info: "text-text-secondary",
  url: "text-accent-hover underline decoration-accent/40 underline-offset-4",
};

/**
 * The hero centerpiece. Replays a real deploy through Voltex's actual pipeline
 * (the same stages the backend runs). It's a faithful preview, not invented
 * scale — the log lines mirror upload-service -> redis -> deploy-service docker
 * build -> S3 -> request-handler.
 */
export default function DeployTerminal() {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const run = useCallback(() => {
    clearTimers();
    setLines([]);
    setDone(false);
    setRunning(true);

    if (reduce) {
      // No staged animation — show the whole transcript at once.
      setLines(deployScript);
      setRunning(false);
      setDone(true);
      return;
    }

    let delay = 350;
    deployScript.forEach((line, i) => {
      delay += line.kind === "cmd" ? 0 : 280 + Math.random() * 260;
      const t = setTimeout(() => {
        setLines((prev) => [...prev, line]);
        if (i === deployScript.length - 1) {
          setRunning(false);
          setDone(true);
        }
      }, delay);
      timers.current.push(t);
    });
  }, [reduce]);

  // Auto-play once on mount.
  useEffect(() => {
    run();
    return clearTimers;
  }, [run]);

  // Keep the latest line in view.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [lines.length]);

  return (
    <div className="relative">
      {/* Slow aurora behind the window */}
      {!reduce && (
        <div className="pointer-events-none absolute -inset-10 -z-10 opacity-60 animate-aurora bg-[conic-gradient(from_0deg_at_50%_50%,rgba(59,130,246,0.18),transparent_30%,rgba(139,92,246,0.16)_60%,transparent_85%)] blur-3xl" />
      )}

      <div className="relative rounded-xl border border-border-subtle bg-bg-secondary shadow-2xl overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-bg-tertiary border-b border-border-subtle">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-text-muted font-mono">voltex — deploy</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                running ? "bg-amber-400 animate-pulse" : done ? "bg-emerald-500" : "bg-text-muted"
              }`}
            />
            {running ? "building" : done ? "deployed" : "idle"}
          </span>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="p-4 font-mono text-sm h-[320px] lg:h-[400px] overflow-y-auto scrollbar-thin">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={`leading-relaxed whitespace-pre-wrap break-words ${lineColor[line.kind]}`}
            >
              {line.text}
            </motion.div>
          ))}
          {running && (
            <span className="inline-block w-2 h-4 bg-text-muted align-middle animate-cursor-blink" />
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border-subtle bg-bg-secondary">
          <span className="text-xs text-text-muted">
            Live preview of the real build pipeline
          </span>
          <button
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary disabled:opacity-50 transition-colors"
          >
            {done ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {running ? "Running…" : done ? "Replay" : "Run"}
          </button>
        </div>
      </div>
    </div>
  );
}
