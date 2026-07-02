import Image from "next/image";

import { AgentOnRamp } from "@/components/AgentOnRamp";
import { HeroProductFloat } from "@/components/HeroProductFloat";
import { VectantMotion } from "@/components/VectantMotion";
import { GpuBeforeAfter } from "@/components/GpuBeforeAfter";
import { GpuLatencyCounter } from "@/components/GpuLatencyCounter";
import { WaitlistForm } from "@/components/WaitlistForm";

const BROWSER_SHOT = {
  title: "Browser workflow observe",
  detail: "The agent sees the running app, browser state, workflow steps, terminal context, and replay surface in one cloud runtime.",
  src: "/product-proof/browser-workflow-observe-ui.png",
  width: 1500,
  height: 1000,
};

const DOJO_SHOT = {
  title: "Workflow observe",
  detail: "A workflow is taught and checked against browser, terminal, replay, and runtime state.",
  src: "/product-proof/browser-workflow-observe-ui.png",
  width: 1500,
  height: 1000,
};

const RUNTIME_WORKFLOW_SHOT = {
  title: "Vectant runtime workflow",
  detail: "Workflows, hosted browser control, replay, terminal context, and proof actions in the Vectant runtime.",
  src: "/product-proof/investor-demo-workflows.png",
  width: 1440,
  height: 1000,
};

const COUNTERFACTUAL_SHOT = {
  title: "Vectant workspace",
  detail: "Live workspace, terminal, browser, and workflow state stay in one reviewable place.",
  src: "/product-proof/investor-demo-workspace.png",
  width: 1440,
  height: 1000,
};

const PROOF_GALLERY = [
  {
    title: "CodeSite radar map",
    detail: "A real CodeSite airspace map showing protected paths, collision zones, leases, and runtime clearance in one proof surface.",
    src: "/codesite-proof/codesite-radar-desktop.png",
    width: 1440,
    height: 1973,
    span: "proof-large proof-tall",
  },
  {
    title: "CodeSite black box",
    detail: "A captured proof packet for agent landings, with replayable state and audit context instead of a loose chat transcript.",
    src: "/codesite-proof/codesite-black-box-desktop.png",
    width: 1440,
    height: 1313,
  },
  {
    title: "CodeSite workflow proof",
    detail: "The full landing workflow: task scope, runtime state, collisions, proof lanes, and handoff evidence in one product capture.",
    src: "/product-proof/senior-real-codesite-workflow-proof.png",
    width: 1440,
    height: 1708,
    span: "proof-large",
  },
  {
    title: "Export handoff",
    detail: "A full Vectant-cleared evidence packet.",
    src: "/product-proof/investor-demo-export-handoff.png",
    width: 1440,
    height: 1000,
    span: "proof-large",
  },
  {
    title: "Line provenance",
    detail: "CodeSite traces the landing back to source-aware evidence so reviewers can inspect what changed and why.",
    src: "/codesite-proof/codesite-line-provenance-desktop.png",
    width: 1440,
    height: 1100,
    span: "proof-wide",
  },
  {
    title: "Counterfactual memory",
    detail: "Near-misses become retained product evidence, not invisible failed branches the next agent has to rediscover.",
    src: "/product-proof/codesite-counterfactual-memory-proof.png",
    width: 1280,
    height: 2296,
    span: "proof-tall",
  },
];

const TOOL_COMPARISON = [
  {
    tool: "Chat-first AI IDEs",
    current: "They are excellent at plausible edits, but the reviewer still has to prove the system survived.",
    vectant: "Vectant gives the agent a running system, scoped authority, preserved state, and a proof packet. The output is a change plus evidence.",
  },
  {
    tool: "Terminal agents",
    current: "They execute quickly, then leave the team reconstructing commands, logs, app state, and intent.",
    vectant: "Vectant keeps commands, ports, browser state, logs, screenshots, HMR, replay, and policy in one reviewable runtime.",
  },
  {
    tool: "Cloud dev boxes",
    current: "They give you a remote machine, but not agent authority, mutation isolation, or replayable trust.",
    vectant: "Vectant turns the box into governed agent infrastructure: VS Code extension paths, MCP eyes and hands, leases, proof gates, and policy.",
  },
  {
    tool: "Browser automation",
    current: "It can replay a recipe, but it does not understand source mutation, leases, conflicts, or production risk.",
    vectant: "Vectant and MCP turn workflows into bounded capabilities that act on real code only after they earn clearance.",
  },
];

const COMPILED_WORKFLOWS = [
  {
    title: "ROCm / HIP proof runs",
    copy: "Compile the sidecar, publish a new epoch, and accept only when device, oracle, and visual proof pass.",
  },
  {
    title: "CUDA-oriented workflows",
    copy: "CUDA teams use the same gated route after hardware-backed validation proves the hot path is safe.",
  },
  {
    title: "Native module boundaries",
    copy: "Find the smallest safe compiled path. Refuse reload when ABI, binding, or state proof is missing.",
  },
  {
    title: "Rendering loops",
    copy: "Before, diff, and after evidence show the output while the ledger records compile, dispatch, and preservation signals.",
  },
];

const GPU_HMR_MARKETS = [
  "ML infrastructure",
  "CUDA / ROCm loops",
  "rendering",
  "simulation",
  "game engines",
  "large C++ / Rust",
];

const COLLABORATION_WEDGES = [
  {
    title: "Workspace access control",
    copy: "Invite the right humans and agents, scope who can see or act inside the workspace, and revoke access without losing the session trail.",
  },
  {
    title: "Low-latency shared presence",
    copy: "Edits, cursors, selections, runtime state, and handoff context move through one shared session.",
  },
  {
    title: "Agent rooms, not agent chaos",
    copy: "Independent agents coordinate routes, claims, conflicts, and handoffs inside the same governed runtime.",
  },
  {
    title: "Humans stay in control",
    copy: "Agents can collaborate, but leases, proof gates, and access policy decide what they can touch.",
  },
];

const RUNTIME_PILLARS = [
  {
    mark: "observe",
    title: "Runtime visibility",
    signal: "screenshots / console / network / source",
    copy: "Vectant exposes screenshots, HMR status, console, network, source, events, and running program state through MCP.",
  },
  {
    mark: "act",
    title: "Guarded action",
    signal: "mouse / keyboard / terminal / editor",
    copy: "Vectant routes browser, keyboard, mouse, terminal, editor, and replay actions through leases and runtime gates.",
  },
  {
    mark: "prove",
    title: "Reviewable proof",
    signal: "ledgers / line provenance / output oracles",
    copy: "Vectant turns proof packets, line provenance, output oracles, and ledgers into review material.",
  },
  {
    mark: "remember",
    title: "Counterfactual memory",
    signal: "near-misses / causal twins / regret traces",
    copy: "Vectant keeps counterfactual traces, regret memory, and causal twins so near-misses improve the next decision.",
  },
];

const DOJO_STEPS = [
  ["Demonstrate", "A human or agent teaches the workflow inside the real workspace."],
  ["Distill", "Vectant extracts source-aware steps, boundaries, selectors, and success evidence."],
  ["Practice", "The rehearsal environment runs checkrides, negative cases, and replay trials before authority expands."],
  ["License", "The runtime grants a narrow, proof-carrying capability that can expire, be revoked, and be re-tested."],
];

const TRUST_SYSTEMS = [
  {
    code: "clearance",
    title: "Vectant Clearance",
    line: "Serializable isolation for AI-generated code changes.",
    copy: "Vectant makes agents request mutation scope, receive MutationLeases, avoid protected paths, pass inspections, and leave a replay ledger.",
  },
  {
    code: "license",
    title: "Vectant Licenses",
    line: "Teach a workflow once, then make it earn production authority.",
    copy: "Vectant turns demonstrations into source-aware skills that rehearse, pass checkrides, and ship as bounded licenses.",
  },
  {
    code: "memory",
    title: "Counterfactual Memory",
    line: "The rejected branch still pays rent.",
    copy: "Vectant converts near-misses into comparable choice scenes with evidence, policy deltas, and regret signals for the next run.",
  },
  {
    code: "replay",
    title: "Causal Twin",
    line: "Fork the past, change one variable, replay the outcome.",
    copy: "Vectant varies captured change context in an isolated twin, then reports confidence, coverage, and proof.",
  },
  {
    code: "load",
    title: "Allostatic Evidence",
    line: "Authority adapts to the load the system can prove.",
    copy: "Vectant lowers restrictions after clean landings, replay, and checkrides. Failures raise load through deterministic evidence.",
  },
  {
    code: "probe",
    title: "Therapeutic Tomography",
    line: "Diagnose with minimum effective authority.",
    copy: "Vectant starts with small probes, keeps uncertainty visible, justifies escalation, and separates investigation from mutation.",
  },
];

const DEEP_FEATURES = [
  {
    tag: "GPU",
    title: "GPU HMR",
    copy: "Vectant promotes compiled hot reload only when state, ABI, oracle, and ledger gates pass.",
  },
  {
    tag: "CLOUD",
    title: "Cloud Runtime",
    copy: "Vectant keeps compiler, Git, agent, browser, ports, services, logs, and evidence on one cloud runtime truth.",
  },
  {
    tag: "EXT",
    title: "VS Code Extension Path",
    copy: "Vectant brings every VS Code extension your workflow depends on into the same governed extension host path.",
  },
  {
    tag: "LIVE",
    title: "Live Collaboration",
    copy: "Vectant gives teams CRDT editing, presence, cursors, workspace access control, and governed human-agent sessions.",
  },
  {
    tag: "APK",
    title: "Mobile Compile",
    copy: "Vectant drives Flutter-first Android flows: detect, build APK, install, launch, capture logs, record video, and drive input channels.",
  },
  {
    tag: "REPAIR",
    title: "Self-Healing Runtime",
    copy: "Vectant runs targeted repair episodes for compile and runtime failures with policy, verification, rollback, and confidence gates.",
  },
  {
    tag: "ANALYZE",
    title: "Proactive Analysis",
    copy: "Vectant runs static checks under 100ms, semantic checks under 500ms, and rate-limited AI analysis before the compiler wastes your loop.",
  },
  {
    tag: "MCP",
    title: "MCP Tools",
    copy: "Vectant exposes screenshots, locate, click, type, wait-HMR, console, network, source, frame gates, and brokered input leases.",
  },
];

const SURFACES = [
  ["Large-scale ML infra", "CUDA and ROCm/HIP artifacts, kernel loops, output oracles, device epochs, before-after proof"],
  ["Enterprise codebases", "large repos, policy gates, VS Code extensions, branch evidence, line provenance, rollback trails"],
  ["Robotics and simulation", "render loops, hardware-adjacent validation, perceptual proof, preserved runtime state"],
  ["Game engines and native systems", "compiled C++ / Rust hot paths, ABI checks, asset reload, stateful scene proof"],
  ["Mobile apps", "Flutter builds, emulator launch, logs, video, install, input channels"],
  ["Complex multi-service apps", "ports, services, browser flows, logs, network traces, MCP tools, Playwright replay"],
];

const DOGFOOD_ITEMS = [
  ["runtime", "Built in the same cloud loop: repo, terminal, browser, agents, reload state, and proof."],
  ["vectant", "Every agent change carries clearance, protected-path boundaries, evidence, and handoff context."],
  ["evidence", "Screenshots come from running Vectant workspaces, not placeholder dashboard art."],
  ["hard repo", "We run the loop on Vectant before asking you to connect guarded production code."],
];

const PILOT_ITEMS = [
  "Profile GPU HMR on a real compiled project",
  "Run CUDA or ROCm/HIP workflows with state preservation proof",
  "Connect the VS Code extensions your enterprise repo actually needs",
  "Review Vectant proof packets from production-bound agent work",
  "Open a live collaboration room with humans and independent agents",
  "Teach a workflow through Vectant and inspect the license boundary",
  "Connect browser automation through MCP eyes and hands",
];

const FAQ = [
  {
    q: "Does Vectant only work on websites?",
    a: "No. If a system can compile, run, stream, render, log, or be observed through browser, GUI, terminal, mobile, or GPU channels, Vectant can become the agent runtime around it.",
  },
  {
    q: "What exactly is the GPU HMR claim?",
    a: "Bring the real compiled project, not a toy benchmark. Vectant profiles native GPU hot paths, supports CUDA/ROCm/HIP architecture, and promotes reload only when state preservation, ABI, epoch, oracle, and ledger gates pass. Current local proof is ROCm/HIP.",
  },
  {
    q: "Why would senior engineers trust autonomous agents here?",
    a: "Because trust is enforced by the runtime: scoped leases before mutation, replay after action, provenance for review, and proof before authority expands.",
  },
  {
    q: "Do teams have to replace their tools?",
    a: "No. Vectant is the environment around the tools. Keep your agents, keep terminal workflows, keep Git, keep VS Code extensions, and move the build-review loop into a governed cloud runtime.",
  },
  {
    q: "Can humans and agents collaborate in one workspace?",
    a: "Yes. Live collaboration is built around instant presence, workspace access controls, and Vectant sessions where independent agents can coordinate routes, claims, conflicts, and handoffs in the same shared room.",
  },
];

function PrimaryCta({ href = "#waitlist", children = "Run a proof pilot" }) {
  return (
    <a href={href} className="primary-cta group">
      <span>{children}</span>
      <span className="primary-cta-icon">
        <span aria-hidden="true">→</span>
      </span>
    </a>
  );
}

function SecondaryCta({ href, children }) {
  return (
    <a href={href} className="secondary-cta">
      {children}
    </a>
  );
}

function ProductFrame({ shot, className = "", mediaClassName = "", priority = false }) {
  return (
    <article className={`proof-frame group ${className}`} data-reveal>
      <div className={`proof-frame-media ${mediaClassName}`}>
        <Image
          src={shot.src}
          alt={`${shot.title}: ${shot.detail}`}
          width={shot.width}
          height={shot.height}
          priority={priority}
          sizes="(min-width: 1280px) 54vw, (min-width: 768px) 82vw, 100vw"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
        />
      </div>
      <div className="proof-frame-copy">
        <h3>{shot.title}</h3>
        <p>{shot.detail}</p>
      </div>
    </article>
  );
}

function ProofMarquee() {
  const items = [
    "eyes through MCP",
    "hands through leases",
    "runtime evidence",
    "proof-gated GPU HMR",
    "state preservation",
    "CUDA-oriented workflows",
    "ROCm / HIP proof",
    "instant live collab",
    "workspace access control",
    "multi-agent Vectant rooms",
    "Vectant replay ledger",
    "Vectant checkrides",
    "counterfactual memory",
    "causal replay",
    "mobile compile",
    "self-healing gates",
  ];

  return (
    <div className="proof-marquee" aria-label="Vectant runtime capabilities">
      <div className="proof-marquee-track">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="runtime-campaign runtime-hero-v2 surface-dark relative isolate overflow-visible bg-[#070708] pt-24 text-white">
      <div className="campaign-atmosphere" aria-hidden="true" />
      <div className="hero-main-grid mx-auto grid max-w-[1540px] gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8 lg:pb-24">
        <div className="max-w-[880px]" data-reveal>
          <p className="hero-kicker">
            <span className="hero-kicker-copy">World&apos;s first fully autonomous agentic runtime environment for production code</span>
            <svg
              className="hero-kicker-line"
              viewBox="0 0 620 18"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id="hero-kicker-gradient" x1="0" x2="620" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#ff4bd8" />
                  <stop offset="0.34" stopColor="#ff6848" />
                  <stop offset="0.68" stopColor="#5ee7ff" />
                  <stop offset="1" stopColor="#8d7bff" />
                </linearGradient>
              </defs>
              <path
                className="hero-kicker-line-path"
                d="M2 9 C 68 4 128 14 196 8 C 268 1 334 5 396 10 C 474 17 546 12 618 7"
                pathLength="1"
              />
            </svg>
          </p>
          <h1 className="hero-title">
            Govern AI agents where the code actually runs.
          </h1>
          <p className="hero-copy">
            Bring production-bound coding agents into a live workspace with leased mutations, protected paths, replay ledgers, and proof packets.
          </p>
          <div className="mt-8 max-w-2xl">
            <WaitlistForm
              variant="hero"
              buttonLabel="Start proof pilot"
              className="w-full border-white/12 bg-white/[0.035]"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <PrimaryCta href="#waitlist">Pilot on a production repo</PrimaryCta>
            <SecondaryCta href="#proof">See runtime evidence</SecondaryCta>
          </div>
        </div>
        <HeroProductFloat />
      </div>

      <div className="mx-auto max-w-[1540px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="hero-proof-strip" data-reveal>
          {[
            ["Vectant licenses", "agents earn scoped authority before production mutation"],
            ["Vectant leases", "mutation scope, protected paths, landing inspection, replay ledger"],
            ["MCP eyes and hands", "browser, terminal, editor, screenshots, network, replay"],
            ["GPU HMR", "proof-gated compiled reloads with preserved runtime state"],
          ].map(([title, copy]) => (
            <div key={title} className="hero-proof-cell">
              <strong>{title}</strong>
              <span>{copy}</span>
            </div>
          ))}
        </div>
      </div>
      <ProofMarquee />
    </section>
  );
}

function ComparisonSection() {
  return (
    <section id="runtime" className="runtime-campaign surface-dark scroll-mt-16 bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="runtime-lede" data-reveal>
          <h2>Code is easy. Safe mutation is the bottleneck.</h2>
          <p>
            Today's tools produce plausible diffs fast. The expensive part starts after the edit: was the agent allowed to touch that file, did state survive, and can a reviewer replay the evidence?
          </p>
        </div>

        <div className="comparison-ledger" data-reveal>
          {TOOL_COMPARISON.map(({ tool, current, vectant }) => (
            <article key={tool} className="comparison-ledger-row">
              <h3>{tool}</h3>
              <p>{current}</p>
              <p>{vectant}</p>
            </article>
          ))}
        </div>

        <div id="trust-reveal" className="belief-statement" data-reveal>
          <p className="scrub-copy">
            {[
              "Agents",
              "do",
              "not",
              "merge.",
              "They",
              "earn",
              "landing.",
              "Every",
              "serious",
              "claim",
              "carries",
              "proof.",
            ].map((word, index) => (
              <span key={`${word}-${index}`} className="scrub-word">
                {word}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function RuntimeControlSection() {
  return (
    <section id="capabilities" className="runtime-campaign surface-dark scroll-mt-16 bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="section-lede max-w-[1040px]" data-reveal>
          <h2>Autonomy is only useful when the runtime can govern it.</h2>
          <p>
            Vectant is not chat over a repo. It is the execution environment around the running system: tools, policies, browser state, logs, leases, replay, and proof in one place.
          </p>
        </div>

        <div className="runtime-pillar-grid">
          {RUNTIME_PILLARS.map(({ mark, title, signal, copy }) => (
            <article key={title} className="runtime-pillar" data-reveal>
              <div className="system-mark">{mark}</div>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              <span>{signal}</span>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <ProductFrame shot={BROWSER_SHOT} className="min-h-full" priority={false} />
          <div className="runtime-contract-panel" data-reveal>
            <h3>MCP eyes and hands share the same runtime truth.</h3>
            <p>
              Compiler, AI, Git, browser, terminal, preview, logs, collaboration, and MCP tools observe the same project state. Agents get eyes and hands in the runtime; reviewers get facts instead of reconstructed stories.
            </p>
            <div className="contract-stack">
              {["Repo", "Editor", "Terminal", "Browser", "GPU", "Mobile", "MCP", "Proof"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DogfoodSection() {
  return (
    <section id="dogfood" className="runtime-campaign surface-dark scroll-mt-32 bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="dogfood-panel" data-reveal>
          <div className="dogfood-copy">
            <div className="dogfood-status">
              <span>vectant/self</span>
              <strong>built inside the runtime</strong>
            </div>
            <h2>Vectant ships through its own control plane.</h2>
            <p>
              The workspace behind this page contains repo, browser, terminal, agents, HMR state, clearance, and proof. The screenshots are captured product surfaces, not concept art.
            </p>
            <div className="dogfood-proof-line" aria-label="Vectant self-build proof path">
              <span>workspace</span>
              <span>agents</span>
              <span>hmr</span>
              <span>vectant</span>
              <span>ship</span>
            </div>
          </div>
          <div className="dogfood-console">
            <div className="dogfood-images">
              <Image
                src="/product-proof/investor-demo-workspace.png"
                alt="Vectant workspace used to build Vectant."
                width={1440}
                height={1000}
                sizes="(min-width: 1024px) 34vw, 100vw"
              />
              <Image
                src="/product-proof/investor-demo-workflows.png"
                alt="Vectant workflow proving agent coordination while building Vectant."
                width={1440}
                height={1000}
                sizes="(min-width: 1024px) 34vw, 100vw"
              />
            </div>
            <div className="dogfood-ledger">
              {DOGFOOD_ITEMS.map(([label, copy]) => (
                <div key={label}>
                  <span>{label}</span>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveCollaborationSection() {
  return (
    <section id="collaboration" className="runtime-campaign surface-dark scroll-mt-16 bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="collab-console" data-reveal>
          <div className="collab-console-copy">
            <h2>One live room for humans, agents, permissions, and proof.</h2>
            <p>
              Vectant collaboration is low-latency shared workspace state for software operations: permissions, presence, cursors, selections, runtime state, and agent action all share the same session.
            </p>
            <p>
              Independent agents coordinate routes, claim work, negotiate conflicts, and hand off context inside the same governed runtime. Every move is scoped, leased, and replayable.
            </p>
          </div>

          <div className="collab-room" aria-label="Live collaboration room model">
            <div className="collab-room-header">
              <span>workspace_acl.yaml</span>
              <strong>4 humans / 6 agents / live</strong>
            </div>
            <div className="collab-room-grid">
              {COLLABORATION_WEDGES.map(({ title, copy }) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GpuSection() {
  return (
    <section id="gpu-hmr" className="runtime-campaign surface-dark scroll-mt-16 overflow-hidden bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="gpu-stage" data-reveal>
          <div className="gpu-copy">
            <p className="section-mark">Proof-gated GPU HMR</p>
            <h2>Hot-swap compiled code. Keep runtime state.</h2>
            <GpuLatencyCounter />
            <p>
              Vectant swaps the compiled artifact without dropping the running session, then promotes only after ABI, hardware, oracle, ledger, and state checks pass.
            </p>
            <p>
              Current proof: ROCm/HIP. CUDA-oriented workflows follow the same gated route after hardware-backed validation.
            </p>
            <div className="gpu-market-strip" aria-label="Best-fit GPU HMR markets">
              {GPU_HMR_MARKETS.map((market) => (
                <span key={market}>{market}</span>
              ))}
            </div>
          </div>

          <div className="gpu-evidence-stack">
            <GpuBeforeAfter />
            <div className="compiled-workflow-grid" data-reveal>
              {COMPILED_WORKFLOWS.map(({ title, copy }) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section id="proof" className="runtime-campaign surface-dark scroll-mt-16 bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="section-lede max-w-[1110px]" data-reveal>
          <h2>Every agent landing leaves a replay ledger.</h2>
          <p>
            Before a diff reaches the repo, Vectant records the route, lease, protected paths, conflicts, checks, replay, and output evidence. Review the change by opening the proof packet, not by trusting a summary.
          </p>
        </div>

        <div className="proof-gallery" data-reveal>
          {PROOF_GALLERY.map((shot, index) => (
            <ProductFrame key={`${shot.title}-${index}-${shot.src}`} shot={shot} className={`proof-gallery-card ${shot.span || ""}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DojoSection() {
  return (
    <section id="dojo" className="runtime-campaign surface-dark scroll-mt-16 bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="dojo-stage">
          <div className="dojo-copy" data-reveal>
            <h2>Teach once. License only what survives checkrides.</h2>
            <p>
              Demonstrations become source-aware skills with selectors, boundaries, negative cases, and success evidence.
            </p>
            <p>
              The rehearsal environment runs the workflow. Vectant grants a narrow license only where replay and proof pass.
            </p>
          </div>

          <div className="dojo-steps" data-reveal>
            {DOJO_STEPS.map(([title, copy], index) => (
              <article key={title}>
                <span className="dojo-step-mark">{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <ProductFrame shot={DOJO_SHOT} className="dojo-proof-tall" />
          <div className="grid gap-4">
            <ProductFrame shot={RUNTIME_WORKFLOW_SHOT} />
            <ProductFrame shot={COUNTERFACTUAL_SHOT} className="counter-proof" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSystemsSection() {
  return (
    <section id="trust" className="runtime-campaign surface-dark scroll-mt-16 bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="sticky top-24 self-start" data-reveal>
            <h2 className="trust-headline">Production authority has to be earned.</h2>
            <p className="trust-copy">
              Clearance, leases, licenses, causal replay, and evidence load decide what an agent can touch, when it can act, and when it gets revoked.
            </p>
          </div>

          <div className="trust-stack">
            {TRUST_SYSTEMS.map(({ code, title, line, copy }) => (
              <article key={title} className="trust-system" data-reveal>
                <div className="trust-system-code">{code}</div>
                <div>
                  <h3>{title}</h3>
                  <strong>{line}</strong>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSystemsSection() {
  return (
    <section className="runtime-campaign surface-dark bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="section-lede max-w-[1120px]" data-reveal>
          <h2>Vectant wraps the hard parts of agent work in one runtime loop.</h2>
          <p>
            Start with the systems that make autonomous work believable on real codebases, not only greenfield web apps. Then try everything else inside Vectant.
          </p>
        </div>

        <div className="deep-feature-grid">
          {DEEP_FEATURES.map(({ tag, title, copy }) => (
            <article key={title} className="deep-feature" data-reveal>
              <div className="feature-tag">{tag}</div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>

        <div className="feature-cta-strip" data-reveal>
          <div>
            <h3>Bring the loop that currently scares reviewers.</h3>
            <p>Vectant attaches runtime state, policy, replay, and proof before the agent asks to land work.</p>
          </div>
          <PrimaryCta href="#waitlist">Request pilot access</PrimaryCta>
        </div>
      </div>
    </section>
  );
}

function BeyondSitesSection() {
  return (
    <section className="runtime-campaign surface-dark bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div data-reveal>
          <h2 className="surface-headline">The real wedge is any system that must keep running.</h2>
          <p className="surface-copy">
              Websites are the obvious demo. Vectant is built for systems that compile, render, stream, log, or need browser, terminal, GPU, mobile, GUI, or service control.
          </p>
          </div>
          <div className="surface-list" data-reveal>
            {SURFACES.map(([title, body]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="runtime-campaign surface-dark scroll-mt-16 bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <div data-reveal>
          <h2 className="pilot-headline">Run the pilot on the repo your agent is not allowed to touch.</h2>
          <p className="pilot-copy">
            Bring the compiled loop, enterprise extension stack, browser workflow, or multi-agent change that breaks today's tools. Vectant returns the runtime trace, proof packet, and clearance boundary.
          </p>
        </div>

        <div className="pilot-panel" data-reveal>
          <div className="pilot-panel-top">
            <div>
              <span>Pilot access</span>
              <h3>Proof pilot</h3>
            </div>
            <strong>Real repo, real runtime</strong>
          </div>
          <ul>
            {PILOT_ITEMS.map((item) => (
              <li key={item}>
                <span className="pilot-check" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <WaitlistForm
              variant="hero"
              buttonLabel="Start proof run"
              className="w-full border-white/12 bg-white/[0.035]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="runtime-campaign surface-dark scroll-mt-16 bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="section-lede max-w-[980px]" data-reveal>
          <h2>Strong claims. Clear boundaries.</h2>
          <p>
            The page makes hard promises because the runtime has hard gates. Screenshots are evidence. The ledger is authority. Every major claim has to survive logs, replay, policy, and proof.
          </p>
        </div>
        <div className="faq-grid">
          {FAQ.map(({ q, a }) => (
            <article key={q} className="faq-card" data-reveal>
              <h3>{q}</h3>
              <p>{a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="waitlist" className="runtime-campaign surface-dark scroll-mt-16 bg-[#070708] px-4 py-24 text-white md:py-36">
      <div className="final-cta mx-auto max-w-[1160px]" data-reveal>
        <div className="final-cta-icon">
          <img
            src="/Vectant_v3_nobg.png"
            alt="Vectant"
            width="1043"
            height="239"
            loading="eager"
            className="final-cta-logo h-auto w-[240px] sm:w-[300px] md:w-[340px]"
          />
        </div>
        <h2>Bring the repo your agent cannot safely touch yet.</h2>
        <p>
          Run a pilot inside an autonomous runtime with your tools, your extension paths, your runtime signals, and evidence your reviewers can inspect.
        </p>
        <div className="mx-auto mt-9 max-w-2xl">
          <WaitlistForm
            variant="hero"
            buttonLabel="Request pilot access"
            className="w-full border-white/12 bg-white/[0.035]"
          />
        </div>
      </div>
    </section>
  );
}

export function VectantLanding() {
  return (
    <main className="vectant-landing-root surface-dark w-full max-w-full bg-[#070708]">
      <VectantMotion />
      <Hero />
      <AgentOnRamp />
      <ComparisonSection />
      <RuntimeControlSection />
      <DogfoodSection />
      <LiveCollaborationSection />
      <GpuSection />
      <ProofSection />
      <DojoSection />
      <TrustSystemsSection />
      <FeatureSystemsSection />
      <BeyondSitesSection />
      <PricingSection />
      <FaqSection />
      <FinalCta />
    </main>
  );
}
