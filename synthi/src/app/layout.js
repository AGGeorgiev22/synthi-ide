import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SITE_DESCRIPTION, SITE_ICON, SITE_NAME, SITE_SOCIAL_IMAGE, SITE_URL } from "@/lib/seo";

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

export const metadata = {
  title: "Vectant | Runtime Control Plane for Production Coding Agents",
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Developer tools",
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
    "ai infra",
    "deep tech",
    "novel",
    "enterprise infra",
    "runtime layer",
    "runtime",
  ],
  authors: [{ name: SITE_NAME }],
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
    title: "Vectant | Runtime Control Plane for Production Coding Agents",
    description:
      "The cloud development environment where autonomous agents see the app, run the build, preserve state, earn scoped authority, and ship reviewable evidence.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [SITE_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vectant | Runtime Control Plane for Production Coding Agents",
    description:
      "The cloud runtime where production agents run with scoped authority, live state, and proof a reviewer can inspect.",
    images: [SITE_SOCIAL_IMAGE.url],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "512x512" }],
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({ children }) {
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OnlineBusiness",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "Vectant Runtime Control Plane",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: SITE_ICON,
          contentUrl: SITE_ICON,
          width: 512,
          height: 512,
        },
        description: SITE_DESCRIPTION,
        email: "pilot@vectant.dev",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
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
