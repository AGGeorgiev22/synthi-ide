import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { Logo } from "@/components/Logo";
import styles from "@/components/Footer.module.css";
import { PILOT_EMAIL, PILOT_MAILTO } from "@/lib/pilot";

const LINKS = [
  { label: "Run boundary", href: "#runtime" },
  { label: "Controlled flight", href: "#runtime-path" },
  { label: "Live engine", href: "#gpu-hmr" },
  { label: "Incident recorder", href: "#proof" },
  { label: "Field notes", href: "#faq" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerShell}>
        <div className={styles.footerLead}>
          <div>
            <p>END OF TRANSMISSION / VECTANT</p>
            <Logo className={styles.footerLogo} />
          </div>
          <h2>Control the run. Keep the proof.</h2>
        </div>

        <div className={styles.footerIndex}>
          <nav aria-label="Footer navigation">
            {LINKS.map((link, index) => (
              <a key={link.label} href={link.href}>
                <b>0{index + 1}</b>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          <div className={styles.footerContact}>
            <p>Bring the repository that needs a real boundary.</p>
            <a href={PILOT_MAILTO}>
              Request a proof pilot
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </div>
        </div>

        <div className={styles.footerLegal}>
          <p>Copyright {new Date().getFullYear()} Vectant. All rights reserved.</p>
          <div>
            <a href={`mailto:${PILOT_EMAIL}`}>Email</a>
            <Link href="/privacy">Privacy</Link>
            <a href="#top">Back to top</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
