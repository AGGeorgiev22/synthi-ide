"use client";

import {
  WindowFrame,
  FileTree,
  CodeEditor,
  AnimatedTerminal,
  DiffPreview,
  RuntimeAgentPanel,
  PreviewPane,
  StatusPill,
  C,
} from "@/components/workspace/parts";
import { PresenceCursors, AvatarStack } from "@/components/workspace/presence";
import { cn } from "@/lib/utils";

/* ---- static content (Rust runtime project) ---- */
const TERMINAL = [
  { tone: "cmd", text: "vectant run dev" },
  { tone: "info", text: "runtime · session attached · observing" },
  { tone: "warn", text: "agent · predicted: borrow of moved value · session.rs:8" },
  { tone: "err", text: "error[E0382] · borrow of moved value: rt · session.rs:8" },
  { tone: "info", text: "agent · patch applied in place · no rebuild" },
  { tone: "ok", text: "✓ runtime patched · state preserved" },
  { tone: "ok", text: "✓ test result: ok · 24 passed · 0 failed" },
  { tone: "ok", text: "✓ preview live · never dropped" },
];

const AGENT = [
  { kind: "signal", text: "Watching the live session - logs, tests, and preview." },
  { kind: "trace", text: "Predicted before it ran: borrow of moved value at session.rs:8." },
  { kind: "warn", text: "Reproduced the failure against the running program." },
  { kind: "patch", text: "Patched in place - cloned the handle for the dispose closure. No rebuild." },
  { kind: "ok", text: "Tests 24/24 · state preserved · preview never dropped." },
  { kind: "ok", text: "Fix verified against the runtime." },
];

const CODE = [
  <>
    <C k="kw">use</C> <C k="prop">vectant_runtime</C>::{"{ "}
    <C k="type">Runtime</C>, <C k="type">Session</C>
    {" };"}
  </>,
  <span> </span>,
  <>
    <C k="kw">pub</C> <C k="kw">async</C> <C k="kw">fn</C> <C k="fn">create_session</C>(
    <C k="prop">opts</C>: <C k="type">Opts</C>) -&gt; <C k="type">Session</C> {"{"}
  </>,
  <>
    {"    "}
    <C k="kw">let</C> rt = <C k="type">Runtime</C>::<C k="fn">attach</C>(<C k="prop">opts</C>).
    <C k="kw">await</C>;
  </>,
  <>
    {"    "}rt.<C k="fn">on_crash</C>(|<C k="prop">e</C>| <C k="fn">report</C>(<C k="prop">e</C>));
  </>,
  <span> </span>,
  <>
    {"    "}
    <C k="type">Session</C> {"{"}
  </>,
  <>
    {"        "}
    <C k="prop">dispose</C>: <C k="kw">move</C> || rt.<C k="fn">teardown</C>(),
  </>,
  <>
    {"        "}
    <C k="prop">signals</C>: rt.<C k="fn">observe</C>(),
  </>,
  <>{"    }"}</>,
  <>{"}"}</>,
];

const DIFF = [
  { type: "ctx", text: "    Session {" },
  { type: "del", text: "        dispose: move || rt.teardown()," },
  { type: "add", text: "        dispose: { let rt = rt.clone(); move || rt.teardown() }," },
  { type: "ctx", text: "        signals: rt.observe()," },
];

const FILES = [
  { name: "Cargo.toml", depth: 0 },
  { name: "src", depth: 0, dir: true },
  { name: "runtime", depth: 1, dir: true },
  { name: "session.rs", depth: 2, active: true },
  { name: "observer.rs", depth: 2 },
  { name: "app", depth: 1, dir: true },
  { name: "main.rs", depth: 2 },
  { name: "kernels", depth: 0, dir: true },
  { name: "sched.cu", depth: 1 },
];

/* ---- step machine ---- */
const STEPS = [
  { term: 1, agent: 0, build: ["run", "building"], test: ["idle", "tests"], gpu: ["idle", "gpu idle"], diff: false, preview: "live", err: null, active: null, fileMark: null, verified: false, working: false },
  { term: 2, agent: 0, build: ["run", "building"], test: ["idle", "tests"], gpu: ["idle", "gpu idle"], diff: false, preview: "live", err: null, active: null, fileMark: null, verified: false, working: false },
  { term: 3, agent: 0, build: ["run", "building"], test: ["idle", "tests"], gpu: ["idle", "gpu idle"], diff: false, preview: "live", err: null, active: null, fileMark: null, verified: false, working: false },
  { term: 4, agent: 0, build: ["err", "build failed"], test: ["idle", "tests"], gpu: ["idle", "gpu idle"], diff: false, preview: "live", err: 8, active: null, fileMark: "error", verified: false, working: false },
  { term: 4, agent: 2, build: ["err", "build failed"], test: ["idle", "tests"], gpu: ["run", "loop instant"], diff: false, preview: "live", err: 8, active: null, fileMark: "error", verified: false, working: true },
  { term: 5, agent: 3, build: ["err", "build failed"], test: ["idle", "tests"], gpu: ["ok", "loop instant"], diff: false, preview: "live", err: 8, active: 8, fileMark: "error", verified: false, working: true },
  { term: 6, agent: 4, build: ["err", "build failed"], test: ["idle", "tests"], gpu: ["ok", "loop instant"], diff: true, preview: "live", err: null, active: 8, fileMark: "changed", verified: false, working: true },
  { term: 7, agent: 4, build: ["ok", "build passing"], test: ["ok", "24 passed"], gpu: ["ok", "loop instant"], diff: true, preview: "live", err: null, active: 8, fileMark: "changed", verified: false, working: true },
  { term: 8, agent: 5, build: ["ok", "build passing"], test: ["ok", "24 passed"], gpu: ["ok", "loop instant"], diff: true, preview: "updated", err: null, active: 8, fileMark: "changed", verified: false, working: true },
  { term: 8, agent: 6, build: ["ok", "build passing"], test: ["ok", "24 passed"], gpu: ["ok", "loop instant"], diff: true, preview: "updated", err: null, active: 8, fileMark: "changed", verified: true, working: false },
];

export const HERO_STEP_COUNT = STEPS.length;

export function HeroWorkspaceMockup({ step = HERO_STEP_COUNT - 1, className }) {
  const s = STEPS[Math.min(step, STEPS.length - 1)];
  const files = FILES.map((f) =>
    f.name === "session.rs" ? { ...f, mark: s.fileMark } : f
  );

  const pills = (
    <>
      <StatusPill tone={s.build[0]} pulse>{s.build[1]}</StatusPill>
      <StatusPill tone={s.test[0]}>{s.test[1]}</StatusPill>
      <StatusPill tone={s.gpu[0]} pulse>{s.gpu[1]}</StatusPill>
    </>
  );

  return (
    <WindowFrame
      title="vectant"
      path="runtime/session.rs"
      pills={pills}
      topRight={<AvatarStack />}
      glow
      sweep
      className={className}
    >
      {/* top: tree | editor | agent */}
      <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] lg:grid-cols-[150px_1fr_248px]">
        <div className="hidden border-r border-line md:block">
          <FileTree files={files} />
        </div>

        <div className="relative min-w-0 border-line md:border-r">
          <CodeEditor lines={CODE} activeLine={s.active} errorLine={s.err} caret />
          {/* two collaborators sharing the live workspace */}
          <PresenceCursors />
          {/* floating inline diff */}
          <div
            className={cn(
              "pointer-events-none absolute bottom-3 left-3 right-3 z-10 transition-all duration-500",
              s.diff ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            )}
          >
            <div className="pointer-events-auto shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)]">
              <DiffPreview file="src/runtime/session.rs" hunks={DIFF} open={s.diff} />
            </div>
          </div>
        </div>

        <div className="hidden border-t border-line lg:block lg:border-t-0">
          <RuntimeAgentPanel messages={AGENT} count={s.agent} working={s.working} />
        </div>
      </div>

      {/* bottom: terminal | preview */}
      <div className="grid grid-cols-1 border-t border-line sm:grid-cols-[1fr_280px]">
        <div className="border-line sm:border-r">
          <AnimatedTerminal lines={TERMINAL} count={s.term} title="runtime · logs" className="h-[150px]" />
        </div>
        <div className="relative hidden h-[150px] sm:block">
          <PreviewPane variant="web" state={s.preview} className="h-full" />
          <div
            className={cn(
              "absolute right-2 top-9 transition-all duration-500",
              s.verified ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
            )}
          >
            <StatusPill tone="ok" icon={<span className="h-1.5 w-1.5 rounded-full bg-ok pulse-ok" />}>
              Fix verified
            </StatusPill>
          </div>
        </div>
      </div>

      {/* mobile agent strip (compact) */}
      <div className="border-t border-line lg:hidden">
        <RuntimeAgentPanel messages={AGENT.slice(0, 3)} count={Math.min(s.agent, 3)} working={s.working} className="max-h-[150px] overflow-hidden" />
      </div>
    </WindowFrame>
  );
}
