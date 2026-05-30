"use client";

import { GitPullRequest, KeyRound, FolderLock, ScrollText, ShieldCheck, Check } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Section";

const CONTROLS = [
  { icon: GitPullRequest, label: "Review patches before merge", note: "Nothing lands without your approval." },
  { icon: KeyRound, label: "Permissioned agent actions", note: "Scope what the agent is allowed to do." },
  { icon: FolderLock, label: "Project-scoped runtime access", note: "Access stays inside the project boundary." },
  { icon: ScrollText, label: "Audit trail for agent changes", note: "Every change is attributable and reviewable." },
  { icon: ShieldCheck, label: "Safe defaults for execution", note: "Workspaces run with conservative defaults." },
];

const POLICY = [
  ["Require review before merge", "on"],
  ["Agent actions", "permissioned"],
  ["Runtime access", "project-scoped"],
  ["Audit trail", "on"],
  ["Workspace execution", "safe defaults"],
];

const AUDIT = [
  "patch · session.rs · reviewed by you · merged",
  "runtime · read logs · scope: project",
  "test run · 24 passed · triggered by agent",
];

export function SecuritySection() {
  return (
    <section id="security" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* left */}
          <div>
            <SectionHeading
              eyebrow="Security & control"
              title="Autonomous does not mean uncontrolled."
              subtitle="Vectant should help developers move faster without hiding what changed or why. You stay in the loop with review, scoped permissions, and a complete audit trail."
            />
            <ul className="mt-9 space-y-5">
              {CONTROLS.map((c, i) => {
                const Icon = c.icon;
                return (
                  <Reveal as="li" key={c.label} delay={i * 60} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-cyan">
                      <Icon size={16} />
                    </span>
                    <div>
                      <div className="text-[14.5px] font-medium text-ink">{c.label}</div>
                      <div className="mt-0.5 text-[13px] text-ink-faint">{c.note}</div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
            <p className="mt-9 max-w-md text-[12.5px] leading-relaxed text-ink-faint">
              Team and enterprise controls expand as the platform matures. We don&apos;t claim
              compliance certifications we don&apos;t hold.
            </p>
          </div>

          {/* right: policy panel */}
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-2xl border border-line-2 bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
              <div className="flex items-center gap-2 border-b border-line bg-bg-2/80 px-4 py-2.5">
                <ShieldCheck size={14} className="text-cyan" />
                <span className="font-mono text-[11px] text-ink-dim">workspace · policy</span>
                <span className="ml-auto rounded-full border border-ok/30 bg-ok/[0.08] px-2 py-0.5 font-mono text-[10px] text-ok">
                  enforced
                </span>
              </div>
              <div className="divide-y divide-line">
                {POLICY.map(([k, v]) => (
                  <div key={k} className="flex items-center gap-3 px-4 py-3.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md border border-ok/30 bg-ok/10">
                      <Check size={12} className="text-ok" strokeWidth={2.5} />
                    </span>
                    <span className="text-[13.5px] text-ink">{k}</span>
                    <span className="ml-auto font-mono text-[11.5px] text-cyan">{v}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-line bg-bg-2/50 px-4 py-3">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  audit trail
                </div>
                <div className="space-y-1.5 font-mono text-[11px] leading-relaxed text-ink-dim">
                  {AUDIT.map((a, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-ink-faint/60">·</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

