import Link from "next/link";
import { ArrowLeft, Lock, Eye, EyeOff, Database, Trash2, Scale, Baby, RefreshCw, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - Vectant",
  description: "Vectant's privacy policy. Zero tracking, no cookies, your code stays yours.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#131112] text-[#E5E5E5]">
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#58A4B0] transition-colors text-sm mb-10"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">Last updated: April 2026</p>
        </div>

        {/* TL;DR banner */}
        <div className="relative overflow-hidden rounded-xl border border-[#58A4B0]/20 bg-[#58A4B0]/[0.04] p-6">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#58A4B0]" />
          <p className="text-sm font-medium text-white mb-2">TL;DR</p>
          <p className="text-slate-400 text-sm leading-relaxed">
            We collect your email when you join the waitlist and use cookie-free analytics for page views.
            That&apos;s it. No tracking, no fingerprinting, no selling data, no training AI on your code. Ever.
          </p>
        </div>

        <div className="space-y-14 text-slate-300 text-sm leading-relaxed">
          {/* Our Promise */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#58A4B0]/10 flex items-center justify-center flex-shrink-0">
                <Lock size={16} className="text-[#58A4B0]" />
              </div>
              <h2 className="text-xl font-semibold text-white">Our Promise</h2>
            </div>
            <p>
              Vectant is built by developers, for developers. We believe your code
              and data belong to you - full stop. We don&apos;t track you, we don&apos;t
              sell your data, and we don&apos;t train AI models on your code.
            </p>
            <p>
              This policy applies to the Vectant website (vectant.dev), the Vectant
              cloud IDE, and any related services we operate. By using Vectant you
              agree to the practices described here. If anything in this policy
              feels unclear, reach out - we&apos;re happy to explain in plain English.
            </p>
          </section>

          {/* What We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#58A4B0]/10 flex items-center justify-center flex-shrink-0">
                <Eye size={16} className="text-[#58A4B0]" />
              </div>
              <h2 className="text-xl font-semibold text-white">What We Collect</h2>
            </div>
            <p>
              We collect the bare minimum needed to operate. Here is a complete
              list - there is nothing else beyond this.
            </p>
            <div className="space-y-4 mt-4">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
                <p className="text-white font-medium text-sm">Waitlist email</p>
                <p className="text-slate-400 text-sm">
                  When you join our waitlist, we store your email address solely to
                  notify you about launch updates. We do not share this list with
                  anyone. You can request removal at any time and we will delete it
                  within 24 hours.
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
                <p className="text-white font-medium text-sm">Account information</p>
                <p className="text-slate-400 text-sm">
                  When the platform launches, creating an account will require an
                  email address and display name. We store only what is needed to
                  operate the service. You can change or delete this information at
                  any time from your account settings.
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
                <p className="text-white font-medium text-sm">Cookie-free analytics</p>
                <p className="text-slate-400 text-sm">
                  We use Vercel&apos;s privacy-friendly, cookie-free analytics for
                  aggregate page view counts. No personal data is collected, no
                  individual visitors are identified, and no data is shared with
                  advertisers. These analytics help us understand which pages are
                  useful so we can improve the product.
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
                <p className="text-white font-medium text-sm">Server logs</p>
                <p className="text-slate-400 text-sm">
                  Standard web-server logs (IP address, user-agent, timestamps)
                  may be retained for up to 30 days for security and abuse
                  prevention. Logs are automatically purged after that window.
                  They are never used for profiling, advertising, or analytics.
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
                <p className="text-white font-medium text-sm">Payment data</p>
                <p className="text-slate-400 text-sm">
                  If you subscribe to Vectant Pro, payments are processed by Stripe.
                  We never see or store your full card number. We only receive a
                  confirmation that payment succeeded and a reference ID for support
                  purposes. Stripe&apos;s privacy policy governs all payment data.
                </p>
              </div>
            </div>
          </section>

          {/* What We Don't Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#58A4B0]/10 flex items-center justify-center flex-shrink-0">
                <EyeOff size={16} className="text-[#58A4B0]" />
              </div>
              <h2 className="text-xl font-semibold text-white">What We Don&apos;t Collect</h2>
            </div>
            <p>
              This is not a marketing claim. These are hard technical decisions
              baked into how Vectant is built.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                "No cookies or tracking pixels",
                "No Google Analytics or Mixpanel",
                "No fingerprinting or session recording",
                "No selling or sharing data with third parties",
                "No training AI models on your code",
                "No social-media SDKs or embedded trackers",
                "No advertising networks or retargeting",
                "No telemetry without your explicit consent",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-white/[0.05] bg-white/[0.015] text-slate-400 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Your Code */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#58A4B0]/10 flex items-center justify-center flex-shrink-0">
                <Database size={16} className="text-[#58A4B0]" />
              </div>
              <h2 className="text-xl font-semibold text-white">Your Code</h2>
            </div>
            <p>
              Your source code is the most sensitive thing you trust us with.
              Here is exactly how we handle it - no vague language, no fine print.
            </p>
            <div className="space-y-4 mt-4">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
                <p className="text-white font-medium text-sm">Compilation</p>
                <p className="text-slate-400 text-sm">
                  Your code is sent to our cloud build servers, compiled, and the
                  build artifacts are returned to you. Source files are held in
                  memory only for the duration of the build and are not persisted
                  afterward. Build logs are kept for 7 days so you can debug issues,
                  then automatically deleted.
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
                <p className="text-white font-medium text-sm">AI features</p>
                <p className="text-slate-400 text-sm">
                  When you use AI-powered suggestions, the relevant code context is
                  sent to the language model to generate a response. We do not log,
                  store, or use these snippets for any training or analytics. The
                  context window is flushed after every request. You can disable AI
                  features entirely in your settings.
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
                <p className="text-white font-medium text-sm">Cloud workspace</p>
                <p className="text-slate-400 text-sm">
                  Files in your cloud workspace are encrypted at rest (AES-256) and
                  in transit (TLS 1.2+). Only you and collaborators you explicitly
                  invite can access them. We cannot read your files, and our
                  engineers do not have access to workspace contents.
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-4 space-y-1">
                <p className="text-emerald-400 font-medium text-sm">No training - ever</p>
                <p className="text-slate-400 text-sm">
                  Your code is never used to train, fine-tune, or improve any
                  machine-learning model. This is a hard rule, not a default you
                  have to opt out of. It will never change. If a future version of
                  Vectant ever offers opt-in telemetry, it will be clearly labeled,
                  off by default, and fully transparent about what is shared.
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
                <p className="text-white font-medium text-sm">Export and delete</p>
                <p className="text-slate-400 text-sm">
                  You can export your entire workspace as a zip archive at any time.
                  When you delete a file, it is removed immediately. When you delete
                  your account, all workspace data is fully purged within 30 days -
                  including backups.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#58A4B0]/10 flex items-center justify-center flex-shrink-0">
                <RefreshCw size={16} className="text-[#58A4B0]" />
              </div>
              <h2 className="text-xl font-semibold text-white">Data Retention</h2>
            </div>
            <p>Everything has an expiration date.</p>
            <div className="overflow-hidden rounded-lg border border-white/[0.06] mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="text-left text-slate-400 font-medium px-4 py-3">Data type</th>
                    <th className="text-left text-slate-400 font-medium px-4 py-3">Retention</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  <tr className="border-b border-white/[0.04]">
                    <td className="px-4 py-3 text-slate-300">Waitlist emails</td>
                    <td className="px-4 py-3">Until you request removal or waitlist closes</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="px-4 py-3 text-slate-300">Account data</td>
                    <td className="px-4 py-3">While active, deleted within 30 days of closure</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="px-4 py-3 text-slate-300">Server logs</td>
                    <td className="px-4 py-3">Auto-purged after 30 days</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="px-4 py-3 text-slate-300">Build logs</td>
                    <td className="px-4 py-3">Auto-purged after 7 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-300">Workspace files</td>
                    <td className="px-4 py-3">Deleted on removal, fully purged within 30 days of account deletion</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#58A4B0]/10 flex items-center justify-center flex-shrink-0">
                <Lock size={16} className="text-[#58A4B0]" />
              </div>
              <h2 className="text-xl font-semibold text-white">Security</h2>
            </div>
            <p>
              All data is encrypted in transit via TLS 1.2+ and at rest using
              AES-256. Our infrastructure is hosted on SOC 2-compliant providers.
              We conduct regular dependency audits and follow the OWASP Top 10
              guidelines throughout development.
            </p>
            <p>
              All access to production systems requires multi-factor authentication
              and is logged. We run automated vulnerability scanning on every deploy
              and perform periodic third-party security reviews.
            </p>
            <p>
              If you discover a security vulnerability, please report it to{" "}
              <a
                href="mailto:vectant.dev@gmail.com"
                className="text-[#58A4B0] hover:underline"
              >
                vectant.dev@gmail.com
              </a>
              . We take every report seriously and will respond within 48 hours.
            </p>
          </section>

          {/* Your Rights */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#58A4B0]/10 flex items-center justify-center flex-shrink-0">
                <Scale size={16} className="text-[#58A4B0]" />
              </div>
              <h2 className="text-xl font-semibold text-white">Your Rights</h2>
            </div>
            <p>Regardless of where you live, you can:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mt-2">
              <li>Request a full copy of all data we hold about you</li>
              <li>Correct or update your personal information</li>
              <li>Request deletion of your data at any time</li>
              <li>Withdraw consent for email communications</li>
              <li>Export your workspace and all associated files</li>
              <li>Request information on how your data is processed</li>
            </ul>
            <p>
              We aim to respond to all data requests within 72 hours. In most cases
              it takes less than 24.
            </p>
            <p>
              If you&apos;re in the EU/EEA, you also have rights under the GDPR
              including the right to lodge a complaint with your local data
              protection authority. If you&apos;re in California, the CCPA gives
              you additional rights regarding the sale of personal information -
              though we don&apos;t sell any, so there is nothing to opt out of.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#58A4B0]/10 flex items-center justify-center flex-shrink-0">
                <Baby size={16} className="text-[#58A4B0]" />
              </div>
              <h2 className="text-xl font-semibold text-white">Children&apos;s Privacy</h2>
            </div>
            <p>
              Vectant is not directed at children under 13. We do not knowingly
              collect data from anyone under this age. If you believe a child
              has provided us with personal information, please contact us and
              we will promptly delete it.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#58A4B0]/10 flex items-center justify-center flex-shrink-0">
                <RefreshCw size={16} className="text-[#58A4B0]" />
              </div>
              <h2 className="text-xl font-semibold text-white">Changes to This Policy</h2>
            </div>
            <p>
              We may update this policy as the product evolves. Material changes
              will be communicated via email to registered users and highlighted
              on this page. The &quot;Last updated&quot; date at the top will
              always reflect the most recent revision. We will never silently
              weaken your privacy protections.
            </p>
          </section>

          {/* Data Deletion */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#58A4B0]/10 flex items-center justify-center flex-shrink-0">
                <Trash2 size={16} className="text-[#58A4B0]" />
              </div>
              <h2 className="text-xl font-semibold text-white">Data Deletion</h2>
            </div>
            <p>
              Want off the waitlist? Email{" "}
              <a
                href="mailto:vectant.dev@gmail.com"
                className="text-[#58A4B0] hover:underline"
              >
                vectant.dev@gmail.com
              </a>{" "}
              and we&apos;ll remove your email within 24 hours. Once the
              platform launches, you&apos;ll be able to delete your account and
              all associated data directly from your settings page - no hoops,
              no hidden retention, no &quot;are you sure?&quot; dark patterns.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#58A4B0]/10 flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-[#58A4B0]" />
              </div>
              <h2 className="text-xl font-semibold text-white">Contact</h2>
            </div>
            <p>
              Questions about privacy? Reach us at{" "}
              <a
                href="mailto:vectant.dev@gmail.com"
                className="text-[#58A4B0] hover:underline"
              >
                vectant.dev@gmail.com
              </a>
              .
            </p>
            <p>
              Security concerns? Contact{" "}
              <a
                href="mailto:vectant.dev@gmail.com"
                className="text-[#58A4B0] hover:underline"
              >
                vectant.dev@gmail.com
              </a>
              .
            </p>
            <p className="text-slate-500 text-xs mt-4">
              We typically respond within one business day.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
