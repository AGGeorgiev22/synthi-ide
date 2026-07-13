import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
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
  title: "Vectant - Runtime Control Plane for Production Agents",
  description:
    "Vectant is the cloud development environment where agents work under scoped authority, live runtime state, and reviewable proof.",
  keywords: [
    "cloud IDE",
    "AI development environment",
    "VS Code extension support",
    "bring your own agent",
    "agent infrastructure",
    "Vectant proof",
    "Vectant licenses",
    "replay ledger",
    "line provenance",
    "GPU HMR",
    "scoped authority",
    "MCP",
    "developer tools",
    "Vectant",
  ],
  authors: [{ name: "Vectant" }],
  metadataBase: new URL("https://vectant.dev"),
  openGraph: {
    title: "Vectant - Runtime Control Plane for Production Agents",
    description:
      "The cloud development environment where autonomous agents see the app, run the build, preserve state, earn scoped authority, and ship reviewable evidence.",
    url: "https://vectant.dev",
    siteName: "Vectant",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vectant - Runtime Control Plane for Production Agents",
    description:
      "The cloud runtime where production agents run with scoped authority, live state, and proof a reviewer can inspect.",
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
        className={`${geistSans.variable} ${geistMono.variable} ${satoshi.variable} ${spaceGrotesk.variable} antialiased`}
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
