import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { Logo } from "@/components/Logo";
import { PILOT_EMAIL } from "@/lib/pilot";

import styles from "./privacy.module.css";

export const metadata = {
  title: "Privacy Policy - Vectant",
  description: "How Vectant handles information for its website and pilot services.",
};

const PRIVACY_MAILTO = `mailto:${PILOT_EMAIL}?subject=${encodeURIComponent(
  "Vectant privacy question"
)}`;

const SECTIONS = [
  {
    title: "Scope",
    body: (
      <>
        This policy explains how Vectant handles information when you visit our website,
        contact us, or use a Vectant pilot service. It sits alongside our{" "}
        <Link href="/terms">Terms of Service</Link>. If a signed pilot agreement or
        data-processing agreement says something different, that agreement controls for
        the service it covers.
      </>
    ),
  },
  {
    title: "Information we handle",
    body: "We handle information that is reasonably necessary to operate the website and provide, secure, and support a pilot.",
    details: [
      {
        label: "Contact and account details",
        copy: "Names, email addresses, organisation details, workspace administration details, and the correspondence you send us.",
      },
      {
        label: "Workspace content",
        copy: "Source code, prompts, files, configurations, outputs, logs, and other material you or your authorised users place in a workspace.",
      },
      {
        label: "Operational information",
        copy: "Service events, diagnostic information, browser or device information, IP addresses, and security signals created when the service is used.",
      },
      {
        label: "Connected services",
        copy: "Configuration and connection information needed to enable the agents, tools, extensions, or integrations you choose to connect.",
      },
    ],
  },
  {
    title: "How we use information",
    body: "We use information to provide the requested service, administer access, maintain and improve reliability, investigate abuse or security issues, respond to support requests, communicate about the pilot, and meet legal obligations. We do not sell personal information or use workspace content for advertising.",
  },
  {
    title: "Website measurement and local storage",
    body: "We may use aggregate website measurement to understand which pages are useful and to improve the site. Cookies or similar local storage may be used where necessary for security, sessions, or core functionality. If we introduce optional measurement or advertising technologies that require a choice under applicable law, we will provide the relevant notice and controls.",
  },
  {
    title: "When information is shared",
    body: "We share information only as needed to run the service: with authorised people in your workspace, providers that help us host, operate, secure, or support Vectant, and connected services you direct us to use. Providers act under appropriate contractual obligations. We may also disclose information when required by law or when necessary to protect people, Vectant, or the integrity of the service.",
  },
  {
    title: "Agents, tools, and integrations",
    body: "You decide which agents, extensions, tools, and integrations a workspace can use. Information you intentionally send to a connected service is also handled under that provider's terms and privacy practices. Review its permissions and policies before connecting it, and only provide access you are authorised to grant.",
  },
  {
    title: "Retention and deletion",
    body: "We retain information for as long as it is needed to provide the pilot, maintain security and records, resolve disputes, or meet legal obligations. The timing can vary by the information involved and any written pilot agreement. When a pilot ends or access is closed, we will handle workspace content and account information according to the applicable agreement and our operational requirements.",
  },
  {
    title: "Security",
    body: "We use technical and organisational measures intended to protect information against unauthorised access, loss, misuse, or disclosure. No service can guarantee absolute security. You are responsible for protecting your credentials, reviewing access scopes, and notifying us promptly if you believe an account or connected system has been compromised.",
  },
  {
    title: "Your choices and updates",
    body: "Depending on where you live, you may have rights to ask about, access, correct, delete, restrict, or object to certain processing of personal information. Contact us to make a request and we will respond as required by applicable law. We may update this policy as Vectant changes. The current version and revision date will always be posted here.",
  },
];

export default function PrivacyPage() {
  return (
    <main className={styles.page} id="top">
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Vectant home">
          <Logo className={styles.logo} markClassName={styles.mark} />
        </Link>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={15} weight="bold" />
          Back to home
        </Link>
      </header>

      <section className={styles.hero} aria-labelledby="privacy-title">
        <p className={styles.kicker}>Company</p>
        <h1 id="privacy-title">Privacy</h1>
        <p>
          How we handle information when you use Vectant&apos;s website and pilot
          services.
        </p>
        <time dateTime="2026-07-14">Last updated 14 July 2026</time>
      </section>

      <section className={styles.policy} aria-label="Privacy policy">
        <aside className={styles.summary}>
          <p>In plain language</p>
          <strong>
            Your workspace content remains yours. We use it to operate, secure, and
            support the service you asked us to provide.
          </strong>
          <span>
            A signed agreement can add service-specific privacy and data-processing
            terms.
          </span>
        </aside>

        <div className={styles.sections}>
          {SECTIONS.map((section) => (
            <section key={section.title} className={styles.section}>
              <h2>{section.title}</h2>
              <div>
                <p>{section.body}</p>
                {section.details ? (
                  <div className={styles.details}>
                    {section.details.map((detail) => (
                      <div key={detail.label}>
                        <h3>{detail.label}</h3>
                        <p>{detail.copy}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className={styles.contact} aria-label="Privacy contact">
        <div>
          <p>Questions about privacy?</p>
          <span>Ask us how a particular pilot or integration is handled.</span>
        </div>
        <a href={PRIVACY_MAILTO}>
          Contact Vectant
          <ArrowUpRight size={16} weight="bold" />
        </a>
        <a className={styles.email} href={`mailto:${PILOT_EMAIL}`}>
          {PILOT_EMAIL}
        </a>
      </section>
    </main>
  );
}
