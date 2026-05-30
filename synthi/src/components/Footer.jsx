import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Cloud Workspace", href: "#product" },
      { label: "Bring your agent", href: "#agents" },
      { label: "Workflows", href: "#workflows" },
      { label: "Pricing", href: "#pricing" },
      { label: "Compare", href: "#compare" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Docs", href: "#waitlist", soon: true },
      { label: "Changelog", href: "#waitlist", soon: true },
      { label: "Contact", href: "mailto:info@vectant.dev" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.8fr_1fr_1fr]">
          {/* brand */}
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-faint">
              A runtime-native development environment. Build inside the runtime - let the agent
              observe, patch, and verify.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] text-ink-faint">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_#2dd4ee]" />
              Private beta · early access
            </div>
          </div>

          {/* columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => {
                  const isInternalRoute = l.href.startsWith("/");
                  const content = (
                    <span className="inline-flex items-center gap-1.5">
                      {l.label}
                      {l.soon && (
                        <span className="rounded border border-line px-1 py-px font-mono text-[9px] uppercase tracking-wide text-ink-faint">
                          soon
                        </span>
                      )}
                    </span>
                  );
                  const cls =
                    "text-[13.5px] text-ink-dim transition-colors hover:text-ink";
                  if (isInternalRoute) {
                    return (
                      <li key={l.label}>
                        <Link href={l.href} className={cls}>
                          {content}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className={cls}
                        {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {content}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-[12.5px] text-ink-faint">
            © {new Date().getFullYear()} Vectant. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[12.5px] text-ink-dim transition-colors hover:text-ink">
              Privacy
            </Link>
            <span className="text-[12.5px] text-ink-faint">No tracking · cookie-free analytics</span>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-dim transition-colors hover:text-ink"
            >
              Back to top
              <ArrowUp size={13} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
