"use client";

import { useCallback, useRef, useState } from "react";
import { Cpu, Clock, Wind, Flame, AlertTriangle, CheckCircle2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCAL = {
  title: "Local IDE",
  tone: "err",
  rows: [
    { Icon: Clock, k: "Build time", v: "47.2s" },
    { Icon: Cpu, k: "CPU usage", v: "98%" },
    { Icon: Wind, k: "Cooling", v: "Jet engine" },
    { Icon: Flame, k: "HMR", v: "Not supported" },
  ],
  footer: { Icon: AlertTriangle, text: "Out of memory - restart required", cls: "text-err" },
};
const VECTANT = {
  title: "Vectant Cloud",
  tone: "ok",
  rows: [
    { Icon: Clock, k: "Build time", v: "0.18s" },
    { Icon: Cpu, k: "CPU usage", v: "2%" },
    { Icon: Wind, k: "Cooling", v: "Silent" },
    { Icon: Flame, k: "HMR", v: "Instant" },
  ],
  footer: { Icon: CheckCircle2, text: "All systems operational", cls: "text-ok" },
};

function Panel({ data, align }) {
  const accent = data.tone === "ok" ? "text-ok" : "text-err";
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center gap-2 border-b border-line bg-bg-2/80 px-4 py-2.5">
        <span className={cn("h-2 w-2 rounded-full", data.tone === "ok" ? "bg-ok" : "bg-err")} style={{ boxShadow: `0 0 8px ${data.tone === "ok" ? "#46e0a0" : "#ff6b6b"}` }} />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim">{data.title}</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3 px-5 sm:px-7">
        {data.rows.map((r) => {
          const Icon = r.Icon;
          return (
            <div key={r.k} className="flex items-center gap-3">
              <Icon size={15} className="shrink-0 text-ink-faint" />
              <span className="text-[13px] text-ink-faint">{r.k}</span>
              <span className={cn("ml-auto font-mono text-[15px] font-medium tabular-nums", accent)}>{r.v}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 border-t border-line px-5 py-3 font-mono text-[11px] sm:px-7">
        <data.footer.Icon size={13} className={data.footer.cls} />
        <span className={data.footer.cls}>{data.footer.text}</span>
      </div>
    </div>
  );
}

export function BuildCompare() {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);

  const setFromX = useCallback((clientX) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onPointerDown = (e) => {
    e.preventDefault();
    setFromX(e.clientX);
    const move = (ev) => setFromX(ev.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onKey = (e) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 4));
  };

  return (
    <div className="surface-dark relative h-[320px] select-none overflow-hidden rounded-2xl border border-line-2 bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]" ref={ref}>
      {/* base: Vectant */}
      <Panel data={VECTANT} />
      {/* overlay: Local, clipped to the left of the handle */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <div className="absolute inset-0 bg-panel" />
        <Panel data={LOCAL} />
      </div>

      {/* divider + handle */}
      <div className="absolute inset-y-0 z-10" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/40" />
        <button
          type="button"
          onPointerDown={onPointerDown}
          onKeyDown={onKey}
          aria-label="Drag to compare local IDE versus Vectant Cloud"
          role="slider"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/30 bg-bg/90 text-ink shadow-lg backdrop-blur outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
        >
          <GripVertical size={15} />
        </button>
      </div>

      {/* hint */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-line bg-bg/80 px-2.5 py-1 font-mono text-[10px] text-ink-faint">
        drag to compare
      </div>
    </div>
  );
}
