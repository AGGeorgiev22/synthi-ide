import Image from "next/image";
import Link from "next/link";
import {
  Buildings,
  FlowArrow,
  HardDrives,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

import styles from "@/components/home/EnterpriseConfidence.module.css";

const GROUPS = [
  {
    key: "data",
    title: "Data boundary",
    status: "Defined before access",
    Icon: HardDrives,
    items: [
      [
        "What leaves the environment",
        "The pilot contract must list every model, MCP server, tool, or service allowed to receive data. The public sample invokes no external service.",
      ],
      [
        "What is retained",
        "Workspace content, proof records, operational logs, export timing, deletion triggers, backup expiry, and permitted holds are recorded as separate terms before access.",
      ],
    ],
  },
  {
    key: "authority",
    title: "Authority controls",
    status: "Public schema · pilot-scoped",
    Icon: ShieldCheck,
    items: [
      [
        "Models and MCP servers",
        "The public schema supports an explicit allow-list. Actual exclusions and enforcement depth must be validated in the signed pilot boundary.",
      ],
      [
        "Permission scope",
        "The sample records read, write, path, runtime, and time conditions plus an expiring one-use lease. Buyer-specific behavior is a pilot success criterion.",
      ],
    ],
  },
  {
    key: "evidence",
    title: "Evidence and deployment",
    status: "Public sample · validate in pilot",
    Icon: FlowArrow,
    items: [
      [
        "Replay and export",
        "The downloadable sample orders actions, denial, escalation, approval, patches, runtime events, verification, and hashes. A buyer run must reproduce the agreed export.",
      ],
      [
        "Deployment today",
        "The public pilot format is a Vectant-managed isolated workspace. Exact availability and architecture are confirmed in the order form; other models are not advertised as live.",
      ],
    ],
    image: "/product-proof/codesite-line-inspector-ui-desktop.png",
    alt: "Vectant line inspector showing exportable clearance, transaction, event, test, and proof evidence",
  },
  {
    key: "operations",
    title: "Enterprise operations",
    status: "Pilot service · roadmap",
    Icon: Buildings,
    items: [
      [
        "Identity and audit",
        "Run-level evidence is a pilot validation target. SSO, SCIM, and organization-wide administration remain planned and are not sold as live controls.",
      ],
      [
        "Implementation owner",
        "Vectant configures the guarded workflow with your technical owner, documents success criteria, and supports the run through proof handoff.",
      ],
    ],
  },
];

export function EnterpriseConfidence() {
  return (
    <section id="technical-confidence" className={styles.confidence} aria-labelledby="confidence-title">
      <div className={styles.confidenceShell}>
        <header className={styles.confidenceHeader}>
          <h2 id="confidence-title">Know what crosses the boundary.</h2>
          <p>
            Public sample behavior, buyer-specific pilot validation, and planned enterprise features are labeled separately.
            Review the <Link href="/docs">technical reference</Link> and <Link href="/privacy">data policy</Link> before access is granted.
          </p>
        </header>

        <div className={styles.confidenceGrid}>
          {GROUPS.map(({ key, title, status, Icon, items, image, alt }) => (
            <article key={key} className={styles.confidenceCell} data-cell={key}>
              <div className={styles.confidenceInner}>
                <header>
                  <span><Icon size={19} weight="light" aria-hidden="true" /></span>
                  <div>
                    <h3>{title}</h3>
                    <p>{status}</p>
                  </div>
                </header>

                {image ? (
                  <figure>
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      quality={95}
                      sizes="(max-width: 600px) calc(100vw - 4.3rem), (max-width: 900px) 50vw, 56vw"
                    />
                  </figure>
                ) : null}

                <dl>
                  {items.map(([term, detail]) => (
                    <div key={term}>
                      <dt>{term}</dt>
                      <dd>{detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
