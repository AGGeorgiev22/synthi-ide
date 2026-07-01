import Image from "next/image";

import { AgentOnRamp } from "@/components/AgentOnRamp";
import { HeroProductFloat } from "@/components/HeroProductFloat";
import { VectantMotion } from "@/components/VectantMotion";
import { GpuBeforeAfter } from "@/components/GpuBeforeAfter";
import { WaitlistForm } from "@/components/WaitlistForm";
import { AnimatedLogo } from "@/components/Logo";

const BROWSER_SHOT = {
  title: "Browser workflow observe",
  detail: "The agent sees the running app, browser state, workflow steps, terminal context, and replay surface in one cloud runtime.",
  src: "/product-proof/browser-workflow-observe-ui.png",
  width: 1500,
  height: 1000,
};

const DOJO_SHOT = {
  title: "CodeSite senior workflow proof",
  detail: "A complete proof packet for a multi-step agent workflow: API steps, events, artifacts, checks, and Dojo clearance.",
  src: "/product-proof/senior-real-codesite-workflow-proof.png",
  width: 1440,
  height: 1708,
};

const CODESITE_SHOT = {
  title: "CodeSite full workflow",
  detail: "Flights, leases, no-fly zones, conflict forecast, active claims, and tower timeline for agent mutation control.",
  src: "/product-proof/codesite-full-workflow-ui.png",
  width: 1440,
  height: 1100,
};

const COUNTERFACTUAL_SHOT = {
  title: "Counterfactual memory proof",
  detail: "The rejected branch still teaches the system: comparable scenes, lease gates, policy deltas, and decision evidence.",
  src: "/product-proof/codesite-counterfactual-memory-proof.png",
  width: 1280,
  height: 2296,
};

const PROOF_GALLERY = [
  {
    title: "Workflow observe",
    detail: "MCP eyes and hands attached to a hosted browser.",
    src: "/product-proof/browser-workflow-observe-ui.png",
    width: 1500,
    height: 1000,
    span: "proof-wide",
  },
  {
    title: "Workspace loaded",
    detail: "Cloud IDE, browser, runtime, and agent workspace in the same place.",
    src: "/product-proof/browser-workspace-loaded.png",
    width: 1500,
    height: 1000,
  },
  {
    title: "CodeSite workflow",
    detail: "Live tower view for active agent changes.",
    src: "/product-proof/codesite-full-workflow-ui.png",
    width: 1440,
    height: 1100,
    span: "proof-large",
  },
  {
    title: "Senior workflow proof",
    detail: "A full Dojo-cleared evidence packet.",
    src: "/product-proof/senior-real-codesite-workflow-proof.png",
    width: 1440,
    height: 1708,
    span: "proof-tall",
  },
  {
    title: "Counterfactual memory",
    detail: "Decision traces from the branch that almost shipped.",
    src: "/product-proof/codesite-counterfactual-memory-proof.png",
    width: 1280,
    height: 2296,
    span: "proof-tall",
  },
  {
    title: "Shadow simulator",
    detail: "Schema coordination before broader authority.",
    src: "/product-proof/codesite-shadow-simulator-ui-desktop.png",
    width: 1440,
    height: 1100,
  },
  {
    title: "Line inspector",
    detail: "The changed line keeps process ancestry and proof refs.",
    src: "/product-proof/codesite-line-inspector-ui-desktop.png",
    width: 1440,
    height: 1100,
  },
  {
    title: "Metrics panel",
    detail: "Evidence throughput, claims, conflicts, and proof health.",
    src: "/product-proof/codesite-metrics-panel.png",
    width: 1440,
    height: 1100,
  },
  {
    title: "Loaded enterprise workflow",
    detail: "Signup, email verification, leases, risk, and collision forecast.",
    src: "/product-proof/senior-real-codesite-ui-desktop-loaded.png",
    width: 1440,
    height: 1100,
    span: "proof-wide",
  },
  {
    title: "Export handoff",
    detail: "Proof leaves the runtime as an inspectable packet.",
    src: "/product-proof/investor-demo-export-handoff.png",
    width: 1440,
    height: 1000,
  },
  {
    title: "Runtime workflows",
    detail: "Observe, trace, contract, replay, and publish in the IDE.",
    src: "/product-proof/investor-demo-workflows.png",
    width: 1440,
    height: 1000,
  },
  {
    title: "Investor workspace",
    detail: "The runtime control plane in the actual cloud workspace.",
    src: "/product-proof/investor-demo-workspace.png",
    width: 1440,
    height: 1000,
  },
  {
    title: "GPU before",
    detail: "Before HMR.",
    src: "/product-proof/gpu-hmr-before.png",
    width: 800,
    height: 600,
  },
  {
    title: "GPU diff",
    detail: "Visual proof of the hot swap.",
    src: "/product-proof/gpu-hmr-diff.png",
    width: 800,
    height: 600,
  },
  {
    title: "GPU after",
    detail: "After HMR.",
    src: "/product-proof/gpu-hmr-after.png",
    width: 800,
    height: 600,
  },
  {
    title: "CodeSite radar",
    detail: "Curated radar proof view.",
    src: "/codesite-proof/codesite-radar-desktop.png",
    width: 1440,
    height: 1973,
    span: "proof-tall",
  },
  {
    title: "Black box handover",
    detail: "Replayable handoff with event stream and proof digest.",
    src: "/codesite-proof/codesite-black-box-desktop.png",
    width: 1440,
    height: 1313,
  },
  {
    title: "Landing inspection",
    detail: "Inspection results before an agent lands work.",
    src: "/codesite-proof/codesite-landing-desktop.png",
    width: 1440,
    height: 1199,
  },
  {
    title: "Line provenance",
    detail: "Source line, transaction, proof, reason, and ancestry.",
    src: "/codesite-proof/codesite-line-provenance-desktop.png",
    width: 1440,
    height: 1100,
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
    vectant: "Dojo, CodeSite, and MCP turn workflows into bounded capabilities that act on real code only after they earn clearance.",
  },
];

const COMPILED_WORKFLOWS = [
  {
    title: "ROCm / HIP proof runs",
    copy: "Edit a `.hip` device artifact, compile the sidecar, publish a new epoch, and accept only when oracle and visual proof pass.",
  },
  {
    title: "CUDA-oriented workflows",
    copy: "Use the same architecture for `.cu` teams: keep the compile loop, lose the restart loop, and require hardware-backed validation before promotion.",
  },
  {
    title: "Native module boundaries",
    copy: "Vectant searches for the smallest safe compiled hot path, then refuses reload when ABI, binding, or runtime preservation proof is missing.",
  },
  {
    title: "Rendering loops",
    copy: "Before, diff, after evidence gives reviewers the output story while the ledger records compile, dispatch, epoch, and preservation signals.",
  },
];

const GPU_HMR_MARKETS = [
  "large-scale ML infra",
  "enterprise codebases",
  "GPU / rendering / simulation",
  "CUDA and ROCm workflows",
  "ML kernels",
  "robotics",
  "game engines",
  "large C++ / Rust systems",
  "agentic coding environments",
  "complex multi-service apps",
];

const COLLABORATION_WEDGES = [
  {
    title: "Workspace access control",
    copy: "Invite the right humans and agents, scope who can see or act inside the workspace, and revoke access without losing the session trail.",
  },
  {
    title: "Instant shared presence",
    copy: "Edits, cursors, selections, runtime state, and handoff context move with Google Docs-level immediacy.",
  },
  {
    title: "Agent rooms, not agent chaos",
    copy: "Independent agents in the same CodeSite session coordinate like teammates in Slack: routes, claims, conflicts, and handoffs are visible.",
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
    copy: "Vectant turns CodeSite packets, line provenance, output oracles, and ledgers into review material.",
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
  ["Distill", "Cortex extracts source-aware steps, boundaries, selectors, and success evidence."],
  ["Practice", "Vivarium runs checkrides, negative cases, and replay trials before authority expands."],
  ["License", "The runtime grants a narrow, proof-carrying capability that can expire, be revoked, and be re-tested."],
];

const TRUST_SYSTEMS = [
  {
    code: "clearance",
    title: "CodeSite",
    line: "Serializable isolation for AI-generated code changes.",
    copy: "Vectant makes agents file flight plans, receive MutationLeases, avoid no-fly zones, pass inspections, and leave a black box.",
  },
  {
    code: "license",
    title: "Agent Dojo Cortex",
    line: "Teach a workflow once, then make it earn production authority.",
    copy: "Vectant turns demonstrations into source-aware skills that practice in Vivarium, pass checkrides, and ship as bounded licenses.",
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
    copy: "Vectant permits sub-100ms reloads for arbitrary compiled projects only when state, ABI, oracle, and ledger gates pass.",
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
    copy: "Vectant gives teams instant CRDT editing, presence, cursors, workspace access control, and Google Docs-speed human-agent sessions.",
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
  ["runtime", "This page ships from the same cloud workspace loop we sell: repo, browser, terminal, agents, proof, and reload state."],
  ["codesite", "Agent changes move through CodeSite clearances, no-fly zones, proof packets, and handoff evidence."],
  ["evidence", "The product surfaces are captures from running Vectant workspaces. Not stock dashboards. Not abstract mockups."],
  ["hard repo", "We use the loop on our own product before asking you to connect the repo your team is afraid to let an agent touch."],
];

const PILOT_ITEMS = [
  "Profile sub-100ms GPU HMR on a real compiled project",
  "Run CUDA or ROCm/HIP workflows with state preservation proof",
  "Connect the VS Code extensions your enterprise repo actually needs",
  "Review CodeSite proof packets from production-bound agent work",
  "Open a live collaboration room with humans and independent agents",
  "Teach a workflow through Dojo and inspect the license boundary",
  "Connect browser automation through MCP eyes and hands",
];

const FAQ = [
  {
    q: "Does Vectant only work on websites?",
    a: "No. If a system can compile, run, stream, render, log, or be observed through browser, GUI, terminal, mobile, or GPU channels, Vectant can become the agent runtime around it.",
  },
  {
    q: "What exactly is the GPU HMR claim?",
    a: "Bring the real compiled project, not a toy benchmark. Vectant profiles native GPU hot paths, supports CUDA/ROCm/HIP architecture, and promotes sub-100ms reload only when state preservation, ABI, epoch, oracle, and ledger gates pass. Current local proof is ROCm/HIP.",
  },
  {
    q: "Why would senior engineers trust autonomous agents here?",
    a: "Because Vectant treats trust as runtime infrastructure: scoped leases, proof packets, replay, line provenance, checkrides, counterfactual memory, causal twins, and evidence-backed authority.",
  },
  {
    q: "Do teams have to replace their tools?",
    a: "No. Vectant is the environment around the tools. Keep your agents, keep terminal workflows, keep Git, keep VS Code extensions, and move the build-review loop into a governed cloud runtime.",
  },
  {
    q: "Can humans and agents collaborate in one workspace?",
    a: "Yes. Live collaboration is built around instant presence, workspace access controls, and CodeSite sessions where independent agents can coordinate routes, claims, conflicts, and handoffs in the same shared room.",
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
    "multi-agent CodeSite rooms",
    "CodeSite black box",
    "Dojo checkrides",
    "counterfactual memory",
    "causal replay",
    "mobile compile",
    "self-healing gates",
  ];
  const loop = [...items, ...items];

  return (
    <div className="proof-marquee" aria-hidden="true">
      <div className="proof-marquee-track">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
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
          <p className="hero-kicker"><span>World's first fully autonomous agentic runtime environment</span></p>
          <h1 className="hero-title">
            Build serious software faster.
          </h1>
          <p className="hero-copy">
            Vectant is the cloud runtime around agents you already trust. It keeps the running system alive, supports your VS Code extension path, reloads accepted compiled GPU hot paths in under 100ms, and turns production-bound work into proof.
          </p>
          <div className="mt-8 max-w-2xl">
            <WaitlistForm
              variant="hero"
              buttonLabel="Start proof pilot"
              className="w-full border-white/12 bg-white/[0.035]"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <PrimaryCta href="#waitlist">Run the hard repo</PrimaryCta>
            <SecondaryCta href="#gpu-hmr">See GPU reload proof</SecondaryCta>
          </div>
        </div>
        <HeroProductFloat />
      </div>

      <div className="mx-auto max-w-[1540px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="hero-proof-strip" data-reveal>
          {[
            ["Dojo licenses", "skills earn scoped authority before they touch production"],
            ["CodeSite leases", "flight plans, no-fly zones, landing inspection, black box"],
            ["MCP eyes and hands", "browser, terminal, editor, screenshots, network, replay"],
            ["GPU HMR", "sub-100ms arbitrary compiled reloads with preserved state"],
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
          <h2>The bottleneck is peaceful production mutation.</h2>
          <p>
            Today's tools can produce code at frightening speed. The expensive part starts after the diff: was the agent allowed to touch that file, did the app run, did state survive, and can a reviewer replay the evidence without trusting a paragraph?
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
              "finish.",
              "They",
              "request",
              "landing.",
              "Every",
              "serious",
              "claim",
              "has",
              "an",
              "artifact.",
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
          <h2>The control plane between vibe coding and production.</h2>
          <p>
            Vectant is not chat over a repo. It is execution, observation, access control, policy, replay, and proof around the running system, with every VS Code extension path and MCP tool inside the same runtime truth.
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
              <strong>runtime eating its own proof</strong>
            </div>
            <h2>Don't take our word for it. We use Vectant to build Vectant.</h2>
            <p>
              The same runtime that hosts the product, coordinates agents, records evidence, and reloads proof surfaces is the runtime behind this page. If Vectant cannot survive its own CodeSite gates, reload loops, and agent handoffs, it does not get to ask for your production repo.
            </p>
            <div className="dogfood-proof-line" aria-label="Vectant self-build proof path">
              <span>workspace</span>
              <span>agents</span>
              <span>hmr</span>
              <span>codesite</span>
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
                src="/product-proof/codesite-full-workflow-ui.png"
                alt="CodeSite workflow proving agent coordination while building Vectant."
                width={1440}
                height={1100}
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
            <h2>One workspace. Humans, agents, access control, and CodeSite in the same room.</h2>
            <p>
              Vectant collaboration feels instant like Google Docs, but it is built for software operations: permissions, presence, cursors, selections, runtime state, and agent action all share the same session.
            </p>
            <p>
              CodeSite turns independent agents into visible teammates. They can coordinate routes, claim work, negotiate conflicts, and hand off context the way engineers coordinate in Slack, except every move is scoped, leased, and replayable.
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
            <h2>Stop restarting the world for one compiled change.</h2>
            <p>
              Vectant compresses the edit-run-observe loop across arbitrary software while preserving state. The value is immediate in systems where every rebuild forces you to wait, restart, rehydrate state, and reproduce context.
            </p>
            <p>
              For GPU, rendering, simulation, ML kernels, game engines, robotics, and large C++ or Rust systems, Vectant isolates the safe hot path, preserves the running session, compiles the changed artifact, swaps it into place, and promotes a sub-100ms reload path only when hardware validation, ABI proof, dispatch evidence, output oracle, ledger, and state preservation all agree.
            </p>
            <p>
              The strongest proof today is ROCm/HIP. CUDA follows the same route: accelerated workflows, strict gates, no blind hot swap.
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

function CodeSiteProofSection() {
  return (
    <section id="proof" className="runtime-campaign surface-dark scroll-mt-16 bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="section-lede max-w-[1110px]" data-reveal>
          <h2>CodeSite makes every agent landing inspectable.</h2>
          <p>
            An agent does not simply write and hope. It files a flight plan, receives a MutationLease, respects no-fly zones, watches conflict forecasts, passes landing inspection, and leaves a black-box handoff. If it writes outside managed clearance, the runtime can quarantine before it reaches the repo.
          </p>
        </div>

        <div className="proof-gallery" data-reveal>
          {PROOF_GALLERY.map((shot) => (
            <ProductFrame key={`${shot.title}-${shot.src}`} shot={shot} className={`proof-gallery-card ${shot.span || ""}`} />
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
            <h2>Dojo Cortex turns demos into licenses.</h2>
            <p>
              Today's tools can replay a transcript. Dojo turns a demonstrated workflow into a source-aware, testable, proof-carrying capability with bounded authority.
            </p>
            <p>
              Cortex extracts the steps. Vivarium makes the skill practice. Checkrides prove the behavior. CodeSite decides where that capability is allowed to land.
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
            <ProductFrame shot={CODESITE_SHOT} />
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
            <h2 className="trust-headline">Vibe coding becomes production work when authority is earned.</h2>
            <p className="trust-copy">
              Vectant turns trust into explicit systems: route clearance, proof bundles, skill licenses, counterfactual memory, causal replay, and deterministic evidence load.
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
            <h3>Try the rest inside Vectant.</h3>
            <p>Whatever you dream of building is possible when the agent has a runtime, not just a chat box.</p>
          </div>
          <PrimaryCta href="#waitlist">Start today</PrimaryCta>
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
          <h2 className="surface-headline">Whatever you dream of building should be runnable in Vectant.</h2>
          <p className="surface-copy">
              Websites are the obvious demo. The real wedge is any system that can compile, run, render, stream, log, or be driven through browser, terminal, GPU, mobile, GUI, or service channels.
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
          <h2 className="pilot-headline">Run the pilot on the work that breaks today's tools.</h2>
          <p className="pilot-copy">
            Large-scale ML infra. Enterprise codebases. GPU-heavy edit loops. Robotics and simulation. Extension-dependent teams. Multi-agent production changes. Work where "the agent said it passed" is not good enough.
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
          <AnimatedLogo expanded className="final-cta-logo" />
        </div>
        <h2>Bring the agent you trust. Give it a runtime you can trust.</h2>
        <p>
          Move from code suggestions to a cloud runtime where agents can see, act, reload, recover, collaborate, earn authority, remember near-misses, and ship evidence for serious software.
        </p>
        <div className="mx-auto mt-9 max-w-2xl">
          <WaitlistForm
            variant="hero"
            buttonLabel="Get pilot access"
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
      <CodeSiteProofSection />
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
