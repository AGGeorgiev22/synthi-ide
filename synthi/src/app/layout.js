import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SITE_SOCIAL_IMAGE, SITE_URL } from "@/lib/seo";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const aquireLight = localFont({
  src: "../../fonts/Aquire-Light.otf",
  variable: "--font-aquire-light",
  weight: "300",
  display: "swap",
});

const aquire = localFont({
  src: "../../fonts/Aquire-Regular.otf",
  variable: "--font-aquire",
  weight: "400",
  display: "swap",
});

const aquireBold = localFont({
  src: "../../fonts/Aquire-Bold.otf",
  variable: "--font-aquire-bold",
  weight: "700",
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "../../fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const cabinetGrotesk = localFont({
  src: [
    { path: "../../fonts/CabinetGrotesk-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/CabinetGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/CabinetGrotesk-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-cabinet",
  display: "swap",
});

const siteDescription =
  "Vectant is the cloud development environment where agents work under scoped authority, live runtime state, and reviewable proof.";

export const metadata = {
  title: "Vectant - Runtime Control Plane for Production Agents",
  description: siteDescription,
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
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Vectant - Runtime Control Plane for Production Agents",
    description:
      "The cloud development environment where autonomous agents see the app, run the build, preserve state, earn scoped authority, and ship reviewable evidence.",
    url: SITE_URL,
    siteName: "Vectant",
    type: "website",
    locale: "en_US",
    images: [SITE_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vectant - Runtime Control Plane for Production Agents",
    description:
      "The cloud runtime where production agents run with scoped authority, live state, and proof a reviewer can inspect.",
    images: [SITE_SOCIAL_IMAGE.url],
  },
  icons: {
    icon: "/Vectant-logo-white.svg",
    shortcut: "/Vectant-logo-white.svg",
  },
};

export default function RootLayout({ children }) {
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Vectant",
        url: SITE_URL,
        logo: `${SITE_URL}/Vectant-logo-white.svg`,
        description: siteDescription,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Vectant",
        url: SITE_URL,
        description: siteDescription,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistMono.variable} ${satoshi.variable} ${cabinetGrotesk.variable} ${aquireLight.variable} ${aquire.variable} ${aquireBold.variable}`}
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c") }}
        />
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
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
