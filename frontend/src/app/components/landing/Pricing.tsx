"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { plans } from "./data";
import Reveal from "./Reveal";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full text-accent text-xs font-medium border border-accent/20 mb-5">
            Free &amp; open source
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4">
            Pricing that&apos;s honest
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            It&apos;s a personal engineering project. Use the hosted platform free, or run the whole
            thing yourself.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`relative rounded-2xl p-7 flex flex-col ${
                plan.highlight
                  ? "border border-accent/40 bg-bg-secondary shadow-glow"
                  : "border border-border-subtle bg-bg-secondary"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-7 px-3 py-1 rounded-full bg-accent text-white text-xs font-medium shadow-lg shadow-accent/30">
                  Most popular
                </span>
              )}
              <h3 className="text-text-primary font-semibold text-lg tracking-tight">{plan.name}</h3>
              <div className="mt-3 mb-1 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tighter text-text-primary">
                  {plan.price}
                </span>
                {plan.cadence && <span className="text-text-muted text-sm">{plan.cadence}</span>}
              </div>
              <p className="text-text-secondary text-sm mb-6">{plan.blurb}</p>

              <ul className="space-y-3 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-accent-hover" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`text-center text-sm py-3 rounded-lg font-medium transition-all ${
                  plan.highlight ? "btn-primary" : "btn-secondary"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
