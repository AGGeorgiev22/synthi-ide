"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

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
      title={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-line text-ink-dim outline-none transition-[border-color,color,background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-line-2 hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-cyan/70 active:scale-[0.97]",
        className
      )}
    >
      <Sun
        size={16}
        weight="bold"
        className={cn(
          "absolute transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          mounted && !isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"
        )}
      />
      <Moon
        size={16}
        weight="bold"
        className={cn(
          "absolute transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          !mounted || isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
        )}
      />
    </button>
  );
}
