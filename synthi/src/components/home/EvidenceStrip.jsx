import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { AGENTS } from "@/components/AgentMarks";
import styles from "@/components/home/EvidenceStrip.module.css";

const EVIDENCE_LINKS = [
  {
    key: "performance",
    label: "Verified evidence integrity",
    value: "9 / 9 public bundle artifacts match their published SHA-256 digests",
    href: "/sample-proof/integrity-report.json",
  },
  {
    key: "sample",
    label: "Sample guarded run",
    value: "Boundary, denied write, approval, and replay",
    href: "#guarded-run",
  },
  {
    key: "bundle",
    label: "Download sample proof",
    value: "Plan, provenance, runtime events, decision trail, and methodology",
    href: "/sample-guarded-run-proof.json",
    download: true,
  },
  {
    key: "controls",
    label: "Technical reference",
    value: "Run schema, decision states, boundaries, export, and availability",
    href: "/docs",
  },
  {
    key: "data",
    label: "Data handling",
    value: "Published pilot privacy and connected-service scope",
    href: "/privacy",
  },
];

export function EvidenceStrip() {
  return (
    <section className={styles.evidence} aria-labelledby="evidence-title">
      <div className={styles.evidenceShell}>
        <header className={styles.evidenceHeader}>
          <h2 id="evidence-title">Inspect the system before the pilot.</h2>
          <p>Public samples, policy, pilot-scoping examples, and measured evidence are labeled by what they prove.</p>
        </header>

        <div className={styles.evidenceGrid}>
          <article className={`${styles.evidenceCell} ${styles.agentCell}`}>
            <div>
              <span>Pilot-scoped integrations</span>
              <strong>No generally supported list is claimed yet. Candidate paths are validated per pilot.</strong>
            </div>
            <ul aria-label="Candidate agent clients to validate for a pilot">
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
              download={item.download || undefined}
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
