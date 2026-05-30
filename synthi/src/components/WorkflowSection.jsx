"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

/* ---------- Text tabs with a cursor-tracking viewfinder crosshair ----------
   Plain text labels (no pills) framed by the brand's viewfinder brackets (the
   same four gradient corners as the logo). A thin crosshair line tracks the
   pointer with an rAF eased-lerp (the project's Figma-style smooth-cursor
   convention, not CSS keyframes), and the frame settles onto the active label
   on leave. Degrades to a static frame on the active label for touch /
   reduced-motion. */
const BRACKETS = [
  { x: "left", y: "top", color: "#ff3dbe" },
  { x: "right", y: "top", color: "#ff5c2a" },
  { x: "left", y: "bottom", color: "#22d3ee" },
  { x: "right", y: "bottom", color: "#7c5cff" },
];

function cornerStyle({ x, y, color }) {
  const s = {
    position: "absolute",
    height: 11,
    width: 11,
    borderColor: color,
    borderStyle: "solid",
    borderTopWidth: y === "top" ? 1.5 : 0,
    borderBottomWidth: y === "bottom" ? 1.5 : 0,
    borderLeftWidth: x === "left" ? 1.5 : 0,
    borderRightWidth: x === "right" ? 1.5 : 0,
  };
  s[x] = -4;
  s[y] = -4;
  s[`border${y === "top" ? "Top" : "Bottom"}${x === "left" ? "Left" : "Right"}Radius`] = 4;
  return s;
}

function TabRail({ tabs, active, setActive, reduced }) {
  const railRef = useRef(null);
  const pillRefs = useRef([]);
  const frameRef = useRef(null);
  const lineRef = useRef(null);
  const metrics = useRef([]);
  const pointer = useRef({ x: 0, inside: false });
  const activeRef = useRef(active);
  const reducedRef = useRef(reduced);
  activeRef.current = active;
  reducedRef.current = reduced;
  const [enabled, setEnabled] = useState(false);

  const placeStatic = useCallback(() => {
    const m = metrics.current[activeRef.current];
    if (m && frameRef.current) {
      frameRef.current.style.transform = `translate(${m.left}px, ${m.top}px)`;
      frameRef.current.style.width = `${m.w}px`;
      frameRef.current.style.height = `${m.h}px`;
    }
    if (m && lineRef.current) lineRef.current.style.transform = `translateX(${m.cx}px)`;
  }, []);

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const rb = rail.getBoundingClientRect();
    metrics.current = pillRefs.current.map((el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        left: b.left - rb.left,
        top: b.top - rb.top,
        w: b.width,
        h: b.height,
        cx: b.left - rb.left + b.width / 2,
      };
    });
    if (reducedRef.current) placeStatic();
  }, [placeStatic]);

  // Cursor tracking only for fine pointers on wider screens (no touch hijack).
  useEffect(() => {
    if (reduced) { setEnabled(false); return; }
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 640px)");
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [reduced]);

  // Measure pill geometry on mount, on resize, and once more after fonts settle.
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (railRef.current) ro.observe(railRef.current);
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 260);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [measure]);

  // Reduced motion / static: snap the frame to the active pill on selection.
  useEffect(() => {
    if (reduced) placeStatic();
  }, [active, reduced, placeStatic]);

  // Persistent eased-lerp loop (non-reduced): glides the frame toward the
  // targeted pill and the crosshair toward the live pointer.
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const a = { fx: null, fy: 0, fw: 0, fh: 0, lx: 0 };
    const tick = () => {
      const m = metrics.current;
      const act = m[activeRef.current];
      if (act) {
        let target = act;
        if (pointer.current.inside) {
          let best = act;
          let bestD = Infinity;
          for (const p of m) {
            if (!p) continue;
            const d = Math.abs(p.cx - pointer.current.x);
            if (d < bestD) { bestD = d; best = p; }
          }
          target = best;
        }
        if (a.fx == null) {
          a.fx = target.left; a.fy = target.top; a.fw = target.w; a.fh = target.h; a.lx = act.cx;
        }
        a.fx += (target.left - a.fx) * 0.22;
        a.fy += (target.top - a.fy) * 0.22;
        a.fw += (target.w - a.fw) * 0.22;
        a.fh += (target.h - a.fh) * 0.22;
        const lt = pointer.current.inside ? pointer.current.x : act.cx;
        a.lx += (lt - a.lx) * 0.3;
        if (frameRef.current) {
          frameRef.current.style.transform = `translate(${a.fx}px, ${a.fy}px)`;
          frameRef.current.style.width = `${a.fw}px`;
          frameRef.current.style.height = `${a.fh}px`;
        }
        if (lineRef.current) lineRef.current.style.transform = `translateX(${a.lx}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const onMove = (e) => {
    if (!enabled) return;
    const rb = railRef.current.getBoundingClientRect();
    pointer.current.x = e.clientX - rb.left;
    pointer.current.inside = true;
    if (lineRef.current) lineRef.current.style.opacity = "1";
  };
  const onLeave = () => {
    pointer.current.inside = false;
    if (lineRef.current) lineRef.current.style.opacity = "0";
  };
  const onKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActive((active + 1) % tabs.length);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((active - 1 + tabs.length) % tabs.length);
    }
  };

  return (
    <div
      ref={railRef}
      role="tablist"
      aria-label="Workflows"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onKeyDown={onKey}
      className="relative mx-auto mt-12 flex w-fit max-w-full flex-wrap items-center justify-center gap-x-7 gap-y-3 px-6 py-3 sm:gap-x-9"
    >
      {/* crosshair scan line — tracks the cursor while hovering */}
      <span
        ref={lineRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1 left-0 w-px bg-gradient-to-b from-transparent via-cyan/55 to-transparent opacity-0 transition-opacity duration-300"
        style={{ transform: "translateX(0px)" }}
      />

      {/* viewfinder focus frame — the logo's four gradient corner brackets */}
      <span ref={frameRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0" style={{ width: 0, height: 0 }}>
        {BRACKETS.map((b, i) => (
          <i key={i} style={cornerStyle(b)} />
        ))}
      </span>

      {tabs.map((tab, i) => {
        const on = i === active;
        return (
          <button
            key={tab.id}
            ref={(el) => (pillRefs.current[i] = el)}
            type="button"
            role="tab"
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "relative z-10 px-1.5 py-1.5 text-[14px] tracking-tight transition-colors duration-200 outline-none",
              on ? "font-semibold text-ink" : "font-medium text-ink-faint hover:text-ink-dim"
            )}
          >
            {tab.tab}
          </button>
        );
      })}
    </div>
  );
}

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

        {/* tab rail with cursor-tracking viewfinder crosshair */}
        <TabRail tabs={TABS} active={active} setActive={setActive} reduced={reduced} />

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

