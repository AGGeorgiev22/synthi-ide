import Link from "next/link";

import { Logo } from "@/components/Logo";

const PILOT_EMAIL = "aleksandar.kolev@vectant.dev";
const PILOT_MAILTO = `mailto:${PILOT_EMAIL}?subject=${encodeURIComponent("Vectant proof pilot")}`;

const PRODUCT_LINKS = [
  { label: "Product", href: "#runtime" },
  { label: "Authority", href: "#runtime-path" },
  { label: "GPU HMR", href: "#gpu-hmr" },
  { label: "Proof", href: "#proof" },
  { label: "FAQ", href: "#faq" },
];

const linkClass = "rounded-[6px] text-[13px] text-ink-dim outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-bg">
      <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,0.6fr)] lg:items-start">
          <div>
            <Logo />
            <p className="mt-5 max-w-xl text-[clamp(1.35rem,2.4vw,2.35rem)] font-medium leading-[1.12] tracking-[-0.035em] text-ink">
              Parallel agents need a shared runtime and a visible boundary.
            </p>
            <p className="mt-4 max-w-lg text-[13px] leading-6 text-ink-dim">
              Vectant keeps authority, live state, evidence, and review context attached to the work.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">Explore</h3>
              <ul className="mt-4 grid gap-3">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.label}><a href={link.href} className={linkClass}>{link.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">Connect</h3>
              <ul className="mt-4 grid gap-3">
                <li><a href={PILOT_MAILTO} className={linkClass}>Request pilot</a></li>
                <li><a href={`mailto:${PILOT_EMAIL}`} className={linkClass}>Email</a></li>
                <li><Link href="/privacy" className={linkClass}>Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-5 text-[11px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} Vectant. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span>Cookie-free analytics</span>
            <a href="#top" className={linkClass}>Back to top</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
