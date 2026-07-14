import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { Logo } from "@/components/Logo";
import styles from "@/components/Footer.module.css";
import { PILOT_EMAIL } from "@/lib/pilot";

const GROUPS = [
  {
    label: "Product",
    links: [
      { label: "Guarded run", href: "#guarded-run" },
      { label: "GPU HMR", href: "#gpu-hmr" },
      { label: "Buyer outcomes", href: "#systems" },
      { label: "Who it is for", href: "#teams" },
    ],
  },
  {
    label: "Evidence",
    links: [
      { label: "Proof bundle", href: "#proof" },
      { label: "Enterprise controls", href: "#technical-confidence" },
      { label: "Technical questions", href: "#faq" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerShell}>
        <div className={styles.footerLead}>
          <Link href="/" className={styles.footerBrand} aria-label="Vectant home">
            <Logo className={styles.footerLogo} markClassName={styles.footerMark} />
          </Link>
          <div>
            <h2>
              <span>Control the run.</span>
              <span>Keep the proof.</span>
            </h2>
            <a href="#pilot" className={styles.footerAction}>
              Scope the proof pilot
              <ArrowUpRight size={17} weight="bold" />
            </a>
          </div>
        </div>

        <div className={styles.footerDirectory}>
          {GROUPS.map((group) => (
            <section key={group.label}>
              <p>{group.label}</p>
              <nav aria-label={`${group.label} links`}>
                {group.links.map((link) => (
                  link.href.startsWith("/") ? (
                    <Link key={link.label} href={link.href}>{link.label}</Link>
                  ) : (
                    <a key={link.label} href={link.href}>{link.label}</a>
                  )
                ))}
              </nav>
            </section>
          ))}

          <section className={styles.footerContact}>
            <p>Contact</p>
            <span>Bring the guarded repository. Keep your agent stack.</span>
            <a href={`mailto:${PILOT_EMAIL}`}>{PILOT_EMAIL}</a>
          </section>
        </div>

        <div className={styles.footerLegal}>
          <p>Copyright {new Date().getFullYear()} Vectant. All rights reserved.</p>
          <div>
            <a href="#top">Back to top</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
