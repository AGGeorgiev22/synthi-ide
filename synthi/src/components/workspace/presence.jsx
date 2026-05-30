"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* Two collaborators sharing one workspace. Colors chosen for white-on-fill
   legibility. Cursor motion is rAF-eased (Figma / Google-Docs style) — each
   cursor lerps toward a soft target and re-targets on a gentle cadence, so it
   glides instead of snapping between keyframes. */
export const PEOPLE = [
  { name: "Mira", initials: "MK", color: "#4f8cff" },
  { name: "Devon", initials: "DV", color: "#ff5fa2" },
];

function CursorGlyph({ name, color }) {
  return (
    <>
      <svg width="17" height="17" viewBox="0 0 18 18" fill="none" className="drop-shadow">
        <path
          d="M2 2 L2 14.5 L5.8 11 L8.6 16.4 L11 15.3 L8.2 10 L13 9.6 Z"
          fill={color}
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="0.8"
        />
      </svg>
      <span
        className="ml-1 mt-2 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow-md"
        style={{ background: color }}
      >
        {name}
      </span>
    </>
  );
}

// deterministic pseudo-random so we never call Math.random during render
const rnd = (n) => {
  const x = Math.sin(n * 99.137) * 7919.13;
  return x - Math.floor(x);
};

// Resting start positions per cursor (normalized 0..1). Kept off the
// top-left corner and away from the right edge so the trailing name label
// never clips against the wrapper's overflow.
const START = [
  { x: 0.18, y: 0.56 },
  { x: 0.58, y: 0.2 },
];
const startPos = (i) => START[i] ?? { x: 0.25 + ((i * 0.19) % 0.4), y: 0.3 };

// Default drift band (normalized): off the corners, clear of the right edge so
// the trailing name label never clips. Callers can pass a tighter `band` to
// keep a cursor in one region (e.g. hovering near its own selection).
const DEFAULT_BAND = { x: [0.1, 0.6], y: [0.14, 0.72] };

/**
 * Smoothly drifting collaborator cursors layered over a workspace surface.
 * `starts` overrides per-cursor resting positions; `band` constrains where a
 * cursor is allowed to drift (so it can stay near its selection instead of
 * wandering across a co-editor's live-typing line).
 */
export function PresenceCursors({ people = PEOPLE, className, ease = 0.05, band, starts }) {
  const wrapRef = useRef(null);
  const nodeRefs = useRef([]);

  const startFor = (i) => starts?.[i] ?? startPos(i);

  // Content-based keys so the rAF loop is set up once and is NOT rebuilt on
  // every parent re-render. Callers often pass inline `people`/`band`/`starts`
  // (new object identity each render); a neighbouring co-editor that re-renders
  // ~20x/second while typing would otherwise reset this cursor to its start
  // position on every keystroke.
  const peopleKey = people.map((p) => p.name).join("|");
  const bandKey = band ? `${(band.x || []).join(",")}/${(band.y || []).join(",")}` : "";
  const startsKey = starts ? starts.map((s) => `${s.x},${s.y}`).join("|") : "";

  useEffect(() => {
    const nodes = nodeRefs.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const BX = band?.x ?? DEFAULT_BAND.x;
    const BY = band?.y ?? DEFAULT_BAND.y;

    // Normalized state per cursor (0..1 within the wrapper). Seeded from the
    // SAME resting positions used for the initial render, so there is no
    // top-left "(0,0) flash" before the first animation frame paints.
    const st = people.map((_, i) => {
      const p = startFor(i);
      return { x: p.x, y: p.y, tx: p.x, ty: p.y, hold: 0, seed: i * 13 + 3 };
    });
    // Position via left/top percentages — no layout measurement needed, so the
    // first paint is already correct even before the wrapper has a measured size.
    const paint = (s, i) => {
      const n = nodes[i];
      if (n) {
        n.style.left = `${(s.x * 100).toFixed(2)}%`;
        n.style.top = `${(s.y * 100).toFixed(2)}%`;
      }
    };
    const retarget = (s, i) => {
      s.seed += 1;
      // Sample a target inside the (caller-controllable) band.
      s.tx = BX[0] + rnd(s.seed * 2.3 + i) * (BX[1] - BX[0]);
      s.ty = BY[0] + rnd(s.seed * 3.7 + i * 2) * (BY[1] - BY[0]);
      s.hold = 70 + Math.floor(rnd(s.seed * 1.7) * 110); // frames before next move
    };

    st.forEach(paint);
    if (reduce) return; // static placement, no motion

    let raf = 0;
    let visible = true;
    const wrap = wrapRef.current;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
    if (wrap) io.observe(wrap);

    const frame = () => {
      if (visible) {
        st.forEach((s, i) => {
          s.hold -= 1;
          if (s.hold <= 0) retarget(s, i);
          s.x += (s.tx - s.x) * ease;
          s.y += (s.ty - s.y) * ease;
          paint(s, i);
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peopleKey, ease, bandKey, startsKey]);

  return (
    <div ref={wrapRef} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {people.map((p, i) => {
        const p0 = startFor(i);
        return (
          <div
            key={p.name}
            ref={(el) => (nodeRefs.current[i] = el)}
            className="absolute flex items-start will-change-[left,top]"
            style={{ left: `${p0.x * 100}%`, top: `${p0.y * 100}%` }}
          >
            <CursorGlyph name={p.name} color={p.color} />
          </div>
        );
      })}
    </div>
  );
}

/** Overlapping avatar chips with a live presence dot. */
export function AvatarStack({ people = PEOPLE, size = 22, live = true, className }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center -space-x-1.5">
        {people.map((p) => (
          <span
            key={p.name}
            title={p.name}
            className="inline-flex items-center justify-center rounded-full border-2 font-mono text-[9px] font-semibold text-white"
            style={{ width: size, height: size, background: p.color, borderColor: "var(--color-panel)" }}
          >
            {p.initials}
          </span>
        ))}
      </div>
      {live && (
        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ink-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-ok presence-pulse" style={{ boxShadow: "0 0 6px #46e0a0" }} />
          {people.length} here
        </span>
      )}
    </div>
  );
}
