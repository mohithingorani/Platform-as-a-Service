"use client";

import { motion } from "framer-motion";
import type { MouseEvent } from "react";
import { features } from "./data";
import Reveal from "./Reveal";

function SpotlightCard({ feature, index }: { feature: (typeof features)[number]; index: number }) {
  const Icon = feature.icon;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ y: -3 }}
      onMouseMove={onMove}
      className="group relative spotlight overflow-hidden p-6 bg-bg-secondary rounded-xl border border-border-subtle hover:border-border transition-colors duration-300"
    >
      <div className="relative">
        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-accent/20 to-violet-500/10 border border-accent/20 flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-accent-hover" />
        </div>
        <h3 className="text-text-primary font-semibold text-lg mb-2 tracking-tight">{feature.title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 section-subtle scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4">
            What it actually does
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            No edge-network marketing. Just the real machinery: a git-driven build pipeline that
            runs untrusted code safely and streams every log line back to you.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <SpotlightCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
