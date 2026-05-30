"use client";

import { useState } from "react";
import { Gauge, Cpu, Gamepad2, Bot } from "lucide-react";
import { SectionHeading } from "@/components/Section";
import {
  StatusPill,
  PreviewPane,
  AnimatedTerminal,
  RuntimeAgentPanel,
  C,
} from "@/components/workspace/parts";
import { useStagger, useActive, useReducedMotion } from "@/components/lib/useMotion";
import { cn } from "@/lib/utils";

/* ---------- Card 1: everyday code / instant feedback ---------- */
function CpuHmrVisual({ active }) {
  return (
    <div className="surface-dark overflow-hidden rounded-xl border border-line bg-bg-2/60">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="border-b border-line p-3 font-mono text-[11.5px] leading-[1.7] sm:border-b-0 sm:border-r">
          <div className="tok-com">// theme.ts</div>
          <div>
            <C k="kw">export</C> <C k="kw">const</C> <C k="prop">accent</C> =
          </div>
          <div className={cn("rounded-sm px-1 transition-colors duration-500", active && "bg-cyan/[0.08]")}>
            {"  "}
            <C k="str">&quot;#2dd4ee&quot;</C>;
            {active && <span className="caret" />}
          </div>
        </div>
        <PreviewPane variant="web" state={active ? "updated" : "live"} className="h-[148px]" />
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line p-3">
        <StatusPill tone={active ? "ok" : "idle"}>patched in place</StatusPill>
        <StatusPill tone={active ? "info" : "idle"}>state preserved</StatusPill>
      </div>
    </div>
  );
}

/* ---------- Card 2: GPU / accelerated compute (examples, not limits) ---------- */
const GPU_LOGS = [
  { tone: "cmd", text: "build kernel · instant" },
  { tone: "warn", text: "agent · predicted register spill, 64B" },
  { tone: "err", text: "✗ launch failed · illegal address" },
  { tone: "info", text: "agent · likely OOB in tile loop · sched:88" },
];
function GpuVisual({ active }) {
  const reduced = useReducedMotion();
  const count = useStagger(GPU_LOGS.length, { active, reduced, interval: 520, startDelay: 250 });
  return (
    <div className="surface-dark overflow-hidden rounded-xl border border-line bg-bg-2/60">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="font-mono text-[10px] text-ink-faint">e.g.</span>
        <span className="rounded border border-ok/30 bg-ok/10 px-1.5 py-0.5 font-mono text-[10px] text-ok">CUDA</span>
        <span className="rounded border border-line bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">ROCm</span>
        <span className="rounded border border-line bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">Metal</span>
        <span className="ml-auto font-mono text-[10px] text-ink-faint">+ more</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="border-b border-line sm:border-b-0 sm:border-r">
          <AnimatedTerminal lines={GPU_LOGS} count={count} title="kernel · build" className="h-[150px]" showCaret={false} />
        </div>
        <PreviewPane variant="cuda" state={active && count >= 3 ? "error" : "live"} className="h-[150px]" />
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line p-3">
        <StatusPill tone={active && count >= 3 ? "info" : "idle"} pulse>
          Runtime signal captured
        </StatusPill>
        <StatusPill tone={active ? "ok" : "idle"}>loop · instant</StatusPill>
      </div>
    </div>
  );
}

/* ---------- Card 3: Game engine ---------- */
function EngineVisual({ active }) {
  return (
    <div className="surface-dark overflow-hidden rounded-xl border border-line bg-bg-2/60">
      <PreviewPane variant="engine" state={active ? "updated" : "live"} className="h-[168px]" />
      <div className="grid grid-cols-3 divide-x divide-line border-t border-line font-mono">
        {[
          ["frame", active ? "16.6 ms" : "16.7 ms"],
          ["draw calls", active ? "412" : "408"],
          ["fps", "60"],
        ].map(([k, v]) => (
          <div key={k} className="px-3 py-2">
            <div className="text-[9.5px] uppercase tracking-wider text-ink-faint">{k}</div>
            <div className="text-[13px] text-ink">{v}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line p-3">
        <StatusPill tone={active ? "ok" : "idle"}>Scene updated</StatusPill>
        <StatusPill tone={active ? "run" : "idle"} pulse>viewport live</StatusPill>
      </div>
    </div>
  );
}

/* ---------- Card 4: Runtime-native agent ---------- */
const AGENT_MSGS = [
  { kind: "signal", text: "Observing logs, preview, diff, and tests." },
  { kind: "trace", text: "Predicted the timeout before it fired." },
  { kind: "patch", text: "Patched in place - state preserved." },
  { kind: "ok", text: "Green · 24/24 · preview never dropped." },
];
const SOURCES = ["logs", "preview", "diff", "tests"];
function AgentVisual({ active }) {
  const reduced = useReducedMotion();
  const count = useStagger(AGENT_MSGS.length, { active, reduced, interval: 620, startDelay: 250 });
  const srcCount = useStagger(SOURCES.length, { active, reduced, interval: 220, startDelay: 150 });
  const done = count >= AGENT_MSGS.length;
  return (
    <div className="surface-dark overflow-hidden rounded-xl border border-line bg-bg-2/60">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        {SOURCES.map((s, i) => (
          <span
            key={s}
            className={cn(
              "rounded border px-1.5 py-0.5 font-mono text-[10px] transition-colors duration-300",
              i < srcCount ? "border-cyan/30 bg-cyan/10 text-cyan" : "border-line bg-white/[0.02] text-ink-faint"
            )}
          >
            {s}
          </span>
        ))}
        <span className="ml-auto font-mono text-[10px] text-ink-faint">→ agent</span>
      </div>
      <RuntimeAgentPanel messages={AGENT_MSGS} count={count} working={!done} className="h-[150px] overflow-hidden" />
      <div className="border-t border-line p-3">
        <StatusPill tone={done ? "ok" : "run"} pulse={!done}>
          {done ? "Fix verified" : "verifying…"}
        </StatusPill>
      </div>
    </div>
  );
}

/* ---------- The four workflows, switched via tabs (one panel at a time keeps
   the section compact instead of a tall four-card stack). ---------- */
const TABS = [
  {
    id: "everyday",
    Icon: Gauge,
    tab: "Everyday code",
    title: "Everyday code, instant feedback",
    copy: "Edit and see the result without breaking flow - patched in place, state kept, for any language with a dev loop.",
    Visual: CpuHmrVisual,
  },
  {
    id: "gpu",
    Icon: Cpu,
    tab: "GPU & compute",
    title: "GPU & accelerated compute",
    copy: "Surface compile output, runtime faults, and logs for CUDA, ROCm, Metal, WebGPU and beyond. Examples, not limits - the loop stays instant whatever you target.",
    Visual: GpuVisual,
  },
  {
    id: "engine",
    Icon: Gamepad2,
    tab: "Game engines",
    title: "Interactive game-engine iteration",
    copy: "Keep the engine viewport alive while iterating on systems, rendering, gameplay, and runtime behavior.",
    Visual: EngineVisual,
  },
  {
    id: "agent",
    Icon: Bot,
    tab: "Runtime agent",
    title: "Runtime-native agent",
    copy: "The agent sees the same execution signals you see (logs, builds, crashes, tests, previews) and predicts failures before they surface.",
    Visual: AgentVisual,
  },
];

export function WorkflowSection() {
  const reduced = useReducedMotion();
  const [panelRef, inView] = useActive("0px 0px -15% 0px");
  const [active, setActive] = useState(0);
  const t = TABS[active];
  const ActiveIcon = t.Icon;
  const Visual = t.Visual;

  return (
    <section id="workflows" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Workflows"
          align="center"
          maxWidth="max-w-3xl"
          title={
            <>
              One workspace. <span className="serif-accent text-ink-dim">Every language, every runtime.</span>
            </>
          }
          subtitle="The same runtime-native loop adapts to whatever you run. These are examples, not an allow-list - if your project has a runtime, Vectant can watch it."
        />

        {/* tab strip */}
        <div role="tablist" aria-label="Workflows" className="mt-12 flex flex-wrap justify-center gap-2">
          {TABS.map((tab, i) => {
            const on = i === active;
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors",
                  on
                    ? "border-cyan/40 bg-transparent text-ink"
                    : "border-line bg-surface text-ink-dim hover:border-line-2 hover:text-ink"
                )}
              >
                <Icon size={15} className={on ? "text-cyan" : "text-ink-faint"} />
                {tab.tab}
              </button>
            );
          })}
        </div>

        {/* active panel */}
        <div ref={panelRef} className="mt-10 grid items-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface-2 text-cyan">
              <ActiveIcon size={18} />
            </div>
            <h3 className="text-[22px] font-semibold tracking-tight text-ink sm:text-[26px]">{t.title}</h3>
            <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-dim">{t.copy}</p>
          </div>
          {/* re-key by tab id so the visual remounts and its animation replays on switch */}
          <div key={t.id}>
            <Visual active={reduced || inView} />
          </div>
        </div>
      </div>
    </section>
  );
}

