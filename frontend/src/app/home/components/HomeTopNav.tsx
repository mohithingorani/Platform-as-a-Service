"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, GitBranch, LogOut, Plus, Settings } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Activity },
  { id: "deploy", label: "Deploy", icon: Plus },
  { id: "deployments", label: "Deployments", icon: GitBranch },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function HomeTopNav({
  activeTab,
  onTab,
  onNew,
  user,
}: {
  activeTab: string;
  onTab: (tab: string) => void;
  onNew: () => void;
  user:
    | null
    | {
        name?: string;
        username?: string;
        picture?: string;
      };
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => onTab("dashboard")}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <div className="text-white font-semibold tracking-tight hidden sm:block">
            Voltex
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTab(item.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {isActive ? (
                  <motion.div
                    layoutId="homeTab"
                    className="absolute inset-0 rounded-xl bg-zinc-950/60 border border-zinc-800"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : null}
                <span className="relative">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onNew}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt={user.name || "User"}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-xl border border-zinc-800"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.[0] || "U"}
                </div>
              )}
            </button>

            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-xl shadow-black/40"
              >
                <button
                  role="menuitem"
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-200 hover:bg-zinc-900/60 transition-colors"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/api/auth/logout");
                  }}
                >
                  <LogOut className="w-4 h-4 text-zinc-400" />
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="md:hidden max-w-6xl mx-auto px-4 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTab(item.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {isActive ? (
                  <motion.div
                    layoutId="homeTabMobile"
                    className="absolute inset-0 rounded-xl bg-zinc-900/40 border border-zinc-800"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : null}
                <span className="relative">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
