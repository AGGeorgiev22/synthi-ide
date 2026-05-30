"use client";

import { useEffect, useState } from "react";
import { MousePointer2, Users, GitBranch, Radio } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/Section";
import { WindowFrame, StatusPill } from "@/components/workspace/parts";
import { AvatarStack, PEOPLE } from "@/components/workspace/presence";
import { useActive, useReducedMotion } from "@/components/lib/useMotion";

const MIRA = PEOPLE[0];
const DEVON = PEOPLE[1];

const FEATURES = [
  { Icon: MousePointer2, label: "Live cursors", note: "See exactly where everyone is, in real time." },
  { Icon: GitBranch, label: "Shared runtime", note: "One running program, same logs, same state." },
  { Icon: Radio, label: "Join the agent session", note: "Watch or take over the agent's loop together." },
];

const ACTIVITY = [
  { who: "Devon", color: DEVON.color, text: "is typing in session.rs" },
  { who: "Mira", color: MIRA.color, text: "is editing session.rs" },
  { who: "agent", color: "#2dd4ee", text: "is watching the run" },
];

// Two collaborators co-editing the same file. Each line types live, looping
// grow -> hold -> trim -> hold, so it reads as real-time pair programming.
const MIRA_LINE = "let rt = Runtime::shared(cfg);";
const MIRA_BASE = "let rt = ".length;
const DEVON_LINE = "rt.observe().broadcast();";
const DEVON_BASE = "rt.observe()".length;

/** Looping live-typing length for one collaborator's line. */
function useTypeLoop(full, base, { active, reduced, startDelay, growMs, trimMs }) {
  const [len, setLen] = useState(reduced ? full.length : base);
  useEffect(() => {
    if (reduced || !active) {
      setLen(full.length);
      return;
    }
    let current = base;
    let target = full.length;
    let timer;
    const step = () => {
      if (current === target) {
        const holdMs = target === full.length ? 1700 : 650;
        target = target === full.length ? base : full.length;
        timer = setTimeout(step, holdMs);
        return;
      }
      current += current < target ? 1 : -1;
      setLen(current);
      timer = setTimeout(step, current > target ? trimMs : growMs);
    };
    timer = setTimeout(step, startDelay);
    return () => clearTimeout(timer);
  }, [full, base, active, reduced, startDelay, growMs, trimMs]);
  return len;
}

/** One live-typed editor line: tinted, left-barred, with a caret + name tag. */
function TypedLine({ n, indent = "    ", text, color, name }) {
  return (
    <div className="flex" style={{ background: `${color}12`, boxShadow: `inset 2px 0 0 0 ${color}` }}>
      <span className="mr-4 w-5 shrink-0 select-none text-right" style={{ color: `${color}cc` }}>
        {n}
      </span>
      <span className="relative">
        {indent}
        <span className="text-ink">{text}</span>
        <span className="co-caret" style={{ background: color }} />
        <span
          className="ml-1 inline-block translate-y-[1px] rounded-md px-1.5 py-0.5 align-middle text-[9.5px] font-semibold leading-none text-white"
          style={{ background: color }}
        >
          {name}
        </span>
      </span>
    </div>
  );
}

export function CollaborationSection() {
  const reduced = useReducedMotion();
  const [ref, active] = useActive("0px 0px -20% 0px");
  const [tick, setTick] = useState(0);

  // both type at once, slightly out of sync so it feels like two people
  const mlen = useTypeLoop(MIRA_LINE, MIRA_BASE, { active, reduced, startDelay: 350, growMs: 58, trimMs: 30 });
  const dlen = useTypeLoop(DEVON_LINE, DEVON_BASE, { active, reduced, startDelay: 1100, growMs: 66, trimMs: 34 });

  useEffect(() => {
    if (reduced || !active) return;
    const id = setInterval(() => setTick((t) => (t + 1) % ACTIVITY.length), 2200);
    return () => clearInterval(id);
  }, [reduced, active]);

  const miraTyped = MIRA_LINE.slice(0, mlen);
  const devonTyped = DEVON_LINE.slice(0, dlen);
  const act = ACTIVITY[tick];

  return (
    <section id="collaborate" className="relative scroll-mt-24 border-y border-line bg-bg-2/40 py-20 sm:py-24">
      <div ref={ref} className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* copy */}
          <div>
            <SectionHeading
              eyebrow="Real-time collaboration"
              title={
                <>
                  Two minds, one{" "}
                  <span className="serif-accent text-ink-dim">running workspace.</span>
                </>
              }
              subtitle="Vectant is a shared cloud workspace, not a local checkout. Teammates and agents work in the same live runtime at the same time, with presence you can actually see."
            />
            <ul className="mt-9 space-y-5">
              {FEATURES.map((f, i) => {
                const Icon = f.Icon;
                return (
                  <Reveal as="li" key={f.label} delay={i * 70} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-cyan">
                      <Icon size={16} />
                    </span>
                    <div>
                      <div className="text-[14.5px] font-medium text-ink">{f.label}</div>
                      <div className="mt-0.5 text-[13px] text-ink-faint">{f.note}</div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          {/* live shared workspace - both people co-editing */}
          <Reveal delay={120}>
            <WindowFrame title="vectant" path="runtime/session.rs" topRight={<AvatarStack />} glow>
              <div className="relative">
                <div className="overflow-x-auto py-3 font-mono text-[12.5px] leading-[1.75]">
                  <pre className="min-w-max px-4 text-prop">
                    {/* line 1 */}
                    <div className="flex">
                      <span className="mr-4 w-5 shrink-0 select-none text-right text-ink-faint/45">1</span>
                      <span>
                        <span className="tok-kw">pub</span> <span className="tok-kw">fn</span>{" "}
                        <span className="tok-fn">spawn</span>(<span className="tok-prop">cfg</span>:{" "}
                        <span className="tok-type">Config</span>) -&gt; <span className="tok-type">Session</span> {"{"}
                      </span>
                    </div>
                    {/* line 2 - Mira typing live */}
                    <TypedLine n="2" text={miraTyped} color={MIRA.color} name={MIRA.name} />
                    {/* line 3 - Devon typing live */}
                    <TypedLine n="3" text={devonTyped} color={DEVON.color} name={DEVON.name} />
                    {/* line 4 */}
                    <div className="flex">
                      <span className="mr-4 w-5 shrink-0 select-none text-right text-ink-faint/45">4</span>
                      <span>
                        {"    "}
                        <span className="tok-type">Session</span>::<span className="tok-fn">live</span>(rt)
                      </span>
                    </div>
                    {/* line 5 */}
                    <div className="flex">
                      <span className="mr-4 w-5 shrink-0 select-none text-right text-ink-faint/45">5</span>
                      <span>{"}"}</span>
                    </div>
                  </pre>
                </div>
              </div>

              {/* presence ticker */}
              <div className="flex flex-wrap items-center gap-3 border-t border-line bg-bg-2/60 px-4 py-3">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-dim">
                  <Users size={13} className="text-cyan" /> 2 here + agent
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full presence-pulse" style={{ background: act.color, boxShadow: `0 0 6px ${act.color}` }} />
                  <span style={{ color: act.color }}>{act.who}</span>
                  <span className="text-ink-faint">{act.text}</span>
                </span>
                <StatusPill tone="run" pulse className="ml-auto">
                  shared runtime
                </StatusPill>
              </div>
            </WindowFrame>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

