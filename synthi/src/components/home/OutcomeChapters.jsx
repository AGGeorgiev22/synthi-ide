"use client";

import { useState } from "react";
import Image from "next/image";
import { CaretRight } from "@phosphor-icons/react";

import styles from "@/components/home/OutcomeChapters.module.css";

const OUTCOMES = [
  {
    key: "collisions",
    title: "Prevent collisions",
    short: "Collisions",
    mechanism: "Shared paths are reserved before two agents mutate them at once.",
    outcome: "Parallel work keeps moving without silent overwrite or reconstructing merge history.",
    artifact: "Collision forecast, mutation lease, and landing queue",
    image: "/codesite-proof/codesite-radar-desktop.png",
    alt: "Vectant collision radar forecasting agent work before protected paths overlap",
  },
  {
    key: "runtime",
    title: "Keep runtime state live",
    short: "Live state",
    mechanism: "Agents and reviewers share the same isolated environment, tools, and observable state.",
    outcome: "A handoff continues from the actual machine instead of a stale chat summary.",
    artifact: "Hosted runtime, observation stream, and workspace program state",
    image: "/product-proof/browser-workflow-observe-ui.png",
    alt: "Vectant workspace with a hosted runtime, observation controls, and live environment state",
  },
  {
    key: "authority",
    title: "Limit agent authority",
    short: "Authority",
    mechanism: "Read, write, model, server, and path access are attached as explicit run conditions.",
    outcome: "Autonomy expands only when the smaller scope cannot complete the reviewed task.",
    artifact: "Scoped permissions, temporary leases, and a visible kill path",
    image: "/product-proof/codesite-line-inspector-ui-desktop.png",
    alt: "Vectant line inspector showing scoped authority, transaction state, evidence, and rationale",
  },
  {
    key: "replay",
    title: "Replay every decision",
    short: "Replay",
    mechanism: "Allowed work, denied writes, escalations, approvals, and runtime events keep their order.",
    outcome: "Reviewers can reconstruct why a change landed without rebuilding intent from transcripts.",
    artifact: "Black Box event order, provenance, and proof export",
    image: "/codesite-proof/codesite-black-box-desktop.png",
    alt: "Vectant Black Box preserving denied writes, approval decisions, and ordered replay",
  },
  {
    key: "agents",
    title: "Bring your own agent",
    short: "Your agent",
    mechanism: "Each pilot scopes the exact client path you bring—such as Codex, Claude Code, Cursor, Gemini CLI, or an internal runner.",
    outcome: "Teams can evaluate a control plane around an existing workflow without a universal-connector promise.",
    artifact: "Pilot integration contract, allowed tools, and validation criteria",
    image: "/product-proof/investor-demo-workflows.png",
    alt: "Vectant workflow surface with connected agent tools, replay, and export controls",
  },
];

export function OutcomeChapters() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="systems"
      className={styles.outcomes}
      aria-labelledby="outcomes-title"
    >
      <div className={styles.outcomesShell}>
        <header className={styles.outcomesHeader}>
          <h2 id="outcomes-title">
            Five outcomes.
            One control plane.
          </h2>
          <p>Open a chapter to inspect the mechanism, the buyer result, and the artifact that proves it.</p>
        </header>

        <div className={styles.accordion} role="list">
          {OUTCOMES.map((outcome, index) => {
            const isActive = index === active;
            return (
              <article
                key={outcome.key}
                role="listitem"
                className={styles.outcome}
                data-active={isActive}
                onMouseEnter={() => setActive(index)}
                onFocusCapture={() => setActive(index)}
              >
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`outcome-${outcome.key}`}
                  onClick={() => setActive(index)}
                >
                  <span>{outcome.title}</span>
                  <small>{outcome.short}</small>
                  <CaretRight size={17} weight="bold" aria-hidden="true" />
                </button>

                <div id={`outcome-${outcome.key}`} className={styles.outcomeBody}>
                  <figure>
                    <Image
                      src={outcome.image}
                      alt={outcome.alt}
                      fill
                      quality={95}
                      sizes="(max-width: 767px) calc(100vw - 2rem), 58vw"
                    />
                  </figure>
                  <div className={styles.outcomeCopy}>
                    <p>{outcome.mechanism}</p>
                    <strong>{outcome.outcome}</strong>
                    <span>{outcome.artifact}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
