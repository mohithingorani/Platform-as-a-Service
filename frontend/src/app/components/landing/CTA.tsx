"use client";

import { ArrowRight } from "lucide-react";
import { GitHubIcon } from "./BrandIcons";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section className="py-24 px-6 section-subtle">
      <div className="max-w-4xl mx-auto">
        <Reveal className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-secondary px-8 py-16 text-center">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(59,130,246,0.12),transparent)]" />
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4">
            Deploy something
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            Sign in with GitHub, paste a repo URL, and watch it build live. Free — it&apos;s a
            personal project, not a sales funnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="btn-primary text-base px-8 py-4 group">
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="https://github.com/mohithingorani/Platform-as-a-Service"
              className="btn-secondary text-base px-8 py-4 inline-flex items-center gap-2"
            >
              <GitHubIcon className="w-4 h-4" />
              Read the architecture
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
