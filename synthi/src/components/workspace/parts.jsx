"use client";

import { cn } from "@/lib/utils";
import {
  Folder,
  FileCode2,
  Circle,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Activity,
  Sparkles,
} from "lucide-react";

/* ============================================================
   Token helper — concise hand-authored syntax highlighting.
   <C k="kw">const</C>  ->  <span class="tok-kw">const</span>
   ============================================================ */
export function C({ k, children }) {
  return <span className={`tok-${k}`}>{children}</span>;
}

/* ============================================================
   Status pill — the recurring "Fix verified" / "Build failed" chip.
   tone: idle | run | ok | warn | err | info
   ============================================================ */
const TONE = {
  idle: { dot: "#6c6f78", text: "text-ink-faint", ring: "border-line", bg: "bg-white/[0.03]" },
  run: { dot: "#2dd4ee", text: "text-cyan", ring: "border-cyan/30", bg: "bg-cyan/[0.07]" },
  info: { dot: "#5b9dff", text: "text-blue", ring: "border-blue/30", bg: "bg-blue/[0.07]" },
  ok: { dot: "#46e0a0", text: "text-ok", ring: "border-ok/30", bg: "bg-ok/[0.07]" },
  warn: { dot: "#f5b13d", text: "text-warn", ring: "border-warn/30", bg: "bg-warn/[0.07]" },
  err: { dot: "#ff6b6b", text: "text-err", ring: "border-err/30", bg: "bg-err/[0.07]" },
};

export function StatusPill({ tone = "idle", children, pulse = false, icon, className }) {
  const t = TONE[tone] || TONE.idle;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none tracking-tight transition-colors duration-300",
        t.ring,
        t.bg,
        t.text,
        className
      )}
    >
      {icon ? (
        icon
      ) : (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", pulse && tone === "run" && "animate-pulse")}
          style={{ background: t.dot, boxShadow: `0 0 6px ${t.dot}` }}
        />
      )}
      {children}
    </span>
  );
}

/* ============================================================
   Window frame — IDE chrome with traffic lights, breadcrumb, pills.
   ============================================================ */
export function WindowFrame({ title = "vectant", path, pills, topRight, children, className, glow = false, sweep = false }) {
  return (
    <div className={cn("relative surface-dark", className)}>
      {glow && (
        <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 accent-glow blur-2xl opacity-60" />
      )}
      <div className={cn("relative overflow-hidden rounded-2xl border border-line-2 bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]", sweep && "scan-sweep")}>
        {/* title bar */}
        <div className="flex items-center gap-3 border-b border-line bg-bg-2/80 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="ml-1 flex min-w-0 items-center gap-2 font-mono text-[11px] text-ink-faint">
            <span className="text-ink-dim">{title}</span>
            {path && (
              <>
                <span className="text-ink-faint/50">/</span>
                <span className="truncate text-ink-dim">{path}</span>
              </>
            )}
          </div>
          {pills && <div className="ml-auto hidden items-center gap-2 sm:flex">{pills}</div>}
          {topRight && <div className={cn("flex items-center", pills ? "ml-3" : "ml-auto")}>{topRight}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   File tree
   files: [{ name, depth, dir, active, mark }]   mark: 'changed'|'error'|null
   ============================================================ */
export function FileTree({ files, className }) {
  return (
    <div className={cn("select-none py-2 font-mono text-[12px] text-ink-dim", className)}>
      {files.map((f, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-2 px-3 py-[5px] transition-colors duration-300",
            f.active ? "bg-cyan/[0.08] text-ink" : "hover:bg-white/[0.02]"
          )}
          style={{ paddingLeft: 12 + f.depth * 14 }}
        >
          {f.active && <span className="absolute left-0 h-4 w-[2px] -translate-x-3 bg-cyan" />}
          {f.dir ? (
            <Folder size={13} className="shrink-0 text-ink-faint" />
          ) : (
            <FileCode2 size={13} className={cn("shrink-0", f.active ? "text-cyan" : "text-ink-faint")} />
          )}
          <span className="truncate">{f.name}</span>
          {f.mark === "changed" && (
            <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" title="modified" />
          )}
          {f.mark === "error" && (
            <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-err" title="error" />
          )}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Code editor — line numbers, token spans, active-line highlight.
   lines: array of React nodes (one per line)
   activeLine: 1-based index to highlight   errorLine: 1-based -> red
   ============================================================ */
export function CodeEditor({ lines, activeLine, errorLine, caret = false, className }) {
  return (
    <div className={cn("overflow-x-auto py-3 font-mono text-[12.5px] leading-[1.65]", className)}>
      <pre className="min-w-max">
        {lines.map((line, i) => {
          const n = i + 1;
          const isActive = n === activeLine;
          const isError = n === errorLine;
          return (
            <div
              key={i}
              className={cn(
                "flex px-4 transition-colors duration-500",
                isActive && "bg-cyan/[0.06]",
                isError && "bg-err/[0.08]"
              )}
            >
              <span
                className={cn(
                  "mr-4 inline-block w-6 shrink-0 select-none text-right",
                  isError ? "text-err/80" : "text-ink-faint/45"
                )}
              >
                {n}
              </span>
              <span className="text-prop">
                {line}
                {caret && isActive && <span className="caret align-middle" />}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

/* ============================================================
   Animated terminal — reveals `count` of `lines`.
   lines: [{ text, tone, prefix }]  tone: dim|ok|err|warn|info|cmd
   ============================================================ */
const LOG_TONE = {
  dim: "text-ink-faint",
  cmd: "text-ink",
  info: "text-blue",
  ok: "text-ok",
  warn: "text-warn",
  err: "text-err",
};

export function AnimatedTerminal({ lines, count = lines.length, title = "logs", className, showCaret = true }) {
  const shown = lines.slice(0, count);
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-1.5">
        <Activity size={12} className="text-ink-faint" />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">{title}</span>
      </div>
      <div className="flex-1 overflow-hidden px-3 py-2 font-mono text-[11.5px] leading-[1.7]">
        {shown.map((l, i) => (
          <div key={i} className={cn("stream-in flex gap-2", LOG_TONE[l.tone] || LOG_TONE.dim)}>
            <span className="select-none text-ink-faint/50">
              {l.prefix ?? (l.tone === "cmd" ? "›" : "·")}
            </span>
            <span className="whitespace-pre-wrap break-words">{l.text}</span>
          </div>
        ))}
        {showCaret && count > 0 && count >= lines.length && (
          <div className="flex gap-2 text-ink">
            <span className="select-none text-ink-faint/50">›</span>
            <span className="caret" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Diff preview — unified diff with +/- gutter, reveals when `open`.
   hunks: [{ type:'ctx'|'add'|'del', text }]
   ============================================================ */
export function DiffPreview({ file = "src/runtime/session.rs", hunks, open = true, className }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-line bg-bg-2/70 transition-all duration-500",
        open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 border-transparent",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-line px-3 py-1.5">
        <span className="font-mono text-[10.5px] text-ink-faint">{file}</span>
        <span className="ml-auto font-mono text-[10.5px] text-ok">+{hunks.filter((h) => h.type === "add").length}</span>
        <span className="font-mono text-[10.5px] text-err">−{hunks.filter((h) => h.type === "del").length}</span>
      </div>
      <div className="py-1.5 font-mono text-[11.5px] leading-[1.7]">
        {hunks.map((h, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2 px-3",
              h.type === "add" && "bg-ok/[0.08] text-ok",
              h.type === "del" && "bg-err/[0.08] text-err",
              h.type === "ctx" && "text-ink-faint"
            )}
          >
            <span className="w-3 select-none text-center opacity-70">
              {h.type === "add" ? "+" : h.type === "del" ? "−" : " "}
            </span>
            <span className="whitespace-pre-wrap break-words">{h.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Runtime agent panel — message stream + state.
   messages: [{ kind, text }]  kind: signal|trace|warn|patch|ok|think
   ============================================================ */
const MSG = {
  signal: { tone: "info", Icon: Activity, label: "runtime" },
  trace: { tone: "warn", Icon: AlertTriangle, label: "trace" },
  warn: { tone: "warn", Icon: AlertTriangle, label: "warn" },
  think: { tone: "run", Icon: Loader2, label: "agent" },
  patch: { tone: "run", Icon: Sparkles, label: "patch" },
  ok: { tone: "ok", Icon: CheckCircle2, label: "verify" },
};

export function RuntimeAgentPanel({ messages, count = messages.length, className, working = false }) {
  const shown = messages.slice(0, count);
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span className="relative flex h-2 w-2">
          <span className={cn("absolute inline-flex h-full w-full rounded-full bg-cyan/70", working && "animate-ping")} />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-dim">Agent</span>
        <span className="ml-auto font-mono text-[10px] text-ink-faint">runtime-native</span>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden px-3 py-3">
        {shown.map((m, i) => {
          const cfg = MSG[m.kind] || MSG.signal;
          const t = TONE[cfg.tone];
          const Icon = cfg.Icon;
          const last = i === shown.length - 1;
          return (
            <div key={i} className="stream-in flex items-start gap-2.5">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
                style={{ borderColor: `${t.dot}40`, background: `${t.dot}14`, color: t.dot }}
              >
                <Icon size={11} className={cfg.tone === "run" && last && working ? "animate-spin" : ""} />
              </span>
              <div className="min-w-0">
                <div className="font-mono text-[9.5px] uppercase tracking-wider" style={{ color: t.dot }}>
                  {cfg.label}
                </div>
                <div className="text-[12.5px] leading-snug text-ink-dim">{m.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   Preview pane — a small "running app". variant switches the scene.
   variant: web | cuda | rocm | engine
   ============================================================ */
export function PreviewPane({ variant = "web", state = "live", className }) {
  return (
    <div className={cn("relative flex flex-col overflow-hidden", className)}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-1.5">
        <Circle size={8} className={state === "error" ? "fill-err text-err" : "fill-ok text-ok"} />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Preview</span>
        <span className="ml-auto font-mono text-[10px] text-ink-faint">localhost:5173</span>
      </div>
      <div className="relative flex-1 bg-[#0b0c10]">
        {variant === "web" && <WebScene state={state} />}
        {variant === "cuda" && <GpuScene tone="#46e0a0" label="CUDA" state={state} />}
        {variant === "rocm" && <GpuScene tone="#ff6b6b" label="ROCm" state={state} />}
        {variant === "engine" && <EngineScene state={state} />}
      </div>
    </div>
  );
}

function WebScene({ state }) {
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan/70 to-violet/70" />
        <div className="space-y-1.5">
          <div className="h-2 w-24 rounded bg-white/15" />
          <div className="h-1.5 w-16 rounded bg-white/8" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-line bg-white/[0.02] p-2">
            <div className="mb-2 h-1.5 w-8 rounded bg-cyan/40" />
            <div
              className="font-mono text-[14px] font-semibold text-ink transition-all duration-500"
              style={{ color: state === "updated" ? "#46e0a0" : undefined }}
            >
              {state === "updated" ? ["128", "+12%", "0"][i] : ["-", "-", "-"][i]}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto h-16 rounded-lg border border-line bg-white/[0.02]">
        <div className="flex h-full items-end gap-1 p-2">
          {[40, 65, 30, 80, 55, 70, 45, 90, 60].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-cyan/30 to-cyan/70 transition-all duration-700"
              style={{ height: state === "updated" ? `${h}%` : "12%" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GpuScene({ tone, label, state }) {
  const cols = 12;
  const rows = 7;
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] text-ink-faint">device · {label}</span>
        <span className="font-mono text-[10px]" style={{ color: state === "error" ? "#ff6b6b" : tone }}>
          {state === "error" ? "kernel fault" : "grid 256×256"}
        </span>
      </div>
      <div
        className="grid flex-1 gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => {
          const heat = (Math.sin(i * 1.3) + Math.cos(i * 0.7) + 2) / 4;
          const faulted = state === "error" && i % 17 === 3;
          return (
            <div
              key={i}
              className="rounded-[2px] transition-colors duration-700"
              style={{
                background: faulted
                  ? "#ff6b6b"
                  : `${tone}${Math.round(heat * 80 + 12).toString(16).padStart(2, "0")}`,
              }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-3 font-mono text-[10px] text-ink-faint">
        <span>occupancy 71%</span>
        <span>·</span>
        <span>{state === "error" ? "12.4 ms ⚠" : "3.1 ms"}</span>
      </div>
    </div>
  );
}

function EngineScene({ state }) {
  return (
    <div className="relative h-full overflow-hidden p-0">
      {/* faux 3D viewport */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 30% 0%, rgba(91,157,255,0.16), transparent 55%), radial-gradient(100% 120% at 80% 100%, rgba(139,123,255,0.16), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          transform: "perspective(420px) rotateX(58deg) translateY(22%) scale(1.6)",
          transformOrigin: "center 60%",
        }}
      />
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        <div
          className={cn("h-16 w-16 rotate-45 rounded-lg border border-cyan/40 bg-gradient-to-br from-cyan/30 to-violet/30 transition-transform duration-700", state === "updated" && "scale-110")}
          style={{ boxShadow: "0 0 40px rgba(45,212,238,0.25)" }}
        />
      </div>
      <div className="absolute bottom-2 left-3 flex items-center gap-3 font-mono text-[10px] text-ink-faint">
        <span className="flex items-center gap-1">
          <Cpu size={10} /> {state === "updated" ? "16.6 ms" : "16.7 ms"}
        </span>
        <span>·</span>
        <span style={{ color: "#46e0a0" }}>60 fps</span>
      </div>
    </div>
  );
}
