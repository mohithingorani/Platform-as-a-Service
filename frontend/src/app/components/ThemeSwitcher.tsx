"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-center rounded-full p-2 transition-colors duration-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun className="h-6 w-6 text-white transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <Moon className="h-6 w-6 text-gray-800 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
