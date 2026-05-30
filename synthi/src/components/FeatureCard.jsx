"use client";

import { Reveal } from "@/components/Section";
import { cn } from "@/lib/utils";

/**
 * Premium feature pillar card. Minimal icon, confident title, concrete copy,
 * a faint runtime-flavored footer detail.
 */
export function FeatureCard({ icon: Icon, title, copy, detail, delay = 0, className }) {
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors duration-500 hover:border-line-2 sm:p-7",
          className
        )}
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface-2 text-cyan transition-colors duration-500 group-hover:border-cyan/30 group-hover:bg-cyan/[0.06]">
          <Icon size={18} />
        </div>
        <h3 className="text-[17px] font-semibold tracking-tight text-ink">{title}</h3>
        <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-dim">{copy}</p>
        {detail && (
          <div className="mt-5 border-t border-line pt-3 font-mono text-[11px] text-ink-faint">{detail}</div>
        )}
      </article>
    </Reveal>
  );
}
