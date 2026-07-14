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
    status: "Configured per pilot",
    Icon: HardDrives,
    items: [
      [
        "What leaves the environment",
        "Data can leave only when an authorized connected model, MCP server, or service is invoked. Each integration flow is documented during scoping.",
      ],
      [
        "What is retained",
        "Workspace content and operational records follow the signed pilot agreement, security needs, and published privacy policy. Retention is not hidden behind a default claim.",
      ],
    ],
  },
  {
    key: "authority",
    title: "Authority controls",
    status: "Live in pilot",
    Icon: ShieldCheck,
    items: [
      [
        "Models and MCP servers",
        "Allowed models, servers, tools, and connected services are chosen before the run and can be excluded from the workspace contract.",
      ],
      [
        "Permission scope",
        "Read, write, path, runtime, and time limits attach as explicit conditions. Temporary leases expire instead of silently becoming permanent access.",
      ],
    ],
  },
  {
    key: "evidence",
    title: "Evidence and deployment",
    status: "Live in pilot",
    Icon: FlowArrow,
    items: [
      [
        "Replay and export",
        "Allowed actions, denied writes, escalations, approvals, provenance, and runtime events remain ordered and exportable with the change.",
      ],
      [
        "Deployment today",
        "The current pilot runs in a Vectant-managed isolated workspace. Additional deployment models are scoped explicitly and are not presented as generally available.",
      ],
    ],
    image: "/product-proof/codesite-line-inspector-ui-desktop.png",
    alt: "Vectant line inspector showing exportable clearance, transaction, event, test, and proof evidence",
  },
  {
    key: "operations",
    title: "Enterprise operations",
    status: "Live and planned",
    Icon: Buildings,
    items: [
      [
        "Identity and audit",
        "Run-level audit evidence is available in the pilot. SSO, SCIM, and organization-wide administration are planned and are not sold as live controls.",
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
            Live controls, per-pilot configuration, and planned enterprise features are labeled separately.
            Review the full <Link href="/privacy">data policy</Link> before access is granted.
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
                    <Image src={image} alt={alt} fill sizes="(max-width: 767px) 100vw, 44vw" />
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
