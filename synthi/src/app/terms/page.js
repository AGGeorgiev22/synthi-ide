import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { AnimatedLogo } from "@/components/Logo";
import { PILOT_EMAIL, PILOT_MAILTO } from "@/lib/pilot";

import styles from "./terms.module.css";

export const metadata = {
  title: "Terms of Service | Vectant",
  description: "The terms that govern access to Vectant and its pilot services.",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    url: "/terms",
    title: "Terms of Service | Vectant",
    description: "The terms that govern access to Vectant and its pilot services.",
  },
};

const SECTIONS = [
  {
    title: "Using Vectant",
    body: "You may use Vectant only for lawful, authorised work and in accordance with these terms. You are responsible for the people, agents, credentials, repositories, and instructions you bring into a workspace.",
  },
  {
    title: "Accounts and access",
    body: "Keep account credentials confidential and tell us promptly if you suspect unauthorised access. We may limit or suspend access when needed to protect the service, its users, or a connected system.",
  },
  {
    title: "Your content",
    body: "You keep ownership of your source code, prompts, files, and other workspace content. You grant Vectant the limited rights needed to host, process, secure, and provide the service to you. We do not claim ownership of your content.",
  },
  {
    title: "Agents and authority",
    body: "You choose the agents, tools, integrations, and permissions connected to a workspace. Review access scopes before use. Vectant is designed to make runtime evidence and authority boundaries inspectable, but it does not replace your review, security, or change-management responsibilities.",
  },
  {
    title: "Acceptable use",
    body: "Do not use the service to violate law, infringe rights, distribute malware, probe or disrupt systems without permission, evade safeguards, or interfere with other users. Do not use Vectant to build or operate a service where a failure could reasonably cause harm without appropriate independent controls.",
  },
  {
    title: "Pilot services",
    body: "Pilot access may be limited, changed, or withdrawn as we learn from real operating conditions. Features described as design direction or in development are not commitments to deliver. A signed order form or pilot agreement takes precedence over these terms where the documents conflict.",
  },
  {
    title: "Availability and support",
    body: "We work to operate Vectant reliably, but the service is provided on an as-available basis. Maintenance, third-party dependencies, and internet conditions can affect access. Do not rely on the service as the sole record for critical operations without maintaining your own backups and controls.",
  },
  {
    title: "Liability",
    body: "To the maximum extent permitted by law, Vectant is not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, data, goodwill, or business interruption. Nothing in these terms excludes liability that cannot legally be excluded.",
  },
  {
    title: "Changes and termination",
    body: "We may update these terms as the service changes. We will post the updated version here with a revised date. You may stop using Vectant at any time. We may suspend or end access for a material breach, security risk, or legal requirement.",
  },
];

export default function TermsPage() {
  return (
    <main className={styles.page} id="top">
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Vectant home">
          <AnimatedLogo expanded={false} className={styles.logo} markClassName={styles.mark} />
        </Link>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={15} weight="bold" />
          Back to home
        </Link>
      </header>

      <section className={styles.hero} aria-labelledby="terms-title">
        <p className={styles.kicker}>Company</p>
        <h1 id="terms-title">Terms of Service</h1>
        <p>
          The operating terms for access to Vectant, its website, and pilot services.
        </p>
        <time dateTime="2026-07-14">Last updated 14 July 2026</time>
      </section>

      <section className={styles.terms} aria-label="Terms of service">
        <aside className={styles.summary}>
          <p>Read this first</p>
          <strong>Your code stays yours. You remain responsible for the access you grant to people and agents.</strong>
          <span>
            If a written agreement with Vectant says something different, that agreement controls.
          </span>
        </aside>

        <div className={styles.sections}>
          {SECTIONS.map((section) => (
            <section key={section.title} className={styles.term}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </section>

      <section className={styles.contact} aria-label="Terms contact">
        <div>
          <p>Questions about these terms?</p>
          <span>Talk to us before a pilot begins.</span>
        </div>
        <a href={PILOT_MAILTO}>
          Contact Vectant
          <ArrowUpRight size={16} weight="bold" />
        </a>
        <a className={styles.email} href={`mailto:${PILOT_EMAIL}`}>{PILOT_EMAIL}</a>
      </section>
    </main>
  );
}
