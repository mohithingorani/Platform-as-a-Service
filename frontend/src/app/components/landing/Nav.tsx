"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "./data";
import { GitHubIcon } from "./BrandIcons";
import BrandMark from "../BrandMark";

const REPO_URL = "https://github.com/mohithingorani/Platform-as-a-Service";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu once we cross back to desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Track which section is in view for the sliding nav indicator.
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute top-0 inset-x-0 h-0.5 origin-left bg-gradient-to-r from-accent via-accent-hover to-violet-500"
      />

      <div className="max-w-6xl mx-auto px-4">
        <nav
          className={`mt-3 flex items-center justify-between rounded-2xl pl-4 pr-3 h-14 transition-all duration-300 ${
            scrolled
              ? "bg-bg-secondary/70 backdrop-blur-xl border border-border-subtle shadow-lg shadow-black/20"
              : "border border-transparent"
          }`}
        >
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2.5 shrink-0">
            <BrandMark size="sm" />
            <span className="text-text-primary font-semibold text-lg tracking-tight">Voltex</span>
          </a>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-sm transition-colors ${
                    isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-bg-hover -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <a
              href={REPO_URL}
              aria-label="GitHub"
              className="hidden sm:inline-flex w-9 h-9 rounded-lg items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
            <a href="/login" className="btn-ghost text-sm hidden sm:inline-flex">
              Sign in
            </a>
            <a href="/signup" className="btn-primary text-sm py-2">
              Get Started
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden w-9 h-9 ml-0.5 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="md:hidden fixed inset-0 top-[72px] -z-10 bg-bg-primary/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden mx-4 mt-2 rounded-2xl border border-border-subtle bg-bg-secondary/95 backdrop-blur-xl shadow-xl shadow-black/30 overflow-hidden"
            >
              <div className="p-2">
                {navLinks.map((link) => {
                  const isActive = active === link.href.slice(1);
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                        isActive
                          ? "bg-bg-hover text-text-primary"
                          : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                      }`}
                    >
                      {link.label}
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                    </a>
                  );
                })}
              </div>
              <div className="p-3 border-t border-border-subtle flex flex-col gap-2">
                <a
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-secondary text-sm text-center py-2.5"
                >
                  Sign in
                </a>
                <a
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="btn-primary text-sm justify-center py-2.5"
                >
                  Get Started
                </a>
                <a
                  href={REPO_URL}
                  className="inline-flex items-center justify-center gap-2 text-sm text-text-muted hover:text-text-secondary py-1.5 transition-colors"
                >
                  <GitHubIcon className="w-4 h-4" />
                  View source
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
