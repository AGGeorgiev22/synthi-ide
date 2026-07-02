"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Sun/moon theme switch. Hydration-safe (renders a placeholder until mounted). */
export function ThemeToggle({ className }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line text-ink-dim transition-[border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-line-2 hover:text-ink active:translate-y-0",
        className
      )}
    >
      {/* both icons cross-fade so there is no layout shift before mount */}
      <Sun
        size={16}
        weight="bold"
        className={cn(
          "absolute transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          mounted && !isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"
        )}
      />
      <Moon
        size={16}
        weight="bold"
        className={cn(
          "absolute transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          !mounted || isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
        )}
      />
    </button>
  );
}
