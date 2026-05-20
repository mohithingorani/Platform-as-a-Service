"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { Zap, Globe, Activity, Link, RotateCcw, Users, Github, Twitter, ExternalLink, CheckCircle2, ArrowRight } from "lucide-react";

const features = [
  {
    title: "One-Click Deploy",
    description: "Connect your GitHub repository and deploy instantly. Zero configuration required.",
    icon: Zap,
    accent: "from-amber-500 to-orange-500",
  },
  {
    title: "Global Edge Network",
    description: "Automatic deployment to 35+ edge regions worldwide for optimal latency.",
    icon: Globe,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "Real-Time Monitoring",
    description: "Stream deployment logs live. Track build progress, errors, and performance.",
    icon: Activity,
    accent: "from-blue-500 to-cyan-500",
  },
  {
    title: "Custom Domains",
    description: "Connect your own domain with free SSL. Enterprise-grade DNS management.",
    icon: Link,
    accent: "from-violet-500 to-purple-500",
  },
  {
    title: "Instant Rollbacks",
    description: "One-click rollback to any previous deployment. Never lose a working version.",
    icon: RotateCcw,
    accent: "from-rose-500 to-pink-500",
  },
  {
    title: "Team Collaboration",
    description: "Invite team members, set permissions, and track deployments together.",
    icon: Users,
    accent: "from-indigo-500 to-blue-500",
  },
];

const steps = [
  {
    title: "Connect Repository",
    description: "Paste your GitHub repo URL. We automatically detect your framework.",
    code: "voltex connect github.com/user/project",
    output: "→ Repository connected successfully",
  },
  {
    title: "Automatic Build",
    description: "We detect your stack, install dependencies, and build your app.",
    output: "✓ Detected: React + Vite\n→ Installing dependencies...\n→ Building application...",
  },
  {
    title: "Deploy to Edge",
    description: "Your app is deployed to our global edge network in seconds.",
    output: "✓ Build complete (2.3s)\n✓ Uploading to edge...\n✓ Deployed to 35 regions",
  },
];

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
];

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap", "Deploy Status"],
  Company: ["About", "Blog", "Careers", "Press Kit", "Contact"],
  Resources: ["Documentation", "API Reference", "Community", "Discord", "GitHub"],
  Legal: ["Privacy", "Terms", "Security", "Cookies", "GDPR"],
};

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  useEffect(() => {
    const lines = [
      "$ voltex deploy",
      "→ Cloning repository...",
      "✓ Detected: React + Vite",
      "→ Installing dependencies (278 packages)...",
      "→ Building application...",
      "✓ Built in 1.2s",
      "→ Uploading to edge network...",
      "✓ Deployed to 35 regions",
      "→ https://myapp.voltex.dev",
    ];

    let delay = 0;
    lines.forEach((line, i) => {
      delay += i === 0 ? 500 : 300 + Math.random() * 200;
      setTimeout(() => {
        setTerminalLines((prev) => [...prev, line]);
      }, delay);
    });

    const cursorInterval = setInterval(() => setShowCursor((c) => !c), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle"
            : ""
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-text-primary font-semibold text-lg tracking-tight">
              Voltex
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="btn-ghost text-sm hidden sm:inline-flex"
            >
              Sign in
            </a>
            <a href="/signup" className="btn-primary text-sm py-2">
              Get Started
            </a>
          </div>
        </nav>
      </motion.header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
          {/* Background effects */}
          <div className="absolute inset-0 bg-glow -z-10" />
          <div className="absolute inset-0 bg-grid opacity-30 -z-10" />

          {/* Floating elements */}
          <div className="absolute top-40 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -z-10" />

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left column - Copy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full text-accent text-xs font-medium border border-accent/20">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-soft" />
                  Now with GitHub OAuth
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary tracking-tighter leading-[1.1]">
                  Deploy apps in
                  <br />
                  <span className="text-gradient">seconds</span>, not hours
                </h1>

                <p className="text-lg text-text-secondary max-w-lg leading-relaxed">
                  Connect your GitHub repository and deploy to a global edge network
                  with zero configuration. Built for developers who value speed.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/signup" className="btn-primary text-base px-6 py-3">
                    Start Deploying
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                  <a
                    href="#how-it-works"
                    className="btn-secondary text-base px-6 py-3"
                  >
                    See how it works
                  </a>
                </div>

                {/* Social proof */}
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-bg-tertiary border-2 border-bg-primary flex items-center justify-center text-xs text-text-muted"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="text-text-primary font-medium">
                      2,847
                    </span>
                    <span className="text-text-secondary"> developers</span>
                  </div>
                  <div className="h-4 w-px bg-border-subtle" />
                  <div className="text-sm">
                    <span className="text-success">●</span>
                    <span className="text-text-secondary ml-1">99.99% uptime</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border-subtle">
                  <div>
                    <div className="text-2xl font-bold text-text-primary">
                      1.2M+
                    </div>
                    <div className="text-xs text-text-muted">Deployments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-text-primary">
                      35+
                    </div>
                    <div className="text-xs text-text-muted">Edge Regions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-text-primary">
                      &lt;50ms
                    </div>
                    <div className="text-xs text-text-muted">Avg Latency</div>
                  </div>
                </div>
              </motion.div>

              {/* Right column - Terminal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Terminal window */}
                <div className="relative bg-bg-secondary rounded-xl border border-border-subtle shadow-2xl overflow-hidden">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-bg-tertiary border-b border-border-subtle">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-text-muted font-mono">
                        bash — 80×24
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Live</span>
                    </div>
                  </div>

                  {/* Terminal body */}
                  <div className="p-4 font-mono text-sm min-h-[320px]">
                    {terminalLines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`leading-relaxed ${
                          line.startsWith("$")
                            ? "text-text-primary"
                            : line.startsWith("→")
                            ? "text-blue-400"
                            : line.startsWith("✓")
                            ? "text-emerald-400"
                            : "text-text-secondary"
                        }`}
                      >
                        {line}
                        {i === terminalLines.length - 1 && showCursor && (
                          <span className="inline-block w-2 h-4 bg-text-muted ml-1 animate-pulse" />
                        )}
                      </motion.div>
                    ))}

                    {/* Infrastructure indicators */}
                    <div className="mt-8 pt-4 border-t border-border-subtle">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                          <span className="text-text-muted">Edge: Frankfurt</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-text-muted">Edge: Singapore</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-text-muted">Edge: NYC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 section-subtle">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4">
                Everything you need to ship
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Production-grade infrastructure with the ergonomics of a single command.
                Deploy fast, iterate safely, and scale without thinking about ops.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[{
                title: "Zero-config builds",
                detail: "Auto-detect frameworks. Deterministic output.",
              }, {
                title: "Edge by default",
                detail: "Multi-region delivery with low-latency routing.",
              }, {
                title: "Secure baseline",
                detail: "Isolated builds, signed URLs, and HTTPS-ready.",
              }].map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-xl bg-bg-secondary/60 border border-border-subtle"
                >
                  <div className="text-text-primary font-semibold tracking-tight">
                    {item.title}
                  </div>
                  <div className="mt-1 text-sm text-text-secondary">
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="group relative p-6 bg-bg-secondary rounded-xl border border-border-subtle hover:border-border transition-all duration-300 hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-text-primary font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4">
                From code to global in 3 steps
              </h2>
              <p className="text-text-secondary text-lg">
                No configuration. No Dockerfile. Just deploy.
              </p>
            </motion.div>

            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent hidden md:block" />

              <div className="space-y-12">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative flex gap-6 md:gap-12"
                  >
                    {/* Step number */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-bg-secondary border border-border-subtle flex items-center justify-center text-accent font-bold text-lg shadow-lg">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">
                          {step.title}
                        </h3>
                        <p className="text-text-secondary">{step.description}</p>
                      </div>

                      {/* Code block */}
                      {step.code && (
                        <div className="bg-bg-tertiary rounded-lg border border-border-subtle overflow-hidden">
                          <div className="px-4 py-2 bg-bg-elevated border-b border-border-subtle">
                            <span className="text-xs text-text-muted font-mono">
                              CLI
                            </span>
                          </div>
                          <div className="p-4 font-mono text-sm">
                            <span className="text-blue-400">{step.code}</span>
                          </div>
                        </div>
                      )}

                      {/* Output */}
                      {step.output && (
                        <div className="bg-bg-tertiary rounded-lg border border-border-subtle overflow-hidden">
                          <div className="px-4 py-2 bg-bg-elevated border-b border-border-subtle flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                            <span className="text-xs text-text-muted font-mono">
                              Output
                            </span>
                          </div>
                          <div className="p-4 font-mono text-sm text-text-secondary whitespace-pre-line">
                            {step.output}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 section-subtle">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4">
                Ready to deploy?
              </h2>
              <p className="text-text-secondary text-lg mb-8">
                Start for free. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/signup" className="btn-primary text-base px-8 py-4">
                  Get Started Free
                </a>
                <a
                  href="#"
                  className="btn-secondary text-base px-8 py-4"
                >
                  Contact Sales
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-text-primary font-semibold">Voltex</span>
              </div>
              <p className="text-text-secondary text-sm mb-4 max-w-xs">
                The fastest way to deploy web applications.
                Built for developers who ship.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-text-primary font-medium text-sm mb-4">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-text-secondary text-sm hover:text-text-primary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border-subtle">
            <div className="text-text-muted text-sm">
              © 2026 Voltex Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                All systems operational
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
