import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { AGENTS } from "@/components/AgentMarks";
import styles from "@/components/home/EvidenceStrip.module.css";

const EVIDENCE_LINKS = [
  {
    key: "dojo",
    label: "Teach once · prove before reuse",
    value: "Turn a reviewed workflow into a testable agent skill before it is allowed near real work",
    href: "/evidence/agent-dojo-maturity.json",
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
    value: "What changed, what was denied, who approved it, and how the result was verified",
    href: "/sample-guarded-run-proof.json",
    download: true,
  },
  {
    key: "performance",
    label: "Files you can verify",
    value: "All 9 public proof files match their published SHA-256 fingerprints",
    href: "/sample-proof/integrity-report.json",
  },
  {
    key: "controls",
    label: "How a guarded run works",
    value: "See the boundary, decision states, evidence record, export, and current availability",
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
          <h2 id="evidence-title">See the proof before the pilot.</h2>
          <p>Open the build record, replay a guarded run, and verify the files yourself. Every claim says what it proves and what it does not.</p>
        </header>

        <div className={styles.evidenceGrid}>
          <article className={`${styles.evidenceCell} ${styles.buildProof}`}>
            <div className={styles.buildProofCopy}>
              <span>A real build record · method attached</span>
              <h3>One session. Hard systems-level code.</h3>
              <Link href="/evidence/build-session-methodology.json" className={styles.buildProofLink}>
                Inspect the commit method
                <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </Link>
            </div>

            <dl className={styles.buildProofStats}>
              <div>
                <dt>Continuous days</dt>
                <dd>34</dd>
              </div>
              <div>
                <dt>Production commits</dt>
                <dd>3.8k</dd>
              </div>
            </dl>
          </article>

          <Link
            href="/evidence/mcp-runtime-evidence.json"
            className={`${styles.evidenceCell} ${styles.agentCell}`}
          >
            <div>
              <span>Let your agent see and operate the live app</span>
              <strong>Vectant lets coding agents watch fresh app state, click, type, and replay approved workflows without replacing the editor they already use.</strong>
            </div>
            <ul aria-label="Agent clients Vectant MCP is designed to complement">
              {AGENTS.map(({ name, Mark }) => (
                <li key={name} aria-label={name} title={name}>
                  <Mark size={20} />
                </li>
              ))}
            </ul>
            <i aria-hidden="true"><ArrowUpRight size={16} weight="bold" /></i>
          </Link>

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
