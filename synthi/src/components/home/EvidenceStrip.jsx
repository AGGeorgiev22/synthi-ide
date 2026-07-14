import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { AGENTS } from "@/components/AgentMarks";
import styles from "@/components/home/EvidenceStrip.module.css";

const EVIDENCE_LINKS = [
  {
    key: "sample",
    label: "Sample guarded run",
    value: "Boundary, denied write, approval, and replay",
    href: "#guarded-run",
  },
  {
    key: "bundle",
    label: "Proof bundle",
    value: "Plan, provenance, runtime events, and export",
    href: "#proof",
  },
  {
    key: "controls",
    label: "Technical controls",
    value: "Permissions, retention, deployment, and audit",
    href: "#technical-confidence",
  },
  {
    key: "data",
    label: "Data handling",
    value: "Published pilot privacy and connected-service scope",
    href: "/privacy",
  },
  {
    key: "performance",
    label: "Measured GPU HMR proof",
    value: "Under 90 ms edit-to-visual on the shown run",
    href: "#gpu-hmr",
  },
];

export function EvidenceStrip() {
  return (
    <section className={styles.evidence} aria-labelledby="evidence-title">
      <div className={styles.evidenceShell}>
        <header className={styles.evidenceHeader}>
          <h2 id="evidence-title">Inspect the system before the pilot.</h2>
          <p>Every claim below points to the product surface or policy that supports it.</p>
        </header>

        <div className={styles.evidenceGrid}>
          <article className={`${styles.evidenceCell} ${styles.agentCell}`}>
            <div>
              <span>Supported agent clients</span>
              <strong>Bring the agent stack you already use.</strong>
            </div>
            <ul aria-label="Supported agent clients">
              {AGENTS.map(({ name, Mark }) => (
                <li key={name} aria-label={name} title={name}>
                  <Mark size={20} />
                </li>
              ))}
            </ul>
          </article>

          {EVIDENCE_LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`${styles.evidenceCell} ${styles[item.key]}`}
            >
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <i aria-hidden="true"><ArrowUpRight size={16} weight="bold" /></i>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
