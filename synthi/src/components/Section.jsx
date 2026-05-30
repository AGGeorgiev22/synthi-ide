"use client";

import { useInView } from "@/components/lib/useMotion";
import { cn } from "@/lib/utils";

/** Fade/slide a block in when it enters the viewport. */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={cn("reveal", inView && "in-view", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, className }) {
  return (
    <div className={cn("inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.2em] text-brand", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]" />
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, align = "left", className, maxWidth = "max-w-2xl" }) {
  const centered = align === "center";
  return (
    <div className={cn(centered ? `mx-auto ${maxWidth} text-center` : maxWidth, className)}>
      {eyebrow && (
        <Reveal>
          <div className={cn(centered && "flex justify-center")}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        </Reveal>
      )}
      <Reveal delay={60}>
        <h2 className="mt-5 text-balance text-[31px] font-semibold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[44px] lg:text-[50px]">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={120}>
          <p className={cn("mt-5 text-balance text-[15.5px] leading-relaxed text-ink-dim sm:text-[17.5px]", centered ? "mx-auto" : "")}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
