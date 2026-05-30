"use client";

import {
  PenLine,
  Boxes,
  Radio,
  Crosshair,
  Sparkles,
  GitCompare,
  CheckCircle2,
  Monitor,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading } from "@/components/Section";
import { useActive, useReducedMotion, useStagger } from "@/components/lib/useMotion";
import { cn } from "@/lib/utils";

const EVENTS = [
  { t: "00:00.0", label: "Developer edits runtime logic", detail: "src/runtime/session.rs", tone: "info", Icon: PenLine },
  { t: "00:00.3", label: "Runtime attaches", detail: "cloud workspace · observing live", tone: "info", Icon: Boxes },
  { t: "00:01.1", label: "Failure predicted", detail: "borrow of moved value · before it ran", tone: "warn", Icon: Radio },
  { t: "00:01.4", label: "Traced to source", detail: "session.rs:8 · moved handle", tone: "warn", Icon: Crosshair },
  { t: "00:02.0", label: "Agent proposes patch", detail: "clone handle for dispose closure", tone: "run", Icon: Sparkles },
  { t: "00:02.2", label: "Diff reviewed", detail: "+1 −1 · scoped to session.rs", tone: "run", Icon: GitCompare },
  { t: "00:03.4", label: "Tests pass", detail: "24 passed · 0 failed · 1.18s", tone: "ok", Icon: CheckCircle2 },
  { t: "00:03.6", label: "Patched in place", detail: "state kept · preview never dropped", tone: "ok", Icon: Monitor },
  { t: "00:03.9", label: "Fix verified", detail: "runtime stable · no restart", tone: "ok", Icon: ShieldCheck },
];

const TONE = {
  info: { c: "#5b9dff", text: "text-blue" },
  run: { c: "#2dd4ee", text: "text-cyan" },
  warn: { c: "#f5b13d", text: "text-warn" },
  ok: { c: "#46e0a0", text: "text-ok" },
};

export function DemoTimeline() {
  const reduced = useReducedMotion();
  const [ref, active] = useActive("0px 0px -20% 0px");
  const count = useStagger(EVENTS.length, { active, reduced, interval: 420, startDelay: 200 });

  return (
    <section id="demo" className="relative scroll-mt-24 border-y border-line bg-bg-2/40 py-24 sm:py-32">
      <div ref={ref} className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Demo · event stream"
          align="center"
          title="Watch the agent catch the failure before you chase it."
          subtitle="A real run, as a live event stream - from the first edit to a verified fix."
        />

        <div className="surface-dark mx-auto mt-12 max-w-2xl overflow-hidden rounded-2xl border border-line-2 bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
          <div className="flex items-center gap-2 border-b border-line bg-bg-2/80 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="ml-1 font-mono text-[11px] text-ink-dim">vectant · run #4812</span>
            <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10.5px] text-cyan">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
              streaming
            </span>
          </div>

          <ol className="relative px-4 py-4 sm:px-6">
            {EVENTS.map((e, i) => {
              const shown = i < count;
              const t = TONE[e.tone];
              const Icon = e.Icon;
              const isLast = i === EVENTS.length - 1;
              return (
                <li
                  key={i}
                  className={cn(
                    "relative flex gap-4 pb-5 transition-all duration-500",
                    shown ? "opacity-100" : "opacity-0"
                  )}
                >
                  {/* connector */}
                  {!isLast && (
                    <span
                      className="absolute left-[15px] top-7 h-[calc(100%-18px)] w-[1.5px] transition-colors duration-500"
                      style={{ background: i < count - 1 ? `${t.c}55` : "rgba(255,255,255,0.08)" }}
                    />
                  )}
                  {/* node */}
                  <span
                    className="relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-500"
                    style={{
                      borderColor: shown ? `${t.c}55` : "rgba(255,255,255,0.08)",
                      background: shown ? `${t.c}14` : "rgba(255,255,255,0.02)",
                      color: shown ? t.c : "#6c6f78",
                    }}
                  >
                    <Icon size={14} />
                  </span>
                  <div className={cn("flex min-w-0 flex-1 flex-col pt-0.5", shown && "stream-in")}>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[10.5px] text-ink-faint">{e.t}</span>
                      <span className="text-[14px] font-medium text-ink">{e.label}</span>
                    </div>
                    <span className="mt-0.5 font-mono text-[11.5px] text-ink-faint">{e.detail}</span>
                  </div>
                  {isLast && shown && (
                    <span className="mt-1 hidden items-center sm:flex">
                      <span className="rounded-full border border-ok/30 bg-ok/[0.08] px-2.5 py-1 font-mono text-[10.5px] text-ok">
                        ✓ verified
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
