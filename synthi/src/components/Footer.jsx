import Link from "next/link";

import { Logo } from "@/components/Logo";
import { PILOT_EMAIL, PILOT_MAILTO } from "@/lib/pilot";

const LINKS = [
  { label: "Runtime", href: "#runtime" },
  { label: "Authority", href: "#runtime-path" },
  { label: "GPU proof", href: "#gpu-hmr" },
  { label: "Evidence", href: "#proof" },
  { label: "FAQ", href: "#faq" },
];

const linkClass = "text-[12px] text-[#888b94] outline-none transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:text-[#f1eee8] focus-visible:text-[#f1eee8] focus-visible:ring-2 focus-visible:ring-[#55d8e8]/70";

export function Footer() {
  return (
    <footer className="relative bg-[#07080a] text-[#f1eee8]">
      <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] pt-10 lg:grid-cols-[minmax(320px,1fr)_auto] lg:items-end">
          <div>
            <Logo />
            <p className="mt-5 max-w-xl text-[clamp(1.55rem,3vw,3.1rem)] font-medium leading-[1.02] tracking-[-0.05em]">
              The runtime stays with the work.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-end">
            {LINKS.map((link) => (
              <a key={link.label} href={link.href} className={linkClass}>{link.label}</a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 text-[11px] text-[#6f727b] sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} Vectant. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href={PILOT_MAILTO} className={linkClass}>Request pilot</a>
            <a href={`mailto:${PILOT_EMAIL}`} className={linkClass}>Email</a>
            <Link href="/privacy" className={linkClass}>Privacy</Link>
            <a href="#top" className={linkClass}>Back to top</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
