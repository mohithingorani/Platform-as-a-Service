import {
  Github,
  Container,
  ScrollText,
  Globe,
  Database,
  ListOrdered,
  type LucideIcon,
} from "lucide-react";

/**
 * Everything here describes what Voltex ACTUALLY does — no invented metrics,
 * no features that aren't built. The real product is a from-scratch PaaS:
 * git clone -> isolated Docker build -> S3 -> wildcard-subdomain serving,
 * with live build logs streamed over WebSockets.
 */

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const features: Feature[] = [
  {
    title: "Deploy from a GitHub URL",
    description:
      "Paste a public repo URL. Voltex shallow-clones it, detects the framework, and ships the build output — no Dockerfile, no config.",
    icon: Github,
  },
  {
    title: "Sandboxed Docker builds",
    description:
      "Every build runs in a throwaway node:22 container (docker run --rm). Untrusted code never touches the host.",
    icon: Container,
  },
  {
    title: "Live build logs",
    description:
      "Build output is published to Redis pub/sub and streamed to your browser over WebSockets — watch npm install and bundling in real time.",
    icon: ScrollText,
  },
  {
    title: "Instant subdomain hosting",
    description:
      "Each deploy is served on its own subdomain (<id>.deploy.mohit.systems), routed through Nginx to the asset handler.",
    icon: Globe,
  },
  {
    title: "S3-backed asset serving",
    description:
      "Built assets live in object storage and are served with smart cache headers — immutable for hashed bundles, no-cache for index.html.",
    icon: Database,
  },
  {
    title: "Redis job queue",
    description:
      "Deploys are enqueued and picked up by a background worker, with status and timing tracked end-to-end across the pipeline.",
    icon: ListOrdered,
  },
];

/** Mirrors the real pipeline in CLAUDE.md / the service code. */
export type Stage = {
  id: string;
  label: string;
  sub: string;
};

export const stages: Stage[] = [
  { id: "frontend", label: "Frontend", sub: "POST /deploy" },
  { id: "upload", label: "upload-service", sub: "clone + stage to S3" },
  { id: "queue", label: "Redis queue", sub: "build-queue" },
  { id: "deploy", label: "deploy-service", sub: "docker build" },
  { id: "handler", label: "request-handler", sub: "serve from S3" },
  { id: "live", label: "Live site", sub: "<id>.deploy.*" },
];

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

/** The stack Voltex is actually built on — honest "powered by" strip. */
export const techStack: string[] = [
  "Next.js",
  "TypeScript",
  "Docker",
  "Redis",
  "AWS S3",
  "PostgreSQL",
  "WebSockets",
  "Express",
  "Prisma",
  "Nginx",
  "Tailwind",
  "Framer Motion",
];

/** Honest architecture facts for the "by the numbers" band. */
export type Stat = { value: number; suffix?: string; prefix?: string; label: string };
export const stats: Stat[] = [
  { value: 6, label: "Microservices in the pipeline" },
  { value: 3, label: "Datastores (Redis · S3 · Postgres)" },
  { value: 1, label: "GitHub URL to deploy" },
  { value: 100, suffix: "%", label: "Builds run sandboxed in Docker" },
];

export type Faq = { q: string; a: string };
export const faqs: Faq[] = [
  {
    q: "What frameworks can I deploy?",
    a: "Anything that builds to a static dist/ folder — React, Vue, Svelte, Vite, and similar. Voltex auto-detects the stack, runs npm install && npm run build, and serves the output. No framework lock-in.",
  },
  {
    q: "Do I need a Dockerfile or any config?",
    a: "No. You paste a public GitHub URL and that's it. The build happens inside a managed node:22 container that Voltex spins up and tears down for you.",
  },
  {
    q: "Is my code safe during the build?",
    a: "Every build runs in a throwaway, isolated Docker container (docker run --rm). Untrusted repo code never executes on the host, and the container is destroyed when the build finishes.",
  },
  {
    q: "How do the live logs work?",
    a: "The build worker publishes stdout/stderr to a Redis pub/sub channel. A WebSocket server replays the stored history and then streams new lines straight to your browser — so you watch installs and bundling as they happen.",
  },
  {
    q: "Where does my site get hosted?",
    a: "Built assets are uploaded to S3 and served through a request handler behind Nginx, on a dedicated subdomain per deploy (<id>.deploy.mohit.systems) with sensible cache headers.",
  },
  {
    q: "Is it open source?",
    a: "Yes — the whole platform is on GitHub. It's a personal engineering project, free to use and free to fork.",
  },
];

export type Plan = {
  name: string;
  price: string;
  cadence?: string;
  blurb: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Hosted",
    price: "Free",
    blurb: "Use the live platform. Sign in with GitHub and deploy in seconds.",
    features: [
      "Unlimited public-repo deploys",
      "Sandboxed Docker builds",
      "Real-time build logs",
      "Subdomain per deployment",
    ],
    cta: "Start deploying",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Self-host",
    price: "Open source",
    blurb: "Clone the repo and run the whole stack yourself with Docker Compose.",
    features: [
      "All 6 services included",
      "Bring your own S3 + domain",
      "Full source, MIT-spirited",
      "Hack on it freely",
    ],
    cta: "View on GitHub",
    href: "https://github.com/mohithingorani/Platform-as-a-Service",
  },
];

/** Real, scripted-from-reality deploy log lines for the hero terminal. */
export type LogLine = { kind: "cmd" | "step" | "ok" | "info" | "url"; text: string };

export const deployScript: LogLine[] = [
  { kind: "cmd", text: "$ voltex deploy github.com/user/react-app" },
  { kind: "step", text: "→ upload-service: cloning repository (--depth 1)" },
  { kind: "ok", text: "✓ source staged to S3 (output/a1b2c)" },
  { kind: "step", text: "→ redis: LPUSH build-queue a1b2c" },
  { kind: "info", text: "→ deploy-service: docker run --rm node:22" },
  { kind: "info", text: "  [BUILD] added 278 packages in 9s" },
  { kind: "info", text: "  [BUILD] vite v5 building for production..." },
  { kind: "ok", text: "✓ built dist/ in 1.2s" },
  { kind: "step", text: "→ uploading dist/a1b2c/** to S3" },
  { kind: "ok", text: "✓ status: deployed" },
  { kind: "url", text: "→ https://a1b2c.deploy.mohit.systems" },
];
