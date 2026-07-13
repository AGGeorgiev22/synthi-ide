import Image from "next/image";

import { AgentWorkbench, PilotArrow } from "@/components/home/AgentWorkbench";
import { AuthorityStory } from "@/components/home/AuthorityStory";
import { GpuProofChapter } from "@/components/home/GpuProofChapter";
import { RuntimeFeedback } from "@/components/home/RuntimeFeedback";
import styles from "@/components/home/VectantHome.module.css";

const PILOT_EMAIL = "aleksandar.kolev@vectant.dev";
const PILOT_MAILTO = `mailto:${PILOT_EMAIL}?subject=${encodeURIComponent("Vectant proof pilot")}&body=${encodeURIComponent(
  "Hi Aleksandar,\n\nWe are interested in running a Vectant proof pilot for our company.\n\nCompany:\nRepo or system to pilot:\nWhat our agents are blocked from landing safely today:\n"
)}`;

const CAPABILITIES = [
  "Any coding agent",
  "Cloud workspaces",
  "MCP eyes and hands",
  "Mutation leases",
  "Replay ledgers",
  "GPU HMR proof",
  "VS Code extensions",
  "Shared agent rooms",
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

function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={`${styles.sectionShell} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>
            Run more agents. <span className={styles.heroTitleAccent}>Lose less control.</span>
          </h1>
          <p className={styles.heroBody}>
            Run coding agents in parallel while Vectant scopes authority, preserves runtime state, and gathers proof for review.
          </p>
          <div className={styles.heroActions}>
            <a href={PILOT_MAILTO} className={styles.primaryButton}>
              Request pilot
              <span className={styles.buttonIcon}>
                <PilotArrow />
              </span>
            </a>
            <a href="#runtime-path" className={styles.secondaryButton}>See proof</a>
          </div>
        </div>
        <AgentWorkbench />
      </div>
    </section>
  );
}

function ProductManifesto() {
  const items = [...CAPABILITIES, ...CAPABILITIES];

  return (
    <section id="runtime" className={styles.sectionShell}>
      <div className={styles.manifesto}>
        <h2>The run is the unit of work.</h2>
        <p>Chats disappear. Runs keep authority, live state, artifacts, decisions, and the reviewer’s path back to the evidence.</p>
      </div>

      <div className={styles.marquee} aria-label="Vectant runtime capabilities">
        <div className={styles.marqueeTrack}>
          {items.map((item, index) => (
            <span key={`${item}-${index}`} className={styles.marqueeItem} aria-hidden={index >= CAPABILITIES.length ? "true" : undefined}>
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
    <section id="faq" className={styles.chapter}>
      <div className={styles.sectionShell}>
        <h2 className={styles.chapterTitle}>The questions serious teams ask first.</h2>
        <div className={styles.faq}>
          {FAQ.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}</summary>
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
    <section id="pricing" className={`${styles.chapter} px-2 sm:px-4`}>
      <div id="waitlist" className={`${styles.ctaShell} ${styles.sectionShell}`}>
        <Image
          src="/visuals/vectant-authority-aperture.png"
          alt=""
          fill
          sizes="(min-width: 1500px) 1500px, 100vw"
          className={styles.ctaImage}
        />
        <div className={styles.ctaScrim} aria-hidden="true" />
        <div className={styles.closingGrid}>
          <div>
            <h2>Give the next agent a boundary worth trusting.</h2>
            <p>Bring the repository your team is not ready to hand to an autonomous agent. Vectant will make the control model visible.</p>
            <div className={styles.heroActions}>
              <a href={PILOT_MAILTO} className={styles.primaryButton}>
                Request pilot
                <span className={styles.buttonIcon}><PilotArrow /></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function VectantLanding() {
  return (
    <main id="main-content" className={styles.page}>
      <Hero />
      <ProductManifesto />
      <AuthorityStory />
      <GpuProofChapter />
      <RuntimeFeedback />
      <FaqSection />
      <FinalCta />
    </main>
  );
}
