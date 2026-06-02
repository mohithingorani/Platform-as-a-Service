import { techStack } from "./data";

/**
 * Honest "powered by" strip — the real stack Voltex runs on, scrolling as a
 * seamless marquee. Doubled list + 50% translate = no visible seam.
 */
export default function TechMarquee() {
  const row = [...techStack, ...techStack];
  return (
    <section className="py-12 border-y border-border-subtle bg-bg-secondary/40">
      <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-text-muted mb-8">
        Built on a production-grade stack
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {row.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="shrink-0 inline-flex items-center rounded-full border border-border-subtle bg-bg-secondary px-5 py-2 text-sm font-medium text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
