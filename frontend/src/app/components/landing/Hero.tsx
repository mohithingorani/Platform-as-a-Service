"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GitHubIcon } from "./BrandIcons";
import DeployTerminal from "./DeployTerminal";

const truths = [
  { value: "6", label: "Microservices" },
  { value: "Docker", label: "Isolated builds" },
  { value: "Live", label: "Log streaming" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const reduce = useReducedMotion();
  const motionProps = reduce
    ? {}
    : { variants: container, initial: "hidden" as const, animate: "show" as const };
  const childProps = reduce ? {} : { variants: item };

  return (
    <section className="relative px-6 overflow-hidden flex items-center pt-28 pb-16 md:pt-32 md:pb-24 lg:pt-36">
      {/* Background: radial glow + masked grid */}
      <div className="absolute inset-0 -z-10 bg-glow" />
      <div className="absolute inset-0 -z-10 bg-grid bg-grid-size [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent_75%)]" />
      <div className="absolute top-40 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Copy */}
          <motion.div {...motionProps} className="space-y-8">
            <motion.div
              {...childProps}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full text-accent text-xs font-medium border border-accent/20"
            >
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-soft" />
              A PaaS, built from scratch
            </motion.div>

            <motion.h1
              {...childProps}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary tracking-tighter leading-[1.05]"
            >
              From GitHub URL to
              <br />
              <span className="text-gradient animate-text-shimmer">live in seconds</span>
            </motion.h1>

            <motion.p {...childProps} className="text-lg text-text-secondary max-w-lg leading-relaxed">
              Voltex clones your repo, builds it in an isolated Docker container, and serves
              it on its own subdomain — streaming every build log to your browser in real time.
              No Dockerfile. No config.
            </motion.p>

            <motion.div {...childProps} className="flex flex-col sm:flex-row gap-4">
              <a href="/signup" className="btn-primary text-base px-6 py-3 group">
                Deploy a repo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://github.com/mohithingorani/Platform-as-a-Service"
                className="btn-secondary text-base px-6 py-3 inline-flex items-center gap-2"
              >
                <GitHubIcon className="w-4 h-4" />
                View source
              </a>
            </motion.div>

            {/* Honest stats */}
            <motion.div
              {...childProps}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-border-subtle"
            >
              {truths.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-text-primary tracking-tight">{s.value}</div>
                  <div className="text-xs text-text-muted">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <DeployTerminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
