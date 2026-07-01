import { Geist, Geist_Mono, Instrument_Serif, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const serifDisplay = Instrument_Serif({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Brand display face (stands in for Aquire until licensed files are added).
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "../../fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata = {
  title: "Vectant - Proof-Gated Runtime for Production Agents",
  description:
    "Vectant is the cloud runtime where trusted agents run real software, preserve state, prove native GPU hot paths, earn authority, collaborate live, and ship replayable evidence.",
  keywords: [
    "cloud IDE",
    "AI development environment",
    "VS Code extension support",
    "bring your own agent",
    "agent infrastructure",
    "CodeSite",
    "Causal Twin",
    "counterfactual telemetry",
    "Agent Dojo",
    "allostatic evidence",
    "GPU HMR",
    "minimum authority",
    "MCP",
    "developer tools",
    "Vectant",
  ],
  authors: [{ name: "Vectant" }],
  metadataBase: new URL("https://vectant.dev"),
  openGraph: {
    title: "Vectant - Proof-Gated Runtime for Production Agents",
    description:
      "The cloud runtime where autonomous agents see the app, run the build, preserve state, prove GPU hot paths, earn scoped authority, and ship replayable evidence.",
    url: "https://vectant.dev",
    siteName: "Vectant",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vectant - Proof-Gated Runtime for Production Agents",
    description:
      "The cloud runtime where agents run, reload, preserve state, prove, remember, and earn authority.",
  },
  icons: {
    icon: "/Vectant-logo-white.svg",
    shortcut: "/Vectant-logo-white.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${serifDisplay.variable} ${satoshi.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster
            richColors
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--color-panel)",
                border: "1px solid var(--color-line-2)",
                color: "var(--color-ink)",
              },
            }}
          />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
