"use client";

import { SectionHeading } from "@/components/Section";
import {
  WindowFrame,
  AnimatedTerminal,
  PreviewPane,
  StatusPill,
} from "@/components/workspace/parts";
import { useScrollProgress, useReducedMotion } from "@/components/lib/useMotion";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  {
    key: "cpu",
    label: "CPU project",
    sub: "Code changes apply with hot reload. The preview updates instantly while state is preserved.",
    variant: "web",
    path: "app/render.rs",
    device: "native · cpu",
    logs: [
      { tone: "cmd", text: "vectant run dev" },
      { tone: "info", text: "hot-reload · patch applied to render.rs" },
      { tone: "ok", text: "✓ preview updated · instant · state preserved" },
    ],
  },
  {
    key: "cuda",
    label: "CUDA project",
    sub: "The kernel rebuilds instantly, compile output appears, and the error is traced to its source.",
    variant: "cuda",
    path: "kernels/sched.cu",
    device: "cuda · sm_90",
    logs: [
      { tone: "cmd", text: "nvcc · rebuilding sched.cu · instant" },
      { tone: "warn", text: "ptxas warning · register spill, 64B" },
      { tone: "err", text: "✗ compile error · sched.cu:88" },
    ],
  },
  {
    key: "rocm",
    label: "ROCm project",
    sub: "A runtime failure is captured in the loop and the agent identifies the likely cause.",
    variant: "rocm",
    path: "kernels/reduce.hip",
    device: "rocm · gfx",
    logs: [
      { tone: "cmd", text: "hipcc · running reduce.hip" },
      { tone: "err", text: "✗ runtime failure · invalid access" },
      { tone: "info", text: "agent · likely cause: unguarded tile index" },
    ],
  },
  {
    key: "engine",
    label: "Game engine project",
    sub: "The viewport stays alive while engine logic updates and runtime stats change.",
    variant: "engine",
    path: "engine/systems.rs",
    device: "engine · 60 fps",
    logs: [
      { tone: "cmd", text: "engine · hot-reload systems" },
      { tone: "info", text: "scene graph patched · no restart" },
      { tone: "ok", text: "✓ viewport updated · 60 fps" },
    ],
  },
  {
    key: "verify",
    label: "Agent verification",
    sub: "A patch is generated, tests pass, and the runtime updates. The fix is verified.",
    variant: "web",
    path: "src/runtime/session.rs",
    device: "ci · runtime",
    logs: [
      { tone: "info", text: "agent · patch generated" },
      { tone: "ok", text: "✓ tests 24/24 passed in 1.18s" },
      { tone: "ok", text: "✓ runtime updated · fix verified" },
    ],
  },
];

function chapterPills(key, local) {
  switch (key) {
    case "cpu":
      return [
        ["build", "ok", "build passing"],
        ["hmr", local > 0.5 ? "ok" : "run", local > 0.5 ? "HMR applied" : "editing"],
      ];
    case "cuda":
      return [
        ["build", local > 0.55 ? "err" : "run", local > 0.55 ? "compile error" : "building"],
        ["gpu", local > 0.3 ? "warn" : "idle", "cuda · sm_90"],
      ];
    case "rocm":
      return [
        ["run", local > 0.4 ? "err" : "run", local > 0.4 ? "runtime fault" : "running"],
        ["gpu", local > 0.6 ? "info" : "warn", local > 0.6 ? "cause identified" : "rocm · gfx"],
      ];
    case "engine":
      return [
        ["view", "run", "viewport live"],
        ["scene", local > 0.5 ? "ok" : "idle", local > 0.5 ? "scene updated" : "iterating"],
      ];
    case "verify":
      return [
        ["test", local > 0.4 ? "ok" : "run", local > 0.4 ? "tests 24/24" : "testing"],
        ["fix", local > 0.7 ? "ok" : "run", local > 0.7 ? "fix verified" : "verifying"],
      ];
    default:
      return [];
  }
}

function chapterAgent(key, local) {
  if (local < 0.55) return null;
  const map = {
    cpu: { kind: "ok", text: "Change applied with state preserved." },
    cuda: { kind: "trace", text: "Compile error traced to sched.cu:88." },
    rocm: { kind: "trace", text: "Likely cause: unguarded tile index — add a bounds check." },
    engine: { kind: "ok", text: "Engine logic updated without restarting the world." },
    verify: { kind: "ok", text: "Fix verified against the runtime." },
  };
  return map[key];
}

export function ScrollProductStory() {
  const reduced = useReducedMotion();
  const [ref, progress] = useScrollProgress();
  const n = CHAPTERS.length;

  const raw = progress * n;
  const idx = Math.min(n - 1, Math.max(0, Math.floor(raw)));
  const local = Math.min(1, Math.max(0, raw - idx));
  const ch = CHAPTERS[idx];

  const logCount = reduced ? ch.logs.length : Math.max(1, Math.ceil((local + 0.05) * ch.logs.length));
  const pills = chapterPills(ch.key, reduced ? 1 : local);
  const agent = chapterAgent(ch.key, reduced ? 1 : local);
  const previewState = (() => {
    if (reduced) return ch.key === "cuda" ? "error" : ch.key === "rocm" ? "error" : "updated";
    if (ch.key === "cuda") return local > 0.55 ? "error" : "live";
    if (ch.key === "rocm") return local > 0.4 ? "error" : "live";
    if (ch.key === "cpu" || ch.key === "engine" || ch.key === "verify") return local > 0.5 ? "updated" : "live";
    return "live";
  })();

  return (
    <section className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="One living product"
          align="center"
          title="Five execution loops. One workspace."
          subtitle="Scroll through the same Vectant workspace as it moves across CPU, CUDA, ROCm, game engine, and verification — driven by real runtime signals, not screenshots."
        />
      </div>

      {/* tall driver */}
      <div ref={ref} className="relative mt-10" style={{ height: `${n * 90}vh` }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="grid items-center gap-8 lg:grid-cols-[280px_1fr]">
              {/* narrative rail */}
              <div className="order-2 lg:order-1">
                {/* desktop list */}
                <ol className="hidden space-y-1 lg:block">
                  {CHAPTERS.map((c, i) => {
                    const activeRow = i === idx;
                    return (
                      <li key={c.key}>
                        <div
                          className={cn(
                            "rounded-xl border px-4 py-3 transition-all duration-300",
                            activeRow ? "border-line-2 bg-white/[0.03]" : "border-transparent opacity-50"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "font-mono text-[11px]",
                                activeRow ? "text-cyan" : "text-ink-faint"
                              )}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className={cn("text-[14px] font-medium", activeRow ? "text-ink" : "text-ink-dim")}>
                              {c.label}
                            </span>
                          </div>
                          {activeRow && (
                            <>
                              <p className="mt-1.5 text-[12.5px] leading-snug text-ink-dim">{c.sub}</p>
                              <div className="mt-2.5 h-[2px] w-full overflow-hidden rounded-full bg-white/8">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-cyan to-violet"
                                  style={{ width: `${(reduced ? 1 : local) * 100}%` }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/* mobile stepper */}
                <div className="lg:hidden">
                  <div className="flex items-center gap-1.5">
                    {CHAPTERS.map((c, i) => (
                      <span
                        key={c.key}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors duration-300",
                          i < idx ? "bg-cyan/60" : i === idx ? "bg-cyan" : "bg-white/10"
                        )}
                      />
                    ))}
                  </div>
                  <div className="mt-3">
                    <span className="font-mono text-[11px] text-cyan">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="ml-2 text-[15px] font-medium text-ink">{ch.label}</span>
                    <p className="mt-1 text-[13px] leading-snug text-ink-dim">{ch.sub}</p>
                  </div>
                </div>
              </div>

              {/* workspace */}
              <div className="order-1 lg:order-2">
                <WindowFrame
                  title="vectant"
                  path={ch.path}
                  pills={pills.map(([k, tone, label]) => (
                    <StatusPill key={k} tone={tone} pulse>
                      {label}
                    </StatusPill>
                  ))}
                  glow
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_300px]">
                    <div className="border-b border-line md:border-b-0 md:border-r">
                      <AnimatedTerminal
                        lines={ch.logs}
                        count={logCount}
                        title={`${ch.device} · logs`}
                        className="h-[190px] sm:h-[230px]"
                        showCaret={false}
                      />
                    </div>
                    <PreviewPane variant={ch.variant} state={previewState} className="h-[190px] sm:h-[230px]" />
                  </div>
                  <div className="flex min-h-[52px] items-center gap-2.5 border-t border-line px-3 py-2.5">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan/60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
                    </span>
                    <span className="font-mono text-[9.5px] uppercase tracking-wider text-ink-faint">agent</span>
                    <span
                      key={agent ? agent.text : "idle"}
                      className="stream-in text-[12.5px] leading-snug text-ink-dim"
                    >
                      {agent ? agent.text : "Observing runtime signals…"}
                    </span>
                  </div>
                </WindowFrame>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
