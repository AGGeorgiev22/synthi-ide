import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { Logo } from "@/components/Logo";
import styles from "@/components/Footer.module.css";
import { PILOT_EMAIL, PILOT_MAILTO } from "@/lib/pilot";

const GROUPS = [
  {
    label: "Product",
    links: [
      { label: "Run boundary", href: "#runtime" },
      { label: "Authority", href: "#runtime-path" },
      { label: "GPU HMR", href: "#gpu-hmr" },
    ],
  },
  {
    label: "Evidence",
    links: [
      { label: "Proof reel", href: "#proof" },
      { label: "Technical questions", href: "#faq" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerShell}>
        <div className={styles.footerLead}>
          <Logo className={styles.footerLogo} markClassName={styles.footerMark} />
          <div>
            <h2>
              <span>Control the run.</span>
              <span>Keep the proof.</span>
            </h2>
            <a href={PILOT_MAILTO} className={styles.footerAction}>
              Request a proof pilot
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
                  <a key={link.label} href={link.href}>{link.label}</a>
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
            <Link href="/privacy">Privacy</Link>
            <a href="#top">Back to top</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
