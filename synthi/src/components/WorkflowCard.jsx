"use client";

import { useInView, useActive, useReducedMotion } from "@/components/lib/useMotion";
import { cn } from "@/lib/utils";

/**
 * Large workflow card: header (icon + title + copy) over an animated product
 * visual. Children may be a render function receiving `active` (true once the
 * card is on-screen, or always under reduced motion).
 */
export function WorkflowCard({ id, icon: Icon, title, copy, children, className }) {
  const reduced = useReducedMotion();
  const [revealRef, inView] = useInView();
  const [activeRef, active] = useActive("0px 0px -12% 0px");
  const on = reduced || active;

  return (
    <article
      ref={revealRef}
      id={id}
      className={cn(
        "reveal group relative flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors duration-500 hover:border-line-2 sm:p-7",
        inView && "in-view",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 accent-glow opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-60" />
      <header className="mb-5">
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface-2 text-cyan">
          <Icon size={17} />
        </div>
        <h3 className="text-[18px] font-semibold tracking-tight text-ink sm:text-[20px]">{title}</h3>
        <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ink-dim">{copy}</p>
      </header>
      <div ref={activeRef} className="mt-auto">
        {typeof children === "function" ? children(on) : children}
      </div>
    </article>
  );
}
