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
  title: "Vectant - The Agentic Environment",
  description:
    "Vectant is a Fully Autonomous Agentic Runtime Environment (FAARE) - a cloud workspace where your agent observes builds, logs, crashes, tests, and GPU feedback, then patches in place and verifies fixes against the live runtime.",
  keywords: [
    "runtime-native AI",
    "AI development environment",
    "cloud IDE",
    "CUDA",
    "ROCm",
    "game engine development",
    "MCP",
    "developer tools",
    "Vectant",
  ],
  authors: [{ name: "Vectant" }],
  metadataBase: new URL("https://vectant.dev"),
  openGraph: {
    title: "Vectant - The Agentic Environment",
    description:
      "Build inside the runtime. Let the agent observe, patch, and verify against real execution signals.",
    url: "https://vectant.dev",
    siteName: "Vectant",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vectant - The Agentic Environment",
    description:
      "A Fully Autonomous Agentic Runtime Environment. The agent observes builds, logs, crashes, tests, and GPU feedback, then patches in place and verifies.",
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
