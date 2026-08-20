import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { AnimatedLogo } from "@/components/Logo";
import { PILOT_MAILTO } from "@/lib/pilot";
import { SITE_SOCIAL_IMAGE } from "@/lib/seo";

import styles from "./docs.module.css";

export const metadata = {
  title: "Technical reference for agent runtime control | Vectant",
  description:
    "The public Vectant reference for guarded runs, scoped agent authority, recorded decisions, proof exports, and pilot availability.",
  alternates: { canonical: "/docs" },
  openGraph: {
    type: "website",
    url: "/docs",
    title: "Technical reference for agent runtime control | Vectant",
    description:
      "The public Vectant reference for guarded runs, scoped agent authority, recorded decisions, proof exports, and pilot availability.",
    images: [SITE_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical reference for agent runtime control | Vectant",
    description:
      "The public Vectant reference for guarded runs, scoped agent authority, recorded decisions, proof exports, and pilot availability.",
    images: [SITE_SOCIAL_IMAGE.url],
  },
};

const RUN_FIELDS = [
  ["runId", "Stable identifier shared by the boundary, events, change, and export."],
  ["sequence", "Monotonic order within one run; never inferred from screen position."],
  ["actor", "Human, agent, model, tool, MCP server, or connected service that requested the action."],
  ["action + target", "The requested operation and the exact resource or path it addresses."],
  ["authority", "The matching read, write, path, runtime, tool, and time conditions."],
  ["decision + reason", "Allowed, blocked, escalated, or approved, with the evaluated reason attached."],
  ["evidence", "References to the diff, command output, runtime event, review, and resulting artifact."],
];

const STATES = [
  ["01", "Allowed", "The request fits the attached boundary and continues without widening authority."],
  ["02", "Blocked", "The request is retained with its target, failed condition, and reason; no mutation proceeds."],
  ["03", "Escalated", "A reviewer receives the proposed action and its evidence without granting blanket access."],
  ["04", "Approved", "Only the reviewed operation resumes under a temporary, expiring lease."],
];

const BOUNDARY = [
  ["Repository and environment", "Named repository, branch or workspace, runtime, and non-production environment."],
  ["Agents and connected tools", "Allowed clients, models, MCP servers, commands, and external services are enumerated during pilot scoping."],
  ["Action scope", "Read, write, execute, network, path, runtime, and review conditions are recorded explicitly."],
  ["Lifetime", "Run limits and temporary leases expire; a pilot agreement defines session and record retention."],
  ["Exit evidence", "The approved change and rejected branch leave with ordered decisions, runtime evidence, and verification output."],
];

const AVAILABILITY = [
  {
    status: "Public sample",
    title: "Inspectable now",
    items: ["Guarded-run replay interface", "Versioned sample proof record", "Boundary and decision schema", "GPU measurement methodology"],
  },
  {
    status: "Configured per pilot",
    title: "Scoped before access",
    items: ["Workspace and repository boundary", "Agent, model, tool, and MCP allow-list", "Success criteria and proof handoff", "Retention and deletion schedule"],
  },
  {
    status: "Planned",
    title: "Not sold as live",
    items: ["SSO and SCIM", "Organization-wide administration", "Additional deployment models", "General-availability commitments"],
  },
];

export default function DocsPage() {
  return (
    <main className={styles.page} id="top">
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Vectant home">
          <AnimatedLogo expanded={false} className={styles.logo} markClassName={styles.mark} />
        </Link>
        <nav aria-label="Technical reference navigation">
          <Link href="/blog">Blog</Link>
          <Link href="/privacy">Data policy</Link>
          <a href={PILOT_MAILTO}>Scope a pilot</a>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="docs-title">
        <div>
          <p>Public pilot reference · v1.0</p>
          <h1 id="docs-title">The run is the unit of proof.</h1>
        </div>
        <div className={styles.heroAside}>
          <p>
            This reference defines the public sample contract: what is bounded before execution,
            which decisions are recorded, and what must leave together after a guarded run.
          </p>
          <a href="#run-record">
            Read the contract
            <ArrowDown size={16} weight="bold" />
          </a>
        </div>
      </section>

      <div className={styles.referenceGrid}>
        <aside className={styles.index} aria-label="On this page">
          <p>Reference index</p>
          <nav>
            <a href="#run-record"><span>01</span> Run record</a>
            <a href="#decisions"><span>02</span> Decision states</a>
            <a href="#boundary"><span>03</span> Boundary contract</a>
            <a href="#export"><span>04</span> Proof export</a>
            <a href="#availability"><span>05</span> Availability</a>
          </nav>
        </aside>

        <div className={styles.reference}>
          <section id="run-record" className={styles.section}>
            <header>
              <span>01 / Run record</span>
              <h2>One identifier joins request, decision, change, and result.</h2>
              <p>A screenshot is supporting evidence, not the record. The record is ordered, addressable, and exportable.</p>
            </header>
            <dl className={styles.fieldList}>
              {RUN_FIELDS.map(([term, detail]) => (
                <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>
              ))}
            </dl>
          </section>

          <section id="decisions" className={styles.section}>
            <header>
              <span>02 / Decision states</span>
              <h2>Refusal stays visible.</h2>
              <p>The safe path and rejected path remain part of the same run instead of collapsing into a success-only summary.</p>
            </header>
            <ol className={styles.stateList}>
              {STATES.map(([number, state, detail]) => (
                <li key={state}><span>{number}</span><strong>{state}</strong><p>{detail}</p></li>
              ))}
            </ol>
          </section>

          <section id="boundary" className={styles.section}>
            <header>
              <span>03 / Boundary contract</span>
              <h2>Authority attaches before the first mutation.</h2>
              <p>Every pilot contract is reviewed with the technical owner before credentials or workspace access are granted.</p>
            </header>
            <dl className={styles.boundaryList}>
              {BOUNDARY.map(([term, detail]) => (
                <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>
              ))}
            </dl>
          </section>

          <section id="export" className={styles.section}>
            <header>
              <span>04 / Proof export</span>
              <h2>The evidence leaves as a bundle, not a claim.</h2>
              <p>
                The public file is a synthetic demonstration record. It contains a boundary snapshot,
                ordered action events, approval lease, patch, runtime signals, verification result,
                measurement context, hashes, and explicit sample notices.
              </p>
            </header>
            <div className={styles.exportCard}>
              <div>
                <p>vectant.sample-proof.v2</p>
                <strong>VCT-SAMPLE-001</strong>
              </div>
              <a href="/sample-guarded-run-proof.json" download>
                Download JSON
                <ArrowUpRight size={17} weight="bold" />
              </a>
            </div>
            <p className={styles.caveat}>
              Browser automation and MCP connectivity provide tools; they are not treated here as a security boundary.
              The pilot contract must still define authority, review, retention, and evidence around every connected surface.
            </p>
          </section>

          <section id="availability" className={styles.section}>
            <header>
              <span>05 / Availability</span>
              <h2>Current, scoped, and planned are different states.</h2>
              <p>The public site does not turn a roadmap item into a live control.</p>
            </header>
            <div className={styles.availabilityGrid}>
              {AVAILABILITY.map((group) => (
                <article key={group.status}>
                  <span>{group.status}</span>
                  <h3>{group.title}</h3>
                  <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer className={styles.footer}>
        <Link href="/"><ArrowLeft size={15} weight="bold" /> Back to product</Link>
        <p>Last updated <time dateTime="2026-07-14">14 July 2026</time></p>
      </footer>
    </main>
  );
}
