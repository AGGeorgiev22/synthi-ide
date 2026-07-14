"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  ArrowsOutCardinal,
  Database,
  PaperPlaneTilt,
  ShippingContainer,
} from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { AGENTS } from "@/components/AgentMarks";
import styles from "@/components/home/ControlPlaneAtlas.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SYSTEMS = [
  "CodeSite",
  "Counterfactual Memory",
  "Agent Tomography",
  "Workspace Programs",
  "Open Control Plane",
];

const PROGRAMS = [
  { name: "DBeaver", detail: "Database", Icon: Database },
  { name: "Postman", detail: "API", Icon: PaperPlaneTilt },
  { name: "Portainer", detail: "Containers", Icon: ShippingContainer },
  { name: "Custom image", detail: "Docker", Icon: ArrowsOutCardinal },
];

function SystemMode({ children, tone = "live" }) {
  return (
    <p className={styles.systemMode} data-tone={tone}>
      <i aria-hidden="true" />
      {children}
    </p>
  );
}

function MechanismRail({ items }) {
  return (
    <ul className={styles.mechanismRail}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export function ControlPlaneAtlas() {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const cameraRefs = useRef([]);
  const indexRefs = useRef([]);
  const scanRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = panelRefs.current.filter(Boolean);
        const cameras = cameraRefs.current.filter(Boolean);
        const indexes = indexRefs.current.filter(Boolean);

        gsap.set(panels, { autoAlpha: 0, scale: 1.018, yPercent: 5 });
        gsap.set(panels[0], { autoAlpha: 1, scale: 1, yPercent: 0 });
        gsap.set(cameras, { scale: 1.07 });
        gsap.set(indexes, { opacity: 0.3 });
        gsap.set(indexes[0], { opacity: 1 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.62,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .addLabel("codesite", 0)
          .to(cameras[0], { scale: 1, duration: 0.72, ease: "power2.out" }, "codesite")
          .to({}, { duration: 0.48 });

        for (let index = 1; index < panels.length; index += 1) {
          const label = `system-${index}`;
          timeline
            .addLabel(label)
            .to(
              panels[index - 1],
              { autoAlpha: 0, scale: 0.986, yPercent: -4, duration: 0.2, ease: "power2.in" },
              label,
            )
            .fromTo(
              panels[index],
              { autoAlpha: 0, scale: 1.018, yPercent: 5 },
              { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.32, ease: "power3.out" },
              `${label}+=0.12`,
            )
            .to(indexes[index - 1], { opacity: 0.3, duration: 0.16 }, label)
            .to(indexes[index], { opacity: 1, duration: 0.2 }, `${label}+=0.12`)
            .to(cameras[index], { scale: 1, duration: 0.7, ease: "power2.out" }, `${label}+=0.12`)
            .to({}, { duration: 0.46 });
        }

        timeline.fromTo(
          scanRef.current,
          { yPercent: -120, autoAlpha: 0 },
          { yPercent: 420, autoAlpha: 1, duration: 0.56, ease: "none" },
          "system-2+=0.12",
        );

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="systems" ref={rootRef} className={styles.atlas} data-film-act="system-atlas">
      <div className={styles.atlasStage}>
        <div className={styles.atlasHeader}>
          <span>Vectant system atlas</span>
          <strong>One control plane around every agent.</strong>
        </div>

        <ol className={styles.atlasIndex} aria-label="Control plane systems">
          {SYSTEMS.map((system, index) => (
            <li key={system} ref={(node) => { indexRefs.current[index] = node; }}>
              <i aria-hidden="true" />
              <span>{system}</span>
            </li>
          ))}
        </ol>

        <div className={styles.atlasPanels}>
          <article
            ref={(node) => { panelRefs.current[0] = node; }}
            className={`${styles.atlasPanel} ${styles.codeSitePanel}`}
          >
            <div
              ref={(node) => { cameraRefs.current[0] = node; }}
              className={`${styles.systemCamera} ${styles.codeSiteCamera}`}
            >
              <Image
                src="/product-proof/codesite-line-inspector-ui-desktop.png"
                alt="CodeSite line inspector linking an approved change to its clearance, transaction, event, tests, and proof"
                fill
                sizes="100vw"
                className={styles.systemImage}
              />
            </div>
            <div className={styles.systemCopy}>
              <SystemMode>Live control system</SystemMode>
              <h2>Air traffic control for AI coding agents.</h2>
              <p>
                Every agent gets a flight plan. Shared paths become controlled airspace. CodeSite holds conflicting work, inspects the landing, and preserves the black box.
              </p>
              <strong>The transaction layer for AI-generated code changes.</strong>
            </div>
            <MechanismRail items={["Flight plans", "Mutation leases", "Collision forecast", "Line provenance"]} />
          </article>

          <article
            ref={(node) => { panelRefs.current[1] = node; }}
            className={`${styles.atlasPanel} ${styles.memoryPanel}`}
          >
            <div className={styles.memoryCopy}>
              <SystemMode tone="proof">Validated proof path</SystemMode>
              <h2>The path that did not ship still has signal.</h2>
              <p>
                Vectant records comparable agent paths that did not land, then turns promoted near-miss evidence into policy for the next route.
              </p>
              <strong>Counterfactual telemetry, not vibes.</strong>
            </div>
            <div
              ref={(node) => { cameraRefs.current[1] = node; }}
              className={`${styles.systemCamera} ${styles.memoryCamera}`}
            >
              <Image
                src="/product-proof/codesite-counterfactual-memory-proof.png"
                alt="Validated CodeSite counterfactual memory proof showing a promoted policy delta changing a later tower decision"
                fill
                sizes="(max-width: 767px) 100vw, 58vw"
                className={`${styles.systemImage} ${styles.memoryImage}`}
              />
            </div>
            <MechanismRail items={["Comparable choice scene", "Near-miss evidence", "Governed policy delta", "Future hold"]} />
          </article>

          <article
            ref={(node) => { panelRefs.current[2] = node; }}
            className={`${styles.atlasPanel} ${styles.tomographyPanel}`}
          >
            <div className={styles.tomographyCopy}>
              <SystemMode tone="direction">Design direction</SystemMode>
              <h2>Prove why less is insufficient.</h2>
              <p>
                Before an agent sees more, Agent Therapeutic Tomography treats authority as a measured dose: aggregate before raw, read before write, temporary before persistent.
              </p>
              <strong>Minimum effective authority. Maximum retained proof.</strong>
            </div>

            <div
              ref={(node) => { cameraRefs.current[2] = node; }}
              className={`${styles.systemCamera} ${styles.tomographyField}`}
              role="img"
              aria-label="Therapeutic Tomography design direction: escalate from an aggregate projection to a scoped read and then a temporary write only when evidence proves the smaller dose is insufficient"
            >
              <div className={styles.tomographyCorridor} aria-hidden="true">
                <i />
                <i />
                <span ref={scanRef} />
              </div>
              <ol className={styles.doseLadder}>
                <li><b>01</b><span>Aggregate projection</span><em>lowest exposure</em></li>
                <li><b>02</b><span>Scoped read</span><em>evidence required</em></li>
                <li><b>03</b><span>Temporary write</span><em>separate proof gate</em></li>
              </ol>
              <div className={styles.proofReadout}>
                <span>Uncertainty reduced</span>
                <strong>Scoped read approved</strong>
                <small>Temporary · revocable · evidence linked</small>
              </div>
            </div>
          </article>

          <article
            ref={(node) => { panelRefs.current[3] = node; }}
            className={`${styles.atlasPanel} ${styles.programsPanel}`}
          >
            <div
              ref={(node) => { cameraRefs.current[3] = node; }}
              className={`${styles.systemCamera} ${styles.programsCamera}`}
            >
              <Image
                src="/product-proof/investor-demo-workspace.png"
                alt="Vectant workspace with the integrated editor, terminal, runtime status, and workspace controls"
                fill
                sizes="100vw"
                className={styles.systemImage}
              />
            </div>
            <div className={styles.programsCopy}>
              <SystemMode>Isolated workspace runtime</SystemMode>
              <h2>Your workspace is not a preview. It is a machine.</h2>
              <p>
                Run DBeaver, Postman, Portainer, and your own Docker images beside the code. Desktop-class tools stream from the isolated per-workspace runtime, not your laptop.
              </p>
              <strong>Same files. Same runtime. Same operational feel.</strong>
            </div>
            <ul className={styles.programDock} aria-label="Workspace program examples">
              {PROGRAMS.map(({ name, detail, Icon }) => (
                <li key={name}>
                  <Icon size={20} weight="light" aria-hidden="true" />
                  <span><strong>{name}</strong><small>{detail}</small></span>
                </li>
              ))}
            </ul>
          </article>

          <article
            ref={(node) => { panelRefs.current[4] = node; }}
            className={`${styles.atlasPanel} ${styles.openPanel}`}
          >
            <div
              ref={(node) => { cameraRefs.current[4] = node; }}
              className={`${styles.systemCamera} ${styles.openCamera}`}
            >
              <Image
                src="/product-proof/investor-demo-workflows.png"
                alt="Vectant workspace with an attached runtime workflow, observable steps, replay, and export controls"
                fill
                sizes="100vw"
                className={styles.systemImage}
              />
            </div>
            <div className={styles.openCopy}>
              <SystemMode tone="open">Open control plane</SystemMode>
              <h2>Bring the agent. Keep the environment.</h2>
              <p>
                Vectant speaks MCP to the agents you already use. Full VSIX hosting routes web extensions into hardened workers and Node-only packages into a real VS Code Extension Host.
              </p>
              <strong>Move every surface. Save every layout. Replace none of your judgment.</strong>
            </div>
            <ul className={styles.agentRail} aria-label="Compatible agent clients">
              {AGENTS.map(({ name, Mark }) => (
                <li key={name}>
                  <Mark size={19} />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
            <MechanismRail items={["MCP", "Full VSIX host", "Split · float · pop out", "Saved profiles"]} />
          </article>
        </div>
      </div>
    </section>
  );
}
