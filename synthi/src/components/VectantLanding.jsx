import Image from "next/image";

import { AuthorityStory } from "@/components/home/AuthorityStory";
import { CinematicHero } from "@/components/home/CinematicHero";
import { GpuProofChapter } from "@/components/home/GpuProofChapter";
import { RuntimeFeedback } from "@/components/home/RuntimeFeedback";
import { VectantMark } from "@/components/Logo";
import styles from "@/components/home/VectantHome.module.css";
import { PILOT_MAILTO } from "@/lib/pilot";

const CAPABILITIES = [
  "Codex",
  "Claude Code",
  "Terminal agents",
  "MCP tools",
  "VS Code extensions",
  "Cloud workspaces",
  "Mutation leases",
  "Replay ledgers",
  "GPU HMR",
];

const FAQ = [
  {
    question: "Does Vectant replace our coding agents?",
    answer: "No. Vectant is the governed runtime around them. Keep Codex, Claude Code, terminal agents, or your own stack while Vectant manages workspace state, authority, and proof.",
  },
  {
    question: "What does a proof pilot include?",
    answer: "We connect a guarded repository or compiled system, define the mutation boundary, run real agent work, and hand back the evidence needed to review what happened.",
  },
  {
    question: "Is GPU HMR limited to ROCm/HIP?",
    answer: "The public visual proof is ROCm/HIP. CUDA and other native routes are validated in hardware-backed pilots against the same state, ABI, output, and promotion gates.",
  },
  {
    question: "Can humans and agents share one workspace?",
    answer: "Yes. Shared rooms keep presence, routes, claims, conflicts, runtime state, and handoff context in the same governed session.",
  },
];

function ProductManifesto() {
  const items = [...CAPABILITIES, ...CAPABILITIES];

  return (
    <section id="runtime" className={styles.runInterlude}>
      <div className={styles.runInterludeShell}>
        <div className={styles.runInterludeCopy}>
          <h2>The run is the unit of work.</h2>
          <p>Chats disappear. A run keeps authority, runtime state, artifacts, decisions, and the reviewer’s path back to the evidence.</p>
        </div>

        <figure className={styles.runInterludeMedia}>
          <Image
            src="/product-proof/browser-workflow-observe-ui.png"
            alt="Vectant workflow controls for runtime, observation, trace, contract, and replay"
            fill
            sizes="(min-width: 1000px) 42vw, 100vw"
            className={styles.runInterludeImage}
          />
        </figure>
      </div>

      <div className={styles.systemsTrack} aria-label="Agents and systems supported by the Vectant runtime">
        <div className={styles.systemsTrackInner}>
          {items.map((item, index) => (
            <span key={`${item}-${index}`} aria-hidden={index >= CAPABILITIES.length ? "true" : undefined}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className={styles.faqCinema}>
      <div className={styles.faqCinemaShell}>
        <div className={styles.faqCinemaIntro}>
          <h2>What serious teams ask first.</h2>
          <p>Concrete answers for the people responsible for what reaches production.</p>
        </div>
        <div className={styles.faqCinemaList}>
          {FAQ.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}<span aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="pricing" className={styles.finalScene}>
      <div id="waitlist" className={styles.finalSceneInner}>
        <Image
          src="/product-proof/senior-real-codesite-workflow-proof.png"
          alt=""
          fill
          sizes="100vw"
          className={styles.finalSceneImage}
        />
        <div className={styles.finalSceneScrim} aria-hidden="true" />
        <div className={styles.finalSceneAperture} aria-hidden="true">
          <VectantMark gradientId="final-vectant-mark" className={styles.finalSceneMark} />
        </div>
        <div className={styles.finalSceneCopy}>
          <h2>Bring the repo you still will not hand to an agent.</h2>
          <p>Vectant will make its boundary, live state, and proof path visible.</p>
          <a href={PILOT_MAILTO} className={styles.finalSceneAction}>Request pilot</a>
        </div>
      </div>
    </section>
  );
}

export function VectantLanding() {
  return (
    <main id="main-content" className={styles.page}>
      <CinematicHero />
      <ProductManifesto />
      <AuthorityStory />
      <GpuProofChapter />
      <RuntimeFeedback />
      <FaqSection />
      <FinalCta />
    </main>
  );
}
