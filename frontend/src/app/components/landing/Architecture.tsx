"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { stages } from "./data";
import Reveal from "./Reveal";

export default function Architecture() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });

  // The connecting line fills as you scroll through the section.
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pulseLeft = useTransform(fill, (v) => `${v * 100}%`);

  return (
    <section id="architecture" className="py-24 px-6 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4">
            How it works under the hood
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            One <code className="font-mono text-text-primary">POST /deploy</code> fans out across six
            services, coordinated through Redis. Here&apos;s the path your code takes.
          </p>
        </Reveal>

        <div ref={ref} className="relative">
          {/* Desktop: horizontal flow */}
          <div className="hidden md:block">
            {/* Track */}
            <div className="absolute left-0 right-0 top-8 h-px bg-border-subtle" />
            <motion.div
              style={{ scaleX: reduce ? 1 : fill }}
              className="absolute left-0 right-0 top-8 h-px origin-left bg-gradient-to-r from-accent via-accent-hover to-violet-500"
            />
            {/* Traveling pulse */}
            {!reduce && (
              <motion.div
                style={{ left: pulseLeft }}
                className="absolute top-8 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-hover shadow-[0_0_16px_4px_rgba(96,165,250,0.6)]"
              />
            )}

            <div className="relative grid grid-cols-6 gap-3">
              {stages.map((stage, i) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-accent bg-bg-primary mb-6" />
                  <div className="w-full p-3 rounded-lg bg-bg-secondary border border-border-subtle">
                    <div className="text-sm font-semibold text-text-primary tracking-tight">
                      {stage.label}
                    </div>
                    <div className="mt-1 text-xs text-text-muted font-mono">{stage.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical flow */}
          <div className="md:hidden relative pl-8">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border-subtle" />
            <motion.div
              style={{ scaleY: reduce ? 1 : fill }}
              className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-accent to-violet-500"
            />
            <div className="space-y-5">
              {stages.map((stage, i) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="relative"
                >
                  <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full border-2 border-accent bg-bg-primary" />
                  <div className="p-3 rounded-lg bg-bg-secondary border border-border-subtle">
                    <div className="text-sm font-semibold text-text-primary">{stage.label}</div>
                    <div className="mt-1 text-xs text-text-muted font-mono">{stage.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Reveal delay={0.1} className="mt-12 text-center">
          <p className="text-sm text-text-muted">
            Build logs are published to Redis pub/sub and streamed to the browser over WebSockets the
            whole time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
